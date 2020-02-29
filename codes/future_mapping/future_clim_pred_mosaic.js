// This script is used for future climate predictions mosaic.

// all the predictions in different biomes will be aggregated as global maps.

// Initiate climte model lists
var esm = ['bc','cc','cn','mg'];

var rcp = [45,85];

// set mapping parameters

var colors = ['FDE725', '8ED542', '36B677', '218F8B', '30678D', '433982', '440154'];
var vis = {min:10, max:100, palette: colors};

var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

for(var i = 0; i<4; i++){
  for(var j = 0; j<2; j++){
    // Load the images
    var tropic = ee.Image('users/haozhima95/forest_pheno/tropical_wdpa_rf_sppcor_'+esm[i]+rcp[j]+'_mean');
    var tropicstd = ee.Image('users/haozhima95/forest_pheno/tropical_wdpa_rf_sppcor_'+esm[i]+rcp[j]+'_std');
    
    var temperate = ee.Image('users/haozhima95/forest_pheno/temperate_wdpa_rf_sppcor_'+esm[i]+rcp[j]+'_mean');
    var temperatestd = ee.Image('users/haozhima95/forest_pheno/temperate_wdpa_rf_sppcor_'+esm[i]+rcp[j]+'_std');
    
    var boreal = ee.Image('users/haozhima95/forest_pheno/boreal_wdpa_rf_sppcor_'+esm[i]+rcp[j]+'_mean');
    var borealstd = ee.Image('users/haozhima95/forest_pheno/boreal_wdpa_rf_sppcor_'+esm[i]+rcp[j]+'_std');
    
    var arid = ee.Image('users/haozhima95/forest_pheno/arid_wdpa_rf_sppcor_'+esm[i]+rcp[j]+'_mean');
    var aridstd = ee.Image('users/haozhima95/forest_pheno/arid_wdpa_rf_sppcor_'+esm[i]+rcp[j]+'_std');
    
    // Using imagecollection, construct the global map
    var futureclimcollection = ee.ImageCollection([tropic,temperate,boreal,arid]);
        futureclimcollection = futureclimcollection.mosaic();
    
    var futureclimcollectionstd = ee.ImageCollection([tropicstd,temperatestd,borealstd,aridstd]);
        futureclimcollectionstd = futureclimcollectionstd.mosaic();
    // Mapping    
    Map.addLayer(futureclimcollection,vis,'futureclim_'+esm[i]+rcp[j],false);
    Map.addLayer(futureclimcollectionstd, vis, 'futureclimstd_'+esm[i]+rcp[j],false);
    
    // Exporting
    
    Export.image.toAsset({
      image:futureclimcollection,
      description:'future_clim_'+esm[i]+rcp[j]+'_mean',
      assetId:'users/haozhima95/forest_pheno/future_clim_wdpa_rf_sppcor_'+esm[i]+rcp[j]+'_mean',
      crs:'EPSG:4326',
      region:unboundedGeo,
      crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
      maxPixels: 1e13
    });

    Export.image.toAsset({
      image:futureclimcollectionstd,
      description:'future_clim_'+esm[i]+rcp[j]+'_std',
      assetId:'users/haozhima95/forest_pheno/future_clim_wdpa_rf_sppcor_'+esm[i]+rcp[j]+'_std',
      crs:'EPSG:4326',
      region:unboundedGeo,
      crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
      maxPixels: 1e13
    });
    
    Export.image.toDrive({
      image:futureclimcollection,
      description:'future_clim_'+esm[i]+rcp[j]+'_mean',
      //assetId:'users/haozhima95/forest_pheno/future_clim_wdpa_rf_sppcor_'+esm[i]+rcp[j]+'_mean',
      crs:'EPSG:4326',
      region:unboundedGeo,
      crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
      maxPixels: 1e13
    });
    
    Export.image.toDrive({
      image:futureclimcollectionstd,
      description:'future_clim_'+esm[i]+rcp[j]+'_std',
      //assetId:'users/haozhima95/forest_pheno/future_clim_wdpa_rf_sppcor_'+esm[i]+rcp[j]+'_mean',
      crs:'EPSG:4326',
      region:unboundedGeo,
      crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
      maxPixels: 1e13
    });
    
    
  }
}
    
