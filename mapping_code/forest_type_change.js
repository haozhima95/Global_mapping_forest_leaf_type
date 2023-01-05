// This script is used for calculating total area that will experience forest type change. 

// A forest type is defined here by 80% threshold of leaf type coverage in a pixel. This threshold is changable to 60%. As such, for all the '0.8's in the following rows, they can be replaced by '0.6's.




var fft = ee.Image("users/haozhima95/mapping_forest_functional_type/fft_probability_dbh_recent_summary_20221010"); // Careful, this fft is different from the below one. 


var bedomi = ee.Image(1).toInt8().mask(fft.select([0]).gt(0.8)); // Here this 0.8 is the threshold. If you wanna change, just change all the 0.8 to 0.6. 

// Map.addLayer(bedomi.randomVisualizer()); // You can have a look but not neccessary here. 

var bddomi = ee.Image(2).toInt8().mask(fft.select([1]).gt(0.8));

// Map.addLayer(bddomi.randomVisualizer());

var nedomi = ee.Image(3).toInt8().mask(fft.select([2]).gt(0.8));

// Map.addLayer(nedomi.randomVisualizer())


var nddomi = ee.Image(4).toInt8().mask(fft.select([3]).gt(0.8));

// Map.addLayer(nddomi.randomVisualizer())



// Define mixd forests. 
var mix = ee.Image(7).toInt8().mask(fft.select([0]).lte(0.8).and(fft.select([1]).lte(0.8)).and(fft.select([2]).lte(0.8)).and(fft.select([3]).lte(0.8)))

Map.addLayer(mix)


var mixbebd = ee.Image(5).toInt8().mask(fft.select([0]).lte(0.8).and(fft.select([1]).lte(0.8)).and(fft.select([2]).lte(0.8)).and(fft.select([3]).lte(0.8)).and(fft.select([0]).gt(fft.select([2]))).and(fft.select([0]).gt(fft.select([3]))).and(fft.select([1]).gt(fft.select([2]))).and(fft.select([1]).gt(fft.select([3]))));
Map.addLayer(mixbebd) // Broadleaved evergreen + broadleaved deciduous. 

// Broadleaved deciduous + needle-leaved evergreen.
var mixbdne = ee.Image(6).toInt8().mask(fft.select([0]).lte(0.8).and(fft.select([1]).lte(0.8)).and(fft.select([2]).lte(0.8)).and(fft.select([3]).lte(0.8)).and(fft.select([1]).gt(fft.select([0]))).and(fft.select([1]).gt(fft.select([3]))).and(fft.select([2]).gt(fft.select([0]))).and(fft.select([2]).gt(fft.select([3]))));

var xxx = ee.ImageCollection([mix,mixbebd,mixbdne]);
    xxx = xxx.reduce(ee.Reducer.min());
    xxx = xxx.mask(xxx.eq(7))
    xxx = xxx.rename('constant') // Other mixed forests.
Map.addLayer(xxx);


// Map.addLayer(mix.randomVisualizer())
var alldomifft = ee.ImageCollection([bedomi,bddomi,nedomi,nddomi,mixbebd,mixbdne,xxx]); // Aggregate all types together.
    alldomifft = alldomifft.mosaic();
Map.addLayer(alldomifft.randomVisualizer());


var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

// Export present distribution first. 

Export.image.toCloudStorage({
  image:alldomifft,
  description:'fft_type_present_60thres',
//   // assetId:'users/haozhima95/mapping_forest_functional_type/fft_probability_20210802',
  region: unboundedGeo,
	crs: 'EPSG:4326',
	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
	maxPixels: 1e13,
	bucket:'haozhi_ma'
});




var fft = ee.Image("users/haozhima95/mapping_forest_functional_type/fft_fut_clim_allmean_ssp126_20221010"); // So here the fft means future predictions. 
// 'ssp126' can be changed to 'ssp370' and 'ssp585', indicating RCP2.6, RCP7 and RCP8.5 respectively. 

// Same calculation as above. 
var bedomi = ee.Image(1).toInt8().mask(fft.select([0]).gt(0.8));

// Map.addLayer(bedomi.randomVisualizer());

var bddomi = ee.Image(2).toInt8().mask(fft.select([1]).gt(0.8));

// Map.addLayer(bddomi.randomVisualizer());

var nedomi = ee.Image(3).toInt8().mask(fft.select([2]).gt(0.8));

// Map.addLayer(nedomi.randomVisualizer())


var nddomi = ee.Image(4).toInt8().mask(fft.select([3]).gt(0.8));

// Map.addLayer(nddomi.randomVisualizer())

var mix = ee.Image(7).toInt8().mask(fft.select([0]).lte(0.8).and(fft.select([1]).lte(0.8)).and(fft.select([2]).lte(0.8)).and(fft.select([3]).lte(0.8)))

Map.addLayer(mix)
var mixbebd = ee.Image(5).toInt8().mask(fft.select([0]).lte(0.8).and(fft.select([1]).lte(0.8)).and(fft.select([2]).lte(0.8)).and(fft.select([3]).lte(0.8)).and(fft.select([0]).gt(fft.select([2]))).and(fft.select([0]).gt(fft.select([3]))).and(fft.select([1]).gt(fft.select([2]))).and(fft.select([1]).gt(fft.select([3]))));
Map.addLayer(mixbebd)

var mixbdne = ee.Image(6).toInt8().mask(fft.select([0]).lte(0.8).and(fft.select([1]).lte(0.8)).and(fft.select([2]).lte(0.8)).and(fft.select([3]).lte(0.8)).and(fft.select([1]).gt(fft.select([0]))).and(fft.select([1]).gt(fft.select([3]))).and(fft.select([2]).gt(fft.select([0]))).and(fft.select([2]).gt(fft.select([3]))));

var xxx = ee.ImageCollection([mix,mixbebd,mixbdne]);
    xxx = xxx.reduce(ee.Reducer.min());
    xxx = xxx.mask(xxx.eq(7))
    xxx = xxx.rename('constant')
    
    
// Map.addLayer(mix.randomVisualizer())
var alldomifut = ee.ImageCollection([bedomi,bddomi,nedomi,nddomi,mixbebd,mixbdne,xxx]); // Note here the name is changed from fft to fut. 
    alldomifut = alldomifut.mosaic();
Map.addLayer(alldomifut.randomVisualizer());



var diff = alldomifft.neq(alldomifut); // Find where are the differences, returns 1 if there are differences between two layers. 

var onlydiff = diff.mask(diff.eq(1))
Map.addLayer(onlydiff)
var futdiff = alldomifut.mask(onlydiff); // So here indicates where the changes are and what the types are in the future. If wanna know what the types are for now, change fut to fft and the following codes remain the same.

Map.addLayer(futdiff.randomVisualizer());

var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

Export.image.toCloudStorage({
  image:futdiff,
  description:'fft_type_change_into_ssp126_80thres', // Remember to change the names here. 
  region: unboundedGeo,
	crs: 'EPSG:4326',
	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
	maxPixels: 1e13,
	bucket:'haozhi_ma'
});

var diff = diff.multiply(ee.Image.pixelArea());

Map.addLayer(diff);

var list = [];
var lon_step = 30;
var lat_step = 10;

for (var lon=-180; lon<180; lon+=lon_step) {
  for (var lat=-45; lat<45; lat+=lat_step) {
    list.push(ee.Feature(ee.Geometry.Rectangle(lon, lat, lon + lon_step, lat + lat_step)));
  }
}

var fc = ee.FeatureCollection(list);

  var image = ee.Image("users/haozhima95/consensus_full_class_tree1"),
    image2 = ee.Image("users/haozhima95/consensus_full_class_tree2"),
    image3 = ee.Image("users/haozhima95/consensus_full_class_tree3"),
    image4 = ee.Image("users/haozhima95/consensus_full_class_tree4");

var all_tree = ee.ImageCollection([image, image2, image3, image4]);
    all_tree = all_tree.sum();
    
    diff = diff.multiply(all_tree).divide(100);
    
var diffarea = fc.map(function(f){
  var ss = diff.reduceRegions({
    collection:f,
    reducer:ee.Reducer.sum(),
    tileScale:16,
    scale:1000
  });
  return ss
});

    diffarea = diffarea.flatten()
print(diffarea.limit(1))
var all = ee.Image(1).mask(all_tree.gte(10)).multiply(ee.Image.pixelArea()).multiply(all_tree).divide(100); // Total area calculations need to control pixel area and tree cover. 

var allarea = fc.map(function(f){
  var ss = all.reduceRegions({
    collection:f,
    reducer:ee.Reducer.sum(),
    tileScale:16,
    scale:1000
  });
  return ss;
})

    allarea = allarea.flatten();
    
print(diffarea.aggregate_sum('sum').divide(allarea.aggregate_sum('sum')));

Export.table.toCloudStorage({
  collection:diffarea, 
  description:'fut_change_diffarea',
  fileFormat:'CSV',
  bucket:'haozhi_ma'
});


Export.table.toCloudStorage({
  collection:allarea,
  description:'fut_change_allarea',
  fileFormat:'CSV',
  bucket:'haozhi_ma'
});

