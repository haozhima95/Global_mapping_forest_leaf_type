// This script is used to detect the most decrease through out the three forest types.

var list = [];
var lon_step = 30;
var lat_step = 1;


  for (var lat=-56; lat<77; lat+=lat_step) {
    list.push(ee.Feature(ee.Geometry.Polygon([-180, lat,0,lat, 180,lat,180, lat + lat_step,0,lat+lat_step,-180,lat+lat_step],null,false),{lat:lat+0.5}));
  }


var fc = ee.FeatureCollection(list);
    fc = fc.randomColumn('random',0);

// Load the layers

// Current

  var image = ee.Image("users/haozhima95/consensus_full_class_tree1"),
    image2 = ee.Image("users/haozhima95/consensus_full_class_tree2"),
    image3 = ee.Image("users/haozhima95/consensus_full_class_tree3"),
    image4 = ee.Image("users/haozhima95/consensus_full_class_tree4");

var all_tree = ee.ImageCollection([image, image2, image3, image4]);
    all_tree = all_tree.sum();
var treemask = all_tree.gt(10);
var treerange = all_tree.mask(treemask.gt(0));



var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

var list = [];
var lon_step = 30;
var lat_step = 10;

for (var lon=-180; lon<180; lon+=lon_step) {
  for (var lat=-55; lat<88; lat+=lat_step) {
    list.push(ee.Feature(ee.Geometry.Rectangle(lon, lat, lon + lon_step, lat + lat_step)));
  }
}

var fcc = ee.FeatureCollection(list);





var fft = ee.Image('users/haozhima95/mapping_forest_functional_type/fft_probability_dbh_recent_summary_20221010');
var im = fft.addBands(ee.Image.pixelArea());
    im = im.select(['area'])
    im = im.mask(treerange);
    Map.addLayer(im);
    

var ffttotalcount = fcc.map(function(f){
  var ss = fft.select([0]).reduceRegions({
    collection:f,
    reducer:ee.Reducer.count(),
    scale:1000,
    tileScale:16
  });
  return ss
});

    ffttotalcount = ffttotalcount.flatten();
    print(ffttotalcount.limit(2));
    print(ffttotalcount.aggregate_sum('count'));
// var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

var timelist = [ '2071-2100'];

var modellist = ['ssp126','ssp370', 'ssp585'];

// future

timelist.map(function(year){
  modellist.map(function(model){
    var fft_fut = ee.Image('users/haozhima95/mapping_forest_functional_type/fft_fut_clim_allmean_'+model+'_20221010');


    var diff = fft_fut.select([0]).subtract(fft.select([0])).addBands(fft_fut.select([1]).subtract(fft.select([1]))).addBands(fft_fut.select([2]).subtract(fft.select([2]))).addBands(fft_fut.select([2]).subtract(fft.select([3])));



    var diffcollection = ee.ImageCollection([diff.select([0]).rename('diff'), diff.select([1]).rename('diff'), diff.select([2]).rename('diff'), diff.select([3]).rename('diff')]);

    var leastdiff = diffcollection.reduce(ee.Reducer.min());
    
    var diffdf = fc.map(function(f){
      var ss = leastdiff.reduceRegions({
        collection:f,
        reducer:ee.Reducer.mean(),
        scale:1000,
        tileScale:16
      });
      return ss
    });
        diffdf = diffdf.flatten()
    print(diffdf.limit(10));
    
    
    var sigim = leastdiff.mask(leastdiff.lte(-0.1));
    // var diffim = im.mask(sigim.abs())
    // Map.addLayer(sigim);
        // sigim = sigim.multiply(ee.Image.pixelArea());
    var sigtotal = fcc.map(function(f){
      var ss = sigim.reduceRegions({
        collection:f,
        reducer:ee.Reducer.count(),
        scale:1000,
        tileScale:16
      });
      return ss;
    });
    
        sigtotal = sigtotal.flatten();
        
    print(sigtotal.aggregate_sum('count').divide(ffttotalcount.aggregate_sum('count')));
    Map.addLayer(leastdiff,{
   min: -0.3,
   max: 0,
   palette: [ "67000D", "A50F15", "CB181D", "EF3B2C", "FB6A4A", "FC9272", "FCBBA1", "FEE0D2", "FFF5F0"]});
    Export.image.toCloudStorage({
      image:leastdiff,
      description:'fft_fut_decrease_most_'+year+'_'+model+'_20221010',
      region: unboundedGeo,
      crs:'EPSG:4326',
      crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	    maxPixels: 1e13,
	    bucket:'haozhi_ma'
    });
    
    Export.table.toCloudStorage({
      collection:diffdf,
      description:'decrease_most_'+model+'_20221010',
      fileFormat:'CSV',
      bucket:'haozhi_ma'
    });
  })
})






