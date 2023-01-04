// This file is run for getting the final image of global forest leaf type distribution. 


// Initialize the list of index number.

function JSsequence(i) {
	return i ? JSsequence(i - 1).concat(i) : []
}
var numberOfSubsets = 100;
var seedlist = JSsequence(numberOfSubsets);

// Create a image collection with all the mapped images.

var imcollection = seedlist.map(function(f){
  var im = ee.Image('users/haozhima95/mapping_forest_functional_type/fft_probability_dbh_occurrence_recent_'+f+'_20221010');
  return im
}); 

    imcollection = ee.ImageCollection(imcollection);



var imminmax = imcollection.reduce(ee.Reducer.percentile([2.5,97.5]));

var immean = imcollection.reduce(ee.Reducer.mean());

var imstd = imcollection.reduce(ee.Reducer.stdDev()).toFloat();

// Create a multiband image containing information of mean, confidence interval and modelling uncertainties. 

var alltogether = immean.addBands(imminmax).addBands(imstd);

print(alltogether);
    

var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);


// Export.

Export.image.toCloudStorage({
  image:alltogether,
  description:'fft_probability_dbh_recent_summary_20221010',
  region: unboundedGeo,
 	crs: 'EPSG:4326',
 	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	maxPixels: 1e13,
 	bucket:'haozhi_ma'
});



Export.image.toAsset({
  image:alltogether,
  description:'fft_probability_dbh_recent_summary_20221010',
  assetId:'users/haozhima95/mapping_forest_functional_type/fft_probability_dbh_recent_summary_20221010',
  region: unboundedGeo,
 	crs: 'EPSG:4326',
 	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	maxPixels: 1e13
})



