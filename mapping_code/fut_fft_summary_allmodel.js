
// Run in Google Earth Engine, this script is used for comparing how the degree of evergree or broadleaved trees change in different models and different RCPs. 


// Initialize different models.

var modellist = ['gfdl-esm4','ipsl-cm6a-lr', 'mpi-esm1-2-hr', 'mri-esm2-0', 'ukesm1-0-ll'];

var rcp = '585' // Can be changed to '370'.

// Initialize a function, and load different future predictions. 

var allim = modellist.map(function(f){
  var im = ee.Image('users/haozhima95/mapping_forest_functional_type/fft_future_clim_dbh_2071-2100_'+f+'_ssp'+rcp+'_allsummary_20221010');
      im = im.select([0,1,2,3]);

  return im
});


    allim = ee.ImageCollection(allim);
    allim = allim.reduce(ee.Reducer.mean());

var fft = ee.Image('users/haozhima95/mapping_forest_functional_type/fft_probability_dbh_recent_summary_20221010').select([0,1,2,3]);

Map.addLayer(fft);
    
Map.addLayer(allim);

var diff = allim.select([0]).add(allim.select([2])).subtract(fft.select([0])).subtract(fft.select([2])).rename('evediff');
Map.addLayer(diff)

var broaddiff = allim.select([0]).add(allim.select([1])).subtract(fft.select([0])).subtract(fft.select([1])).rename('broaddiff');

var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);


// Export.

Export.image.toCloudStorage({
  image:allim,
  description:'fft_fut_clim_allmean_ssp'+rcp+'_20221010',
  region: unboundedGeo,
 	crs: 'EPSG:4326',
 	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	maxPixels: 1e13,
 	bucket:'haozhi_ma'
});



Export.image.toCloudStorage({
  image:diff,
  description:'fft_fut_clim_evediff_ssp'+rcp+'_20221010',
  region: unboundedGeo,
 	crs: 'EPSG:4326',
 	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	maxPixels: 1e13,
 	bucket:'haozhi_ma'
});


Export.image.toCloudStorage({
  image:broaddiff,
  description:'fft_fut_clim_broaddiff_ssp'+rcp+'_20221010',
  region: unboundedGeo,
 	crs: 'EPSG:4326',
 	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	maxPixels: 1e13,
 	bucket:'haozhi_ma'
});


Export.image.toAsset({
  image:allim,
  description:'fft_fut_clim_allmean_ssp'+rcp+'_20221010',
  assetId:'users/haozhima95/mapping_forest_functional_type/fft_fut_clim_allmean_ssp'+rcp+'_20221010',
  region: unboundedGeo,
 	crs: 'EPSG:4326',
 	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	maxPixels: 1e13
 	// bucket:'haozhi_ma'
});


