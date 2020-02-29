// This script is used for mapping approaches in boreal ecosystems

// load the files

var comp = ee.Image("users/haozhima95/Devin_environment_composite_20190218"),
    soil_moisture = ee.Image("users/haozhima95/wld_soil_moisture"),
    water_depth = ee.Image("users/haozhima95/water_depth"),
    tropicalleaf = ee.FeatureCollection("users/haozhima95/forest_pheno/tropical_wdpa_sampled_20191121"),
    image = ee.Image("users/haozhima95/consensus_full_class_tree1"),
    image2 = ee.Image("users/haozhima95/consensus_full_class_tree2"),
    image3 = ee.Image("users/haozhima95/consensus_full_class_tree3"),
    image4 = ee.Image("users/haozhima95/consensus_full_class_tree4"),
    table = ee.FeatureCollection("users/haozhima95/wwf_terr_ecos");
    
var tabletorf = ee.FeatureCollection('users/haozhima95/forest_pheno/boreal_wdpa_sampled_20191121');

print(tropicalleaf.limit(1));

var all_tree = ee.ImageCollection([image, image2, image3, image4]);
    all_tree = all_tree.sum();
var treemask = all_tree.gte(10);
var treerange = all_tree.mask(treemask.gt(0));

var region1 = table.filterMetadata('BIOME','equals',6);
var region2 = table.filterMetadata('BIOME','equals',11);
// var region3 = table.filterMetadata('BIOME','equals',8);

var tree1 = treerange.clip(region1);
var tree2 = treerange.clip(region2);
// var tree3 = treerange.clip(region3);

var allrange = ee.ImageCollection([tree1,tree2]);
    allrange = allrange.mosaic();

//Map.addLayer(allrange);

    comp = comp.addBands(soil_moisture);
    comp = comp.addBands(water_depth);

// Make a list of covariates to use
var covarsToUse_Current = [
                            'Annual_Mean_Radiation', 
                            'Annual_Mean_Temperature', 
                             'Annual_Precipitation', 
                             'Bulk_Density_15cm', 
                             'CContent_15cm', 
                             'CatIonExcCap_15cm', 
                             'Clay_Content_15cm', 
                             'CorFragVolPerc_15cm', 
                             'Depth_to_Bedrock', 
                             'Highest_Weekly_Radiation', 
                             'Isothermality', 
                             'Lowest_Weekly_Radiation', 
                             'Max_Temperature_of_Warmest_Month', 
                             'Mean_Diurnal_Range', 
                             'Mean_Temperature_of_Coldest_Quarter', 
                             'Mean_Temperature_of_Driest_Quarter', 
                             'Mean_Temperature_of_Warmest_Quarter', 
                             'Mean_Temperature_of_Wettest_Quarter', 
                             'Min_Temperature_of_Coldest_Month', 
                             'OrgCStockTHa_5to15cm', 
                             'Precipitation_Seasonality', 
                             'Precipitation_of_Coldest_Quarter', 
                             'Precipitation_of_Driest_Month', 
                             'Precipitation_of_Driest_Quarter', 
                             'Precipitation_of_Warmest_Quarter', 
                             'Precipitation_of_Wettest_Month', 
                             'Precipitation_of_Wettest_Quarter', 
                             'PredProb_of_R_Horizon', 
                             'Radiation_Seasonality', 
                             'Radiation_of_Coldest_Quarter', 
                             'Radiation_of_Driest_Quarter', 
                             'Radiation_of_Warmest_Quarter', 
                             'Radiation_of_Wettest_Quarter', 
                             'Sand_Content_15cm', 
                             'Silt_Content_15cm', 
                             'Temperature_Annual_Range', 
                             'Temperature_Seasonality', 
                             'depth', 
                             'eastness', 
                             'elevation', 
                             'hillshade', 
                             'northness', 
                             'pHinHOX_15cm', 
                             'slope', 
                             'soil_moisture'
];

var varscutfromcomp = [
                             'Annual_Mean_Radiation',
                             'Bulk_Density_15cm', 
                             'CContent_15cm', 
                             'CatIonExcCap_15cm', 
                             'Clay_Content_15cm', 
                             'CorFragVolPerc_15cm', 
                             'Depth_to_Bedrock', 
                             'Highest_Weekly_Radiation', 
                             'Lowest_Weekly_Radiation',
                             'OrgCStockTHa_5to15cm', 
                             'PredProb_of_R_Horizon', 
                             'Radiation_Seasonality', 
                             'Radiation_of_Coldest_Quarter', 
                             'Radiation_of_Driest_Quarter', 
                             'Radiation_of_Warmest_Quarter', 
                             'Radiation_of_Wettest_Quarter', 
                             'Sand_Content_15cm', 
                             'Silt_Content_15cm', 
                             'depth', 
                             'eastness', 
                             'elevation', 
                             'hillshade', 
                             'northness', 
                             'pHinHOX_15cm', 
                             'slope', 
                             'soil_moisture'
                             
                             
                             
  ];

    print(covarsToUse_Current);
    comp = comp.select(varscutfromcomp);
var futurebi = ee.Image('users/haozhima95/future_clim/future_mg85');
var bandrename = futurebi.select([1]);
    bandrename = bandrename.rename('Mean_Diurnal_Range');
var newcomp = comp.addBands(futurebi);
    newcomp = newcomp.addBands(bandrename);
print(newcomp);

var mtry = [7,10,4,8,6,20,5,30,9,20];
print(mtry);

var leafpop = [2,2,2,2,2,2,2,2,2,3];


for(var i = 0; i<10; i++){
  
  
  var randomForestClassifier = ee.Classifier.randomForest({
	numberOfTrees: 100,
	variablesPerSplit: mtry[i],
	minLeafPopulation:leafpop[i],
	bagFraction: 0.632,
	seed: 0
}).setOutputMode('REGRESSION');



//Train the classifiers with the sampled points
var trainedClassifier = randomForestClassifier.train({
  features:tabletorf,
  classProperty:'spphcor',
  inputProperties:covarsToUse_Current
});
print(trainedClassifier);

var finalMap = newcomp.classify(trainedClassifier,'pheno_pred');
    finalMap = finalMap.mask(allrange);


var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

var colors = ['FDE725', '8ED542', '36B677', '218F8B', '30678D', '433982', '440154'];
var vis = {min:10, max:100, palette: colors};


Map.addLayer(finalMap,vis);
var st = i+1
Export.image.toAsset({
  image:finalMap,
  description:'boreal_wdpa_rf_sppcor_mg85_'+st,
  assetId:'users/haozhima95/forest_pheno/boreal_wdpa_rf_sppcor_mg85_'+st,
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});



}
