// This script is used for converting esa cci lc maps into leaf type proportion layers. Run in Google Earth Engine. 

var esa = ee.Image('users/haozhima95/esaccilc_2000');

Map.addLayer(esa)

print(esa.projection())

var be1 = ee.Image(1.0).mask(esa.eq(50)).rename('be_esa').toFloat();
var bd1 = ee.Image(0.0).mask(esa.eq(50)).rename('bd_esa').toFloat();
var ne1 = ee.Image(0.0).mask(esa.eq(50)).rename('ne_esa').toFloat();
var nd1 = ee.Image(0.0).mask(esa.eq(50)).rename('nd_esa').toFloat();

var all1 = ee.Image.cat([be1,bd1,ne1,nd1]);
    all1 = all1.reproject(esa.projection());
    all1 = all1.updateMask(1);




// Map.addLayer(be1.randomVisualizer());

 Map.addLayer(all1)

var be2 = ee.Image(0.0).mask(esa.eq(60)).rename('be_esa').toFloat();
var bd2 = ee.Image(1.0).mask(esa.eq(60)).rename('bd_esa').toFloat();
var ne2 = ee.Image(0.0).mask(esa.eq(60)).rename('ne_esa').toFloat();
var nd2 = ee.Image(0.0).mask(esa.eq(60)).rename('nd_esa').toFloat();

var all2 = ee.Image.cat([be2,bd2,ne2,nd2]);
    all2 = all2.reproject(esa.projection());
    all2 = all2.updateMask(1);



// Map.addLayer(bd2.randomVisualizer());

Map.addLayer(all2)



var be3 = ee.Image(0.0).mask(esa.eq(61)).rename('be_esa').toFloat();
var bd3 = ee.Image(1.0).mask(esa.eq(61)).rename('bd_esa').toFloat();
var ne3 = ee.Image(0.0).mask(esa.eq(61)).rename('ne_esa').toFloat();
var nd3 = ee.Image(0.0).mask(esa.eq(61)).rename('nd_esa').toFloat();

var all3 = ee.Image.cat([be3,bd3,ne3,nd3]);
    all3 = all3.reproject(esa.projection());
    all3 = all3.updateMask(1);



// Map.addLayer(bd3.randomVisualizer());

Map.addLayer(all3)



var be4 = ee.Image(0.0).mask(esa.eq(62)).rename('be_esa').toFloat();
var bd4 = ee.Image(1.0).mask(esa.eq(62)).rename('bd_esa').toFloat();
var ne4 = ee.Image(0.0).mask(esa.eq(62)).rename('ne_esa').toFloat();
var nd4 = ee.Image(0.0).mask(esa.eq(62)).rename('nd_esa').toFloat();

var all4 = ee.Image.cat([be4,bd4,ne4,nd4]);
    all4 = all4.reproject(esa.projection());
    all4 = all4.updateMask(1);



// Map.addLayer(bd4.randomVisualizer());

// Map.addLayer(all4)


var be5 = ee.Image(0.0).mask(esa.eq(70).or(esa.eq(71).or(esa.eq(72)))).rename('be_esa').toFloat();
var bd5 = ee.Image(0.0).mask(esa.eq(70).or(esa.eq(71).or(esa.eq(72)))).rename('bd_esa').toFloat();
var ne5 = ee.Image(1.0).mask(esa.eq(70).or(esa.eq(71).or(esa.eq(72)))).rename('ne_esa').toFloat();
var nd5 = ee.Image(0.0).mask(esa.eq(70).or(esa.eq(71).or(esa.eq(72)))).rename('nd_esa').toFloat();

var all5 = ee.Image.cat([be5,bd5,ne5,nd5]);
    all5 = all5.reproject(esa.projection());
    all5 = all5.updateMask(1);




// Map.addLayer(bd5.randomVisualizer());

var be6 = ee.Image(0.0).mask(esa.eq(80).or(esa.eq(81).or(esa.eq(82)))).rename('be_esa').toFloat();
var bd6 = ee.Image(0.0).mask(esa.eq(80).or(esa.eq(81).or(esa.eq(82)))).rename('bd_esa').toFloat();
var ne6 = ee.Image(0.0).mask(esa.eq(80).or(esa.eq(81).or(esa.eq(82)))).rename('ne_esa').toFloat();
var nd6 = ee.Image(1.0).mask(esa.eq(80).or(esa.eq(81).or(esa.eq(82)))).rename('nd_esa').toFloat();

var all6 = ee.Image.cat([be6,bd6,ne6,nd6]);
    all6 = all6.reproject(esa.projection());
    all6 = all6.updateMask(1);



// Map.addLayer(bd6.randomVisualizer());



var be7 = ee.Image(0.0).mask(esa.eq(90)).rename('be_esa').toFloat();
var bd7 = ee.Image(0.5).mask(esa.eq(90)).rename('bd_esa').toFloat();
var ne7 = ee.Image(0.333).mask(esa.eq(90)).rename('ne_esa').toFloat();
var nd7 = ee.Image(0.167).mask(esa.eq(90)).rename('nd_esa').toFloat();

var all7 = ee.Image.cat([be7,bd7,ne7,nd7]);
    all7 = all7.reproject(esa.projection());
    all7 = all7.updateMask(1);



// Map.addLayer(bd7.randomVisualizer());

var be8 = ee.Image(0.25).mask(esa.eq(100)).rename('be_esa').toFloat();
var bd8 = ee.Image(0.5).mask(esa.eq(100)).rename('bd_esa').toFloat();
var ne8 = ee.Image(0.125).mask(esa.eq(100)).rename('ne_esa').toFloat();
var nd8 = ee.Image(0.125).mask(esa.eq(100)).rename('nd_esa').toFloat();

var all8 = ee.Image.cat([be8,bd8,ne8,nd8]);
    all8 = all8.reproject(esa.projection());
    all8 = all8.updateMask(1);



// Map.addLayer(bd8.randomVisualizer());




var be9 = ee.Image(0.25).mask(esa.eq(110)).rename('be_esa').toFloat();
var bd9 = ee.Image(0.5).mask(esa.eq(110)).rename('bd_esa').toFloat();
var ne9 = ee.Image(0.25).mask(esa.eq(110)).rename('ne_esa').toFloat();
var nd9 = ee.Image(0.0).mask(esa.eq(110)).rename('nd_esa').toFloat();

var all9 = ee.Image.cat([be9,bd9,ne9,nd9]);
    all9 = all9.reproject(esa.projection());
    all9 = all9.updateMask(1);



// Map.addLayer(all9.randomVisualizer());


var be10 = ee.Image(0.5).mask(esa.eq(160)).rename('be_esa').toFloat();
var bd10 = ee.Image(0.5).mask(esa.eq(160)).rename('bd_esa').toFloat();
var ne10 = ee.Image(0.0).mask(esa.eq(160)).rename('ne_esa').toFloat();
var nd10 = ee.Image(0.0).mask(esa.eq(160)).rename('nd_esa').toFloat();

var all10 = ee.Image.cat([be10,bd10,ne10,nd10]);
    all10 = all10.reproject(esa.projection());
    all10 = all10.updateMask(1);



// Map.addLayer(all10);



var be11 = ee.Image(1.0).mask(esa.eq(170)).rename('be_esa').toFloat();
var bd11 = ee.Image(0.0).mask(esa.eq(170)).rename('bd_esa').toFloat();
var ne11 = ee.Image(0.0).mask(esa.eq(170)).rename('ne_esa').toFloat();
var nd11 = ee.Image(0.0).mask(esa.eq(170)).rename('nd_esa').toFloat();

var all11 = ee.Image.cat([be11,bd11,ne11,nd11]);
    all11 = all11.reproject(esa.projection());
    all11 = all11.updateMask(1);



// Map.addLayer(all11);



var be12 = ee.Image(0.0).mask(esa.eq(180)).rename('be_esa').toFloat();
var bd12 = ee.Image(0.333).mask(esa.eq(180)).rename('bd_esa').toFloat();
var ne12 = ee.Image(0.667).mask(esa.eq(180)).rename('ne_esa').toFloat();
var nd12 = ee.Image(0.0).mask(esa.eq(180)).rename('nd_esa').toFloat();

var all12 = ee.Image.cat([be12,bd12,ne12,nd12]);
    all12 = all12.reproject(esa.projection());
    all12 = all12.updateMask(1);



// Map.addLayer(all12);



var allim = ee.ImageCollection([all1,all2,all3,all4,all5,all6,all7,all8,all9,all10,all11,all12]);
    allim = allim.mosaic();
    allim = allim.updateMask(1)
    // allim = allim.reproject(esa.projection());
Map.addLayer(allim);

var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);



Export.image.toAsset({
  image:allim,
  description:'esacci_lc_2000_300m',
  assetId:'users/haozhima95/esacci_lc_2000_300m',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.002777777777777778,0,-180,0,-0.002777777777777778,88],
  maxPixels:1e13
});



