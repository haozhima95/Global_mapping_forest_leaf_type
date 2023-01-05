var rcplist = ['126','370','585'];


var modellist = ['gfdl-esm4','ipsl-cm6a-lr', 'mpi-esm1-2-hr', 'mri-esm2-0', 'ukesm1-0-ll'];

var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

var list = [];
var lon_step = 30;
var lat_step = 1;

  for (var lat=-56; lat<77; lat+=lat_step) {
    list.push(ee.Feature(ee.Geometry.Polygon([-180, lat,0,lat, 180,lat,180, lat + lat_step,0,lat+lat_step,-180,lat+lat_step],null,false),{lat:lat+0.5}));
  }

var fc = ee.FeatureCollection(list);
    fc = fc.randomColumn('random',0);


var fft = ee.Image('users/haozhima95/mapping_forest_functional_type/fft_probability_dbh_recent_summary_20221010')
print(fft)
var alldf = rcplist.map(function(rcp){
  var dff = modellist.map(function(modelname){
    var im = ee.Image('users/haozhima95/mapping_forest_functional_type/fft_future_clim_dbh_2071-2100_'+modelname+'_ssp'+rcp+'_allsummary_20221010');
    
    var diffeve = im.select([0]).add(im.select([2])).subtract(fft.select([0])).subtract(fft.select([2])).rename('evediff')
    
    var df = fc.map(function(f){
      var ss = diffeve.reduceRegions({
        reducer:ee.Reducer.mean(),
        collection:f,
        scale:1000,
        tileScale:16
      });
      return ss
    });
    df = df.flatten()
    print(df.size())
    df = df.map(function(f){
      var ss = f.set({name:modelname,rcp:rcp})
      return ss
    })

  return df
  
  })
  dff = ee.FeatureCollection(dff)
  dff = dff.flatten()
  return dff
});


    alldf = ee.FeatureCollection(alldf);
    alldf = alldf.flatten()
print(alldf.size())
Map.addLayer(alldf);
print(alldf.limit(10));
  Export.table.toCloudStorage({
    collection:alldf,
    description:'eve_difference_allmodel_allrcp_20221010',
    fileFormat:'CSV',
    bucket:'haozhi_ma'
  });
