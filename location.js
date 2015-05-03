require([
  "esri/Color",
  "esri/geometry/Point",
  "esri/geometry/webMercatorUtils",
  "esri/graphic",
  "esri/layers/FeatureLayer",
  "esri/map",
  "esri/renderers/SimpleRenderer",
  "esri/renderers/TemporalRenderer",
  "esri/renderers/TimeClassBreaksAger",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/TimeExtent",
  "dojo/domReady!"
], function (Color, Point, webMercatorUtils, Graphic, FeatureLayer, Map, SimpleRenderer, TemporalRenderer,
  TimeClassBreaksAger, SimpleLineSymbol, SimpleMarkerSymbol, TimeExtent){

  var map, featureLayer;
  var OBJECTID_COUNTER = 1000;
  var TRACKID_COUNTER = 1;
  //onorientationchange doesn't always fire in a timely manner in Android so check for both orientationchange and resize
  var supportsOrientationChange = "onorientationchange" in window, orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

  window.addEventListener(orientationEvent, function (){
    orientationChanged();
  }, false);

  map = new Map("map", {
    basemap: "streets"
  });
  map.on("load", mapLoadedHandler);

  function mapLoadedHandler(maploadEvent){
    console.log("map loaded", maploadEvent);

    //create a layer definition for the gps points
    var layerDefinition = {
      "objectIdField": "OBJECTID",
      "trackIdField": "TrackID",
      "geometryType": "esriGeometryPoint",
      "timeInfo": {
        "startTimeField": "DATETIME",
        "endTimeField": null,
        "timeExtent": [1277412330365],
        "timeInterval": 1,
        "timeIntervalUnits": "esriTimeUnitsMinutes"
      },
      "fields": [
        {
          "name": "OBJECTID",
          "type": "esriFieldTypeOID",
          "alias": "OBJECTID",
          "sqlType": "sqlTypeOther"
        },
        {
          "name": "TrackID",
          "type": "esriFieldTypeInteger",
          "alias": "TrackID"
        },
        {
          "name": "DATETIME",
          "type": "esriFieldTypeDate",
          "alias": "DATETIME"
        }
      ]
    };

    var featureCollection = {
      layerDefinition: layerDefinition,
      featureSet: null
    };
    featureLayer = new FeatureLayer(featureCollection);

    //setup a temporal renderer
    var sms = new SimpleMarkerSymbol().setColor(new Color([255, 0, 0])).setSize(8);
    var observationRenderer = new SimpleRenderer(sms);
    var latestObservationRenderer = new SimpleRenderer(new SimpleMarkerSymbol());
    var infos = [
      {
        minAge: 0,
        maxAge: 1,
        color: new Color([255, 0, 0])
      }, {
        minAge: 1,
        maxAge: 5,
        color: new Color([255, 153, 0])
      }, {
        minAge: 5,
        maxAge: 10,
        color: new Color([255, 204, 0])
      }, {
        minAge: 10,
        maxAge: Infinity,
        color: new Color([0, 0, 0, 0])
      }
    ];
    var ager = new TimeClassBreaksAger(infos, TimeClassBreaksAger.UNIT_MINUTES);
    var sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
      new Color([255, 0, 0]), 3);
    var trackRenderer = new SimpleRenderer(sls);
    var renderer = new TemporalRenderer(observationRenderer, latestObservationRenderer,
      trackRenderer, ager);
    featureLayer.setRenderer(renderer);
    map.addLayer(featureLayer);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
      navigator.geolocation.watchPosition(showLocation, locationError);
    }
  }

  function locationError(error){
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("Location not provided");
        break;

      case error.POSITION_UNAVAILABLE:
        alert("Current location not available");
        break;

      case error.TIMEOUT:
        alert("Timeout");
        break;

      default:
        alert("unknown error");
        break;
    }
  }

  function zoomToLocation(location){
    var pt = webMercatorUtils.geographicToWebMercator(new Point(location.coords.longitude,
      location.coords.latitude));
    map.centerAndZoom(pt, 16);
  }

  function showLocation(location){
    if (location.coords.accuracy <= 500) {
      var now = new Date();
      var attributes = {};
      attributes.OBJECTID = OBJECTID_COUNTER;
      attributes.DATETIME = now.getTime();
      attributes.TrackID = TRACKID_COUNTER;

      OBJECTID_COUNTER++;
      TRACKID_COUNTER++;

      var pt = webMercatorUtils.geographicToWebMercator(new Point(location.coords.longitude,
        location.coords.latitude));
      var graphic = new Graphic(new Point(pt, map.spatialReference), null, attributes);

      featureLayer.applyEdits([graphic], null, null, function (adds){
        map.setTimeExtent(new TimeExtent(null, new Date()));
        map.centerAt(graphic.geometry);
      });
    }
    else {
      console.warn("Point not added due to low accuracy: " + location.coords.accuracy);
    }
  }

  function orientationChanged(){
    if (map) {
      map.reposition();
      map.resize();
    }
  }

});