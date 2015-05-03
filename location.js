var featLayer;
 
require([
  "esri/layers/FeatureLayer",
  "esri/geometry/Point",
  "esri/SpatialReference",
  "esri/Color",
  "esri/graphic",
  "esri/graphicsUtils",
  "esri/tasks/FeatureSet",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol"
], function(FeatureLayer, Point, SpatialReference, Color, Graphic, graphicsUtils, FeatureSet, SimpleMarkerSymbol, SimpleLineSymbol,
            SimpleFillSymbol) {

  // Initialize map, GP and image params

  
  function doSuccess(){
    console.log("success");
  }
  
  function doError(){
    console.log("fail");
  }
  //function save(geom){} also have setGeometry to geom.
  var featLayer = new FeatureLayer("http://services5.arcgis.com/EIQW7TL64nzFdY4C/ArcGIS/rest/services/Split/FeatureServer/0", {
        mode: FeatureLayer.MODE_SNAPSHOT,
        outFields: ["*"]
      });
  function save(){
    var point = new Point(-118.15, 33.80, new SpatialReference({ wkid: 4326 }));
    var g = new Graphic();
    g.setGeometry(point);
    var markerSymbol = new SimpleMarkerSymbol();
    markerSymbol.setColor(new Color([255, 255, 0, 0.5]));
    
    g.setSymbol = markerSymbol;
    g.setAttributes( {"FriendID": "ijoosong", "Name": "joseph"});
    featLayer.applyEdits([g], null, null, doSuccess, doError);
    g.setAttributes({"FriendID": "cassidoo", "Name": "cassidy"});
    featLayer.applyEdits([g], null, null, doSuccess, doError);
    g.setAttributes({"FriendID": "timotius", "Name": "timotius"});
    featLayer.applyEdits([g], null, null, doSuccess, doError);
    //spatial queries and attribute queries.
    //combined
    
  }
  save();
  
  
});
