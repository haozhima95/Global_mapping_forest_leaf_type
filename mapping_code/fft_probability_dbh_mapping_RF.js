// This file is used for mapping global distribution of forest leaf type based on DBH or stem based datasets. 


// Load the composite layers
var soilmoisture = ee.Image('users/haozhima95/wld_soil_moisture');
print(soilmoisture);

var forestage = ee.Image('projects/crowtherlab/johan/Besnard_ForestAge');

var comp = ee.Image('users/leonidmoore/ForestBiomass/20200915_Forest_Biomass_Predictors_Image');
    comp = comp.addBands(soilmoisture);
    comp = comp.addBands(forestage.select([0]));


 print(comp);
// Load the datasets
// Load the variables that would be used for training.
var compnames = [
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
  'HumanFootprint',
  'Human_Development_Percentage',
  'LandCoverClass_Cultivated_and_Managed_Vegetation',
  'LandCoverClass_Urban_Builtup',
  'SG_Absolute_depth_to_bedrock',
  // 'WorldClim2_SolarRadiation_AnnualMean',
  'WorldClim2_WindSpeed_AnnualMean',
  'SG_Clay_Content_0_100cm',
  'SG_Coarse_fragments_0_100cm',
  'SG_Sand_Content_0_100cm',
  'SG_Silt_Content_0_100cm',
  'SG_Soil_pH_H2O_0_100cm',
  'Nitrogen',
  'Tree_Density',
  'cropland',
  'grazing',
  "pasture",
  "rangeland",
  'cnRatio',
  'ir_norice',
  'ir_rice',
  'rf_norice',
  'rf_rice',
  'tot_irri',
  'tot_rainfed',
  'tot_rice',
  'forest_age_TC000'
  ];



   
  var image = ee.Image("users/haozhima95/consensus_full_class_tree1"),
    image2 = ee.Image("users/haozhima95/consensus_full_class_tree2"),
    image3 = ee.Image("users/haozhima95/consensus_full_class_tree3"),
    image4 = ee.Image("users/haozhima95/consensus_full_class_tree4");


// Limit the forest range into higher than 10% canopy cover.
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



// Load the one-class dataset with fold assignment.



function JSsequence(i) {
	return i ? JSsequence(i - 1).concat(i) : []
}
var numberOfSubsets = 100;
var seedlist = JSsequence(numberOfSubsets);


// Initialize a function for loading the training datasets and mapping.

seedlist.map(function(seedtouse){

    var df = ee.FeatureCollection('users/haozhima95/mapping_forest_functional_type/random_occurrence_with_env_dbh_'+seedtouse+'_recent_withfold_with_index_20221010');



print(df.size())




var trainedBootstrapClassifier = randomForestClassifier.train({
    features: df,
    classProperty: 'class',
    inputProperties: compnames
});
  

var bootstrapImage = comp.classify(trainedBootstrapClassifier);
	  bootstrapImage = bootstrapImage.mask(treerange);
  
  
// Now the output for each pixel is a four-element array. To dissolve this array, run the following rows.	    

var fft0 = bootstrapImage.arrayGet(0).rename('be_pred'); // Broadleaved evergreen.
var fft1 = bootstrapImage.arrayGet(1).rename('bd_pred'); // Broadleaved deciduous.
var fft2 = bootstrapImage.arrayGet(2).rename('ne_pred'); // Needle-leaved evergreen.
var fft3 = bootstrapImage.arrayGet(3).rename('nd_pred'); // Needle-leaved deciduous.

 

var fft_probability = fft0.addBands(fft1).addBands(fft2).addBands(fft3);



var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

// Output all the images.
Export.image.toAsset({
  image:fft_probability,
  description:'fft_probability_mapping_dbh_occurrence_recent_'+seedtouse+'_20221010',
  assetId:'users/haozhima95/mapping_forest_functional_type/fft_probability_dbh_occurrence_recent_'+seedtouse+'_20221010',
  region: unboundedGeo,
 	crs: 'EPSG:4326',
 	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	maxPixels: 1e13
});



}); // End this function. 



