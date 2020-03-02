// This script is used for layer aggregations. The layers are produced by mapping approaches in different biomes.


// Initiate the lists for imagecollection.

var tropiclist = ee.Image('users/haozhima95/forest_pheno/tropical_alldata_rf_sppcor_1');

var trolist = ee.List([tropiclist]);
for(var i = 2; i<11; i++){
  var tropicaddon = ee.Image('users/haozhima95/forest_pheno/tropical_alldata_rf_sppcor_'+i);
      trolist = trolist.add(tropicaddon);
}

print(trolist);

var temp = ee.Image('users/haozhima95/forest_pheno/temperate_alldata_rf_sppcor_1');

var templist = ee.List([temp]);

for(var i = 2; i<101; i++){
  var tempaddon = ee.Image('users/haozhima95/forest_pheno/temperate_alldata_rf_sppcor_'+i);
      templist = templist.add(tempaddon);
}

print(templist);

var boreal = ee.Image('users/haozhima95/forest_pheno/boreal_alldata_rf_sppcor_1');
var boreallist = ee.List([boreal]);

for(var i = 2; i<91; i++){
  var borealaddon = ee.Image('users/haozhima95/forest_pheno/boreal_alldata_rf_sppcor_'+i);
      boreallist = boreallist.add(borealaddon);
}

print(boreallist);

var arid = ee.Image('users/haozhima95/forest_pheno/arid_alldata_rf_sppcor_1');
var aridlist = ee.List([arid]);

for(var i = 2; i<81; i++){
  var aridaddon = ee.Image('users/haozhima95/forest_pheno/arid_alldata_rf_sppcor_'+i);
      aridlist = aridlist.add(aridaddon);
}

print(aridlist);

// image collection

var tropiccollection = ee.ImageCollection(trolist);
var temperatecollection = ee.ImageCollection(templist);
var borealcollection = ee.ImageCollection(boreallist);
var aridcollection = ee.ImageCollection(aridlist);

// image construction

var tropicmean = tropiccollection.reduce(ee.Reducer.mean());
var tropicstd = tropiccollection.reduce(ee.Reducer.stdDev());

var tempmean = temperatecollection.reduce(ee.Reducer.mean());
var tempstd = temperatecollection.reduce(ee.Reducer.stdDev());

var borealmean = borealcollection.reduce(ee.Reducer.mean());
var borealstd = borealcollection.reduce(ee.Reducer.stdDev());

var aridmean = aridcollection.reduce(ee.Reducer.mean());
var aridstd = aridcollection.reduce(ee.Reducer.stdDev());

var phenomean = ee.ImageCollection([tropicmean, tempmean, borealmean, aridmean]);
var phenostd = ee.ImageCollection([tropicstd, tempstd, borealstd, aridstd]);

    phenomean = phenomean.mosaic();
    phenomean = phenomean.updateMask(1);
    
    phenostd = phenostd.mosaic();
    phenostd = phenostd.updateMask(1);

var colors = ['FDE725', '8ED542', '36B677', '218F8B', '30678D', '433982', '440154'];
var vis = {min:10, max:100, palette: colors};

Map.addLayer(phenomean, vis);

Map.addLayer(phenostd, vis);


var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);
Export.image.toAsset({
  image:phenomean,
  description:'global_alldata_pheno_mean',
  assetId:'users/haozhima95/forest_pheno/global_alldata_sppcor_mean',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});


Export.image.toDrive({
  image:phenomean,
  description:'global_alldata_sppcor_mean',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13,
});


Export.image.toAsset({
  image:phenostd,
  description:'global_alldta_rf_sppcor_std',
  assetId:'users/haozhima95/forest_pheno/global_alldata_rf_sppcor_std',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});



Export.image.toDrive({
  image:phenostd,
  description:'global_alldata_rf_sppcor_std',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});



