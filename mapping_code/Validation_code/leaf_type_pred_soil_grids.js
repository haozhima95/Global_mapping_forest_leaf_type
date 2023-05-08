// This script is used for a developed k-fold cross validation to predict leaf types by soil grids. 

// Load the datasets


var ds = ee.FeatureCollection('users/haozhima95/wosis_with_fold');
print(ds.limit(2));



// Load the one-class dataset with fold assignment.

var dfwithoneclass = ee.FeatureCollection('users/haozhima95/random_sampled_with_wosis_1with_fold_with_env_20230505');

print(dfwithoneclass.limit(10));


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
  'Nitrogen',
  // 'clayvalue',
  // 'siltvalue',
  // 'soilphvalue',
  // 'sandvalue',
  // 'coarsefragvalue',
  // 'nitrogenvalue',
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
  // 'PET'
  ];
  
  print(compnames)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Set the classifier


var randomForestClassifier = ee.Classifier.smileRandomForest({
	numberOfTrees: 250,
	variablesPerSplit: 5,
	minLeafPopulation:20,
	bagFraction: 0.632,
	// maxNodes:33554432,
	seed: 0
}).setOutputMode('MULTIPROBABILITY');




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function JSsequence(i) {
	return i ? JSsequence(i - 1).concat(i) : []
}
var k = 10;
var kfold = JSsequence(k);
print(kfold);
// Loop the folds


kfold.map(function(i){
  var foldnumber = i;
  // print(foldnumber);
  var trainingdata = dfwithoneclass.filterMetadata('fold', 'not_equals', foldnumber);
 print(trainingdata.size())
  var validationdata = ds.filterMetadata('fold', 'equals', foldnumber);
  print(validationdata.size())
//   Export.table.toAsset({
//     collection:validationdata,
//     description:'validation_'+foldnumber
//   });
// });
  var trainedclassifier = randomForestClassifier.train({
  features: trainingdata,
  classProperty:'class',
  inputProperties:compnames
});

  var classifiedvalidationdata = validationdata.classify(trainedclassifier);
      

      classifiedvalidationdata = classifiedvalidationdata.map(function(f){
          var cc = f.getArray('classification');
          var fc = f.set('be_pred',cc.get([0]));
              fc = fc.set('bd_pred', cc.get([1]));
              fc = fc.set('ne_pred', cc.get([2]));
              fc = fc.set('nd_pred', cc.get([3]));
          return fc;
    });
    print(classifiedvalidationdata.limit(10));
  Export.table.toCloudStorage({
    collection:classifiedvalidationdata,
    description:'prediction_fold_'+foldnumber+'_soil_grids',
    fileFormat:'CSV',
    bucket:'haozhi_ma'
  });
});
  

