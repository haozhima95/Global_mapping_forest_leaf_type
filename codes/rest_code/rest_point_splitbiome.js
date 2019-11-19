/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// This script is used for exporting non-protected area points by biomes. 
// All the sub-records will be sampled by environmental covariates.

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


for(var i = 1; i<15; i++){
// Define biome region
  var region = biome.filterMetadata('BIOME','equals',i);
// clip the feature collection
  var subtable = table.filterBounds(region);
  print(i);
  print(subtable.size());
  // Explore the point size. 
  // Export the tables.
  Export.table.toAsset({
    collection:subtable,
    description:'rest_subpoints'+i,
    assetId:'users/haozhima95/forest_pheno/rest_subpoint_'+i+'_20191118'
  });
   Export.table.toDrive({
    collection:subtable,
    description:'rest_subpoints'+i,
    fileFormat:'CSV'
  });
}
