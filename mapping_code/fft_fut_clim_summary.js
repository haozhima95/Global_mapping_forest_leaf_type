// This script is used for summarizing future clim predictions


// Get the list of loops

var reference = ee.Image(0.5).float();

Map.addLayer(reference, {}, 'ref');



var timeperiod = [ '2071-2100'];

var rcp = ['ssp370']; // Also change to 'ssp580'


var modelname = ['ipsl-cm6a-lr']// 'gfdl-esm4','ipsl-cm6a-lr', 'mpi-esm1-2-hr', 'mri-esm2-0', 'ukesm1-0-ll' use one of them.

function JSsequence(i) {
	return i ? JSsequence(i - 1).concat(i) : []
}
var numberOfSubsets = 100;
var seedlist = JSsequence(numberOfSubsets);




var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

// Initialize the loop. Per time period and rcp scenarios, there should be only one map, resulting in four maps

// timeperiod.map(function(tp){
//   rcp.map(function(ssp){
    var allmodels = seedlist.map(function(i){
      var im = ee.Image('users/haozhima95/mapping_forest_functional_type/fft_probability_mapping_20221010_dbh_2071-2100_'+modelname[0]+'_'+rcp[0]+'_standardized_occurrence_'+i);
      return im
    });
    
    print(allmodels);
    
    var allcollection = ee.ImageCollection(allmodels);
    Map.addLayer(allcollection);
    // var typecollection = allcollection.select([0])
    var allim = allcollection.reduce(ee.Reducer.mean());
//     Map.addLayer(allim, {}, 'prediction_'+tp+'_'+ssp);
    var allstd = allcollection.reduce(ee.Reducer.stdDev()).toFloat();
    
//     Map.addLayer(allstd, {}, 'prediction_std_'+tp+'_'+ssp);
    
    var allmin = allcollection.reduce(ee.Reducer.percentile([2.5]));
    
    var allmax = allcollection.reduce(ee.Reducer.percentile([97.5]));
 
var allfut = allim.addBands([allstd,allmin,allmax]);

print(allfut);

// Export.
    Export.image.toAsset({
      image:allfut,
      description:'fft_future_clim_dbh_'+timeperiod[0]+'_'+modelname[0]+'_'+rcp[0]+'_allsummary_20221010',
      assetId:'users/haozhima95/mapping_forest_functional_type/fft_future_clim_dbh_'+timeperiod[0]+'_'+modelname[0]+'_'+rcp[0]+'_allsummary_20221010',
      region: unboundedGeo,
 	    crs: 'EPSG:4326',
 	    crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	    maxPixels: 1e13
    });    

   



