/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// This script contains workflows sampling data points with environmental covariates and exporting to Google Drive.
// All the code is run in Google Earth Engine.

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/




comp = comp.addBands(soil_moisture);
    comp = comp.addBands(water_depth);
    
for(var i = 1; i<15;i++){
  var subpoints = ee.FeatureCollection('users/haozhima95/forest_pheno/rest_subpoint_'+i+'_20191118');
  
  var sampledpoints = comp.sampleRegions({
    collection:subpoints,
    geometries:true,
    tileScale:16
  });
  Export.table.toDrive({
    collection:sampledpoints,
    description:'rest_sampledpoints_'+i,
    fileFormat:'CSV'
  });
}
