var namelist = [
  'Annual_Mean_Temperature',
  'Mean_Dinual_Range',
  'Isothermality',
  'Temperature_Seasonality',
  'Max_Temperature_of_Warmest_Month',
  'Min_Temperature_of_Coldest_Month',
  'Temperature_Annual_Range',
  'Mean_Temperature_of_Wettest_Quarter',
  'Mean_Temperature_of_Driest_Quarter',
  'Mean_Temperature_of_Warmest_Quarter',
  'Mean_Temperature_of_Coldest_Quarter',
  'Annual_Precipitation',
  'Precipitation_of_Wettest_Month',
  'Precipitation_of_Driest_Month',
  'Precipitation_Seasonality',
  'Precipitation_of_Wettest_Quarter',
  'Precipitation_of_Driest_Quarter',
  'Precipitation_of_Warmest_Quarter',
  'Precipitation_of_Coldest_Quarter'
  ];
  
/* Here we use model cc85 as one example. */

var future_cc85 = ee.Image('users/haozhima95/future_clim/cc85bi501');
    future_cc85 = future_cc85.rename(namelist[0]);
    
for(var i = 1; i<19; i++){
  var st = i+1;
  var addon = ee.Image('users/haozhima95/future_clim/cc85bi50'+st);
      addon = addon.rename(namelist[i]);
      //print(addon);
      future_cc85 = future_cc85.addBands(addon);
}
print(future_cc85);



var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);


// Save to Assets
Export.image.toAsset({
  image:future_cc85,
  description:'future_cc85',
  assetId:'users/haozhima95/future_clim/future_cc85',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});



