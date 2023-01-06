// This script is used for mapping different tree densities.

// Load the composite

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

var treedensity = comp.select([47]);
    // treedensity = treedensity.mask(treerange);
Map.addLayer(treedensity)

// Load forest leaf type maps.
var prop = ee.Image('users/haozhima95/mapping_forest_functional_type/fft_probability_stem_recent_mean_20221010');

print(prop);
Map.addLayer(prop);

// Different types.

var be = prop.select([0]);

var bd = prop.select([1]);

var ne = prop.select([2]);

var nd = prop.select([3]);


var bedensity = be.multiply(treedensity);

var bddensity = bd.multiply(treedensity);

var nedensity = ne.multiply(treedensity);

var nddensity = nd.multiply(treedensity);

Map.addLayer(bedensity);


    bedensity = bedensity.divide(ee.Image.pixelArea()).multiply(10000);
    bedensity = bedensity.reproject(be.projection(),null,1000);
Map.addLayer(bedensity);
    
    bddensity = bddensity.divide(ee.Image.pixelArea()).multiply(10000);
    bddensity = bddensity.reproject(bd.projection(),null,1000);

    nedensity = nedensity.divide(ee.Image.pixelArea()).multiply(10000);
    nedensity = nedensity.reproject(ne.projection(),null,1000);
    
    nddensity = nddensity.divide(ee.Image.pixelArea()).multiply(10000);
    nddensity = nddensity.reproject(nd.projection(),null,1000);

var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);


// Export.

Export.image.toCloudStorage({
  image:bedensity,
  description:'bedensity_per_ha_occurrence_20221010',
  // assetId:'users/haozhima95/mapping_forest_functional_type/fft_probability_20210802',
  region: unboundedGeo,
 	crs: 'EPSG:4326',
 	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	maxPixels: 1e13,
 	bucket:'haozhi_ma'
});

Export.image.toAsset({
  image:bedensity,
  description:'bedensity_per_ha_asset',
  assetId:'users/haozhima95/mapping_forest_functional_type/bedensity_per_ha_occurrence_20221010',
  region: unboundedGeo,
 	crs: 'EPSG:4326',
 	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	maxPixels: 1e13
});


Export.image.toCloudStorage({
  image:bddensity,
  description:'bddensity_per_ha_occurrence_20221010',
  // assetId:'users/haozhima95/mapping_forest_functional_type/fft_probability_20210802',
  region: unboundedGeo,
 	crs: 'EPSG:4326',
 	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	maxPixels: 1e13,
 	bucket:'haozhi_ma'
});


Export.image.toAsset({
  image:bddensity,
  description:'bddensity_per_ha_asset',
  assetId:'users/haozhima95/mapping_forest_functional_type/bddensity_per_ha_occurrence_20221010',
  region: unboundedGeo,
 	crs: 'EPSG:4326',
 	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	maxPixels: 1e13
});


Export.image.toCloudStorage({
  image:nedensity,
  description:'nedensity_per_ha_occurrence_20221010',
  // assetId:'users/haozhima95/mapping_forest_functional_type/fft_probability_20210802',
  region: unboundedGeo,
 	crs: 'EPSG:4326',
 	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	maxPixels: 1e13,
 	bucket:'haozhi_ma'
});


Export.image.toAsset({
  image:nedensity,
  description:'nedensity_per_ha_asset',
  assetId:'users/haozhima95/mapping_forest_functional_type/nedensity_per_ha_occurrence_20221010',
  region: unboundedGeo,
 	crs: 'EPSG:4326',
 	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	maxPixels: 1e13
});

Export.image.toCloudStorage({
  image:nddensity,
  description:'nddensity_per_ha_occurrence_20221010',
  // assetId:'users/haozhima95/mapping_forest_functional_type/fft_probability_20210802',
  region: unboundedGeo,
 	crs: 'EPSG:4326',
 	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	maxPixels: 1e13,
 	bucket:'haozhi_ma'
});


Export.image.toAsset({
  image:nddensity,
  description:'nddensity_per_ha_asset',
  assetId:'users/haozhima95/mapping_forest_functional_type/nddensity_per_ha_occurrence_20221010',
  region: unboundedGeo,
 	crs: 'EPSG:4326',
 	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
 	maxPixels: 1e13
});


