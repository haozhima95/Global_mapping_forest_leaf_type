// This script is run for calculating total amount of trees in different leaf types and biomes. 

var image1 = ee.Image("users/haozhima95/consensus_full_class_tree1"),
    image2 = ee.Image("users/haozhima95/consensus_full_class_tree2"),
    image3 = ee.Image("users/haozhima95/consensus_full_class_tree3"),
    image4 = ee.Image("users/haozhima95/consensus_full_class_tree4");

var all_tree = ee.ImageCollection([image1, image2, image3, image4]);
    all_tree = all_tree.sum();
var treemask = all_tree.gt(10);
var treerange = all_tree.mask(treemask.gt(0));




var comp = ee.Image('users/leonidmoore/ForestBiomass/20200915_Forest_Biomass_Predictors_Image');

 print(comp);
// Get tree density layer.
var treedensity = comp.select([47]);
    treedensity = treedensity.mask(treerange);
// Get biome layer.
var biome = comp.select([60]);
    biome = biome.mask(treerange);

Map.addLayer(biome)

var prop = ee.Image('users/haozhima95/mapping_forest_functional_type/fft_probability_stem_recent_mean_20221010');

print(prop);



var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

var list = [];
var lon_step = 30;
var lat_step = 22;

for (var lon=-180; lon<180; lon+=lon_step) {
  for (var lat=-88; lat<88; lat+=lat_step) {
    list.push(ee.Feature(ee.Geometry.Rectangle(lon, lat, lon + lon_step, lat + lat_step)));
  }
}

var fc = ee.FeatureCollection(list);



var typelist = [0,1,2,3];

var typenames = ['be','bd','ne','nd'];


// Make a list of seeds to use for the bootstrapping
function JSsequence(i) {
	return i ? JSsequence(i - 1).concat(i) : []
}
var numberOfSubsets = 14;
var biomeindex = JSsequence(numberOfSubsets);

typelist.map(function(num){
  var fft = prop.select([num]);
  var density = fft.multiply(treedensity);
  
  biomeindex.map(function(f){
    var subb = biome.mask(biome.eq(f));
    var subdensity = density.mask(subb);
        
    var alltotal = fc.map(function(i){
      var ss = subdensity.reduceRegions({
        collection:i,
        reducer:ee.Reducer.sum(),
        tileScale:16
      });
      return ss
    });
    alltotal = alltotal.flatten();
    Export.table.toCloudStorage({
      collection:alltotal,
      description:'treecounting_biome_'+f+'_in_'+typenames[num]+'_20220824',
      fileFormat:'CSV',
      bucket:'haozhi_ma'
    });
  });
  
});




