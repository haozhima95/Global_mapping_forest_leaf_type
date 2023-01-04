// This script is used for sampling environmental variables across all 100 subsampled datasets.

// This script is run in Google Earth Engine.

// Load the dataset



// Create a list of number sequence from 1 to 100.
function JSsequence(i) {
	return i ? JSsequence(i - 1).concat(i) : []
}
var numberOfSubsets = 100;
var seedlist = JSsequence(numberOfSubsets);




seedlist.map(function(seedtouse){

var df = ee.FeatureCollection('users/haozhima95/mapping_forest_functional_type/random_sampled_occurrence_stem_'+seedtouse+'_recent_withfold_with_index_20221010'); // File name, change it to your own. Stem can be changed into dbh. 
print(df.size())


// Load the composite layers
var soilmoisture = ee.Image('users/haozhima95/wld_soil_moisture');
var forestage = ee.Image('projects/crowtherlab/johan/Besnard_ForestAge');


var comp = ee.Image('users/leonidmoore/ForestBiomass/20200915_Forest_Biomass_Predictos_Image');
    comp = comp.addBands(soilmoisture);
    comp = comp.addBands(forestage.select([0]));

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
    

Export.table.toAsset({
  collection:sampleddf,
  description:'random_occurrence_with_env_stem_'+seedtouse+'_recent_withfold_with_index_20221010', // Name the new file.
  assetId:'users/haozhima95/mapping_forest_functional_type/random_occurrence_with_env_stem_'+seedtouse+'_recent_withfold_with_index_20221010' // Save to the targeted directory.
});


});


