
// This script is used for calculating total percentage of global forests in different leaf types. 


// Set the spatial range of forest. 
var image1 = ee.Image("users/haozhima95/consensus_full_class_tree1"),
    image2 = ee.Image("users/haozhima95/consensus_full_class_tree2"),
    image3 = ee.Image("users/haozhima95/consensus_full_class_tree3"),
    image4 = ee.Image("users/haozhima95/consensus_full_class_tree4");

var all_tree = ee.ImageCollection([image1, image2, image3, image4]);
    all_tree = all_tree.sum();
var treemask = all_tree.gt(10);
var treerange = all_tree.mask(treemask.gt(0));



// Load the composite and get the tree density product. (from Crowther et al.)
var comp = ee.Image('users/leonidmoore/ForestBiomass/20200915_Forest_Biomass_Predictors_Image');

 print(comp);

var treedensity = comp.select([47]);
    treedensity = treedensity.mask(treerange); // Here tree density is number of stems per pixel. 

var prop = ee.Image('users/haozhima95/mapping_forest_functional_type/fft_probability_stem_recent_mean_20221010');

print(prop);


var be = prop.select([0]);

var bd = prop.select([1]);

var ne = prop.select([2]);

var nd = prop.select([3]);

var all = be.add(bd).add(ne).add(nd);

var bedensity = be.multiply(treedensity);
    bedensity = bedensity.reproject(be.projection(),null,1000);
var bddensity = bd.multiply(treedensity);
    bddensity = bddensity.reproject(bd.projection(),null,1000);

var nedensity = ne.multiply(treedensity);
    nedensity = nedensity.reproject(ne.projection(),null,1000);

var nddensity = nd.multiply(treedensity);
    nddensity = nddensity.reproject(nd.projection(),null,1000);

var alldensity = all.multiply(treedensity);

    alldensity = alldensity.reproject(all.projection(),null,1000);


Map.addLayer(prop)

Map.addLayer(treedensity)


var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

// Create a global fishnet and calculate the total amount of trees within the fishnet.

var list = [];
var lon_step = 30;
var lat_step = 22;

for (var lon=-180; lon<180; lon+=lon_step) {
  for (var lat=-88; lat<88; lat+=lat_step) {
    list.push(ee.Feature(ee.Geometry.Rectangle(lon, lat, lon + lon_step, lat + lat_step)));
  }
}

var fc = ee.FeatureCollection(list);


var alltotal = fc.map(function(f){
  var ss = alldensity.reduceRegions({
    collection:f,
    reducer:ee.Reducer.sum(),
    tileScale:16
  });
  return ss;
});

    alltotal = alltotal.flatten();
    




var betotal = fc.map(function(f){
  var ss = bedensity.reduceRegions({
    collection:f,
    reducer:ee.Reducer.sum(),
    tileScale:16
  });
  return ss;
});

    betotal = betotal.flatten();
    
print(betotal.aggregate_sum('sum').divide(alltotal.aggregate_sum('sum')));


    
var bdtotal = fc.map(function(f){
  var ss = bddensity.reduceRegions({
    collection:f,
    reducer:ee.Reducer.sum(),
    tileScale:16
  });
  return ss;
});

    bdtotal = bdtotal.flatten();
    
print(bdtotal.aggregate_sum('sum').divide(alltotal.aggregate_sum('sum')));



var netotal = fc.map(function(f){
  var ss = nedensity.reduceRegions({
    collection:f,
    reducer:ee.Reducer.sum(),
    tileScale:16
  });
  return ss;
});

    netotal = netotal.flatten();
    
print(netotal.aggregate_sum('sum').divide(alltotal.aggregate_sum('sum')));



var ndtotal = fc.map(function(f){
  var ss = nddensity.reduceRegions({
    collection:f,
    reducer:ee.Reducer.sum(),
    tileScale:16
  });
  return ss;
});

    ndtotal = ndtotal.flatten();
    
print(ndtotal.aggregate_sum('sum').divide(alltotal.aggregate_sum('sum')));
