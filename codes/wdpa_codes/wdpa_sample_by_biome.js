/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// This script contains functions sample wdpa dataset with environmental covariates.

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

    comp = comp.addBands(soil_moisture);
    comp = comp.addBands(water_depth);
// Initiate a loop for sampling and outputing.
for(var i = 1; i<15;i++){
// Import datasets
  var subpoints = ee.FeatureCollection('users/haozhima95/forest_pheno/wdpa_subpoint_'+i+'_20191118');
  // sample the datasets
  var sampledpoints = comp.sampleRegions({
    collection:subpoints,
    geometries:true,
    tileScale:16
  });
  // Export...
  Export.table.toDrive({
    collection:sampledpoints,
    description:'wdpa_sampledpoints_'+i,
    fileFormat:'CSV'
  });
}
