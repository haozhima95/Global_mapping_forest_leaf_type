// This file is used for mapping future predictions using CMIP6 future climate layers from Karger et al (CHELSA). 


// Load the composite layers
var soilmoisture = ee.Image('users/haozhima95/wld_soil_moisture');
print(soilmoisture);
var forestage = ee.Image('projects/crowtherlab/johan/Besnard_ForestAge');



var comp = ee.Image('users/leonidmoore/ForestBiomass/20200915_Forest_Biomass_Predictors_Image');
    comp = comp.addBands(soilmoisture);
    comp = comp.addBands(forestage.select([0]));


// Load the variables that would be used for training.
var compnames = [
  'Aridity_Index',
  'CHELSA_Annual_Mean_Temperature',
  'CHELSA_Annual_Precipitation',
  'CHELSA_Isothermality',
  'CHELSA_Max_Temperature_of_Warmest_Month',
  'CHELSA_Mean_Diurnal_Range',
  'CHELSA_Mean_Temperature_of_Coldest_Quarter',
  'CHELSA_Mean_Temperature_of_Driest_Quarter',
  'CHELSA_Mean_Temperature_of_Warmest_Quarter',
  'CHELSA_Mean_Temperature_of_Wettest_Quarter',
  'CHELSA_Min_Temperature_of_Coldest_Month',
  'CHELSA_Precipitation_Seasonality',
  'CHELSA_Precipitation_of_Coldest_Quarter',
  'CHELSA_Precipitation_of_Driest_Month',
  'CHELSA_Precipitation_of_Driest_Quarter',
  // 'CHELSA_Precipitation_of_Warmest_Quarter',
  'CHELSA_Precipitation_of_Wettest_Month',
  'CHELSA_Precipitation_of_Wettest_Quarter',
  'CHELSA_Temperature_Annual_Range',
  'CHELSA_Temperature_Seasonality',
  'CanopyHeight',
  'Depth_to_Water_Table',
  'EVI',
  'NDVI',
  'EarthEnvCloudCover_MODCF_interannualSD',
  'EarthEnvCloudCover_MODCF_intraannualSD',
  'EarthEnvCloudCover_MODCF_meanannual',
  'EarthEnvTopoMed_AspectCosine',
  'EarthEnvTopoMed_AspectSine',
  'EarthEnvTopoMed_Eastness',
  'EarthEnvTopoMed_Elevation',
  'EarthEnvTopoMed_Northness',
  'EarthEnvTopoMed_ProfileCurvature',
  'EarthEnvTopoMed_Roughness',
  'EarthEnvTopoMed_Slope',
  'EarthEnvTopoMed_TangentialCurvature',
  'EarthEnvTopoMed_TerrainRuggednessIndex',
  'EarthEnvTopoMed_TopoPositionIndex',
  'EarthEnvTopoMed_VectorRuggednessMeasure',
  'Fpar',
  'GlobBiomass_GrowingStockVolume',
  'HumanFootprint',
  'Human_Development_Percentage',
  // 'Human_Disturbance',
  'Lai',
  'LandCoverClass_Cultivated_and_Managed_Vegetation',
  'LandCoverClass_Urban_Builtup',
  'Npp',
  'PET',
  // 'Population_Density',
  'PotentialForestCover',
  'SG_Absolute_depth_to_bedrock',
  'WorldClim2_SolarRadiation_AnnualMean',
  'WorldClim2_WindSpeed_AnnualMean',
  'WorldClim2_H2OVaporPressure_AnnualMean',
  // 'EarthEnvCloudCover_MODCF_interannualSD',
  // 'EarthEnvCloudCover_MODCF_intraannualSD',
  // 'EarthEnvCloudCover_MODCF_meanannual',
  // 'EarthEnvTopoMed_AspectCosine',
  // 'EarthEnvTopoMed_AspectSine',
  'SG_Clay_Content_0_100cm',
  'SG_Coarse_fragments_0_100cm',
  'SG_Sand_Content_0_100cm',
  'SG_Silt_Content_0_100cm',
  'SG_Soil_pH_H2O_0_100cm',
  'Tree_Density',
  // 'WDPA',
  // 'WWF_Biome',
  'cropland',
  'grazing',
  "pasture",
  "rangeland",
  'soil_moisture',
  // 'soil_nitrogen',
  'cnRatio',
  'ir_norice',
  'ir_rice',
  'rf_norice',
  'rf_rice',
  'tot_irri',
  'tot_rainfed',
  'tot_rice',
  // 'treecover2000',
  'forest_age_TC000'
  ];
  
  
  var image = ee.Image("users/haozhima95/consensus_full_class_tree1"),
    image2 = ee.Image("users/haozhima95/consensus_full_class_tree2"),
    image3 = ee.Image("users/haozhima95/consensus_full_class_tree3"),
    image4 = ee.Image("users/haozhima95/consensus_full_class_tree4");

var all_tree = ee.ImageCollection([image, image2, image3, image4]);
    all_tree = all_tree.sum();
var treemask = all_tree.gt(10);
var treerange = all_tree.mask(treemask.gt(0));



// Instantiate classifiers of interest according to hyperparameter dataset 
var randomForestClassifier = ee.Classifier.smileRandomForest({
	numberOfTrees: 250,
	variablesPerSplit: 20,
	minLeafPopulation:20,
	bagFraction: 0.632,
	// maxNodes:33554432,
	seed: 0
}).setOutputMode('MULTIPROBABILITY');


var timeperiod = [ '2071-2100'];

var rcp = ['ssp126','ssp370', 'ssp585'];


var modelname = ['ukesm1-0-ll']// 'gfdl-esm4','ipsl-cm6a-lr', 'mpi-esm1-2-hr', 'mri-esm2-0', 'ukesm1-0-ll' one of them. 

var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);


// Load the one-class dataset with fold assignment.
function JSsequence(i) {
	return i ? JSsequence(i - 1).concat(i) : []
}
var numberOfSubsets = 100;
var seedlist = JSsequence(numberOfSubsets);



var allim = seedlist.map(function(seedtouse){

    var df = ee.FeatureCollection('users/haozhima95/mapping_forest_functional_type/random_occurrence_with_env_dbh_'+seedtouse+'_recent_withfold_with_index_20221010');




var trainedBootstrapClassifier = randomForestClassifier.train({
    features: df,
    classProperty: 'class',
    inputProperties: compnames
});
  



// Load the future clim composites.




var futim = ee.Image('users/haozhima95/future_clim/CHELSA_2071-2100_'+modelname[0]+'_ssp585_standardized');


var prepdry = futim.select([13]);
    prepdry = prepdry.unmask(0);
    prepdry = prepdry.rename('CHELSA_Precipitation_of_Driest_Month');
    futim = futim.addBands({
      srcImg:prepdry,
      overwrite:true
    });

var newcomp = comp.addBands({
  srcImg:futim,
  overwrite:true
});




var bootstrapImage = newcomp.classify(trainedBootstrapClassifier);
	  bootstrapImage = bootstrapImage.mask(treerange);
	    


var fft0 = bootstrapImage.arrayGet(0).rename('be_pred');
var fft1 = bootstrapImage.arrayGet(1).rename('bd_pred');
var fft2 = bootstrapImage.arrayGet(2).rename('ne_pred');
var fft3 = bootstrapImage.arrayGet(3).rename('nd_pred');



var fft_probability = fft0.addBands(fft1).addBands(fft2).addBands(fft3);


Map.addLayer(fft_probability)


return fft_probability

});

    allim = ee.ImageCollection(allim)

var immean = allim.reduce(ee.Reducer.mean());

var imstd = allim.reduce(ee.Reducer.stdDev()).toFloat();

var imlowandhigh = allim.reduce(ee.Reducer.percentile([2.5,97.5]));


var alltogether = immean.addBands(imstd).addBands(imlowandhigh);

print(alltogether);



var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);


// Export.

Export.image.toAsset({
  image:alltogether,
  description:'fft_future_clim_dbh_2071-2100_'+modelname[0]+'_ssp585_allsummary_20221010',
  assetId:'users/haozhima95/mapping_forest_functional_type/fft_future_clim_dbh_2071-2100_'+modelname[0]+'_ssp585_allsummary_20221010',
  region: unboundedGeo,
 	crs: 'EPSG:4326',
 	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	maxPixels: 1e13
});



