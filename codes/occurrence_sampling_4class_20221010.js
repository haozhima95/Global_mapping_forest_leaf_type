// This script is used for sampling environmental variables 

// Load the dataset




function JSsequence(i) {
	return i ? JSsequence(i - 1).concat(i) : []
}
var numberOfSubsets = 90;
var seedlist = JSsequence(numberOfSubsets);


// var seedlist = 

seedlist.map(function(seedtouse){

var df = ee.FeatureCollection('users/haozhima95/mapping_forest_functional_type/random_sampled_occurrence_stem_'+seedtouse+'_recent_withfold_with_index_20221010');
print(df.size())
// Map.addLayer(df);


// Load the composite layers
var soilmoisture = ee.Image('users/haozhima95/wld_soil_moisture');
var forestage = ee.Image('projects/crowtherlab/johan/Besnard_ForestAge');

// print(soilmoisture);
var comp = ee.Image('users/leonidmoore/ForestBiomass/20200915_Forest_Biomass_Predictos_Image');
    comp = comp.addBands(soilmoisture);
    comp = comp.addBands(forestage.select([0]));
// Load the datasets 

// Map.addLayer(comp);

// Sampling


var sampleddf = df.map(function(f){
  var ss = comp.sampleRegions({
    collection:f,
    scale:1000,
    tileScale:16,
    geometries:true
  });
  return ss;
});


    sampleddf = sampleddf.flatten();
    
// print(sampleddf.limit(3));

// print(sampleddf.size());


Export.table.toAsset({
  collection:sampleddf,
  description:'random_occurrence_with_env_stem_'+seedtouse+'_recent_withfold_with_index_20221010',
  assetId:'users/haozhima95/mapping_forest_functional_type/random_occurrence_with_env_stem_'+seedtouse+'_recent_withfold_with_index_20221010'
});


});


