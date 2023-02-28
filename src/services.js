//=============================================
// Author: Andrii Yakymenko kozakyakym@gmail.com
// Create date:
// Description:
// Copyright: License.txt
//=============================================
var dateFormat = require('dateformat');
var weather = require('openweather-apis');

function servicesM(service_creds) {
  // Device config parse and MQTT connectivity.
  var mqtt = require('mqtt'), url = require('url');

  var options = {
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    host: service_creds.clientURL,
    port: service_creds.clientPort,
    protocol: "mqtt",
    keepalive: 10,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 2000,
    connectTimeout: 2000,
    username: service_creds.clientUname,
    password: service_creds.clientPass,
    rejectUnauthorized: false,
    debug: false
  };
  
  var servicem = mqtt.connect(options);  
  
  var time_date_topic = 'timedate';
  var weather_topic = 'weather';
  var weather_forecast_topic = 'forecast';

  console.log('clientId: \n', options.clientId);
  console.log('topics: \n', time_date_topic, '\n', weather_topic, '\n', weather_forecast_topic);

  // servicem is an instance returned by mqtt.Client(), see mqtt.js for full
  // documentation.
  servicem
    .on('connect', function() {
      console.log('connect');
  
      // servicem.subscribe(weather_topic);
      // servicem.subscribe('devices/#');
    });
  
  servicem
    .on('disconnect', function() {
      console.log('disconnect');
  
    });

  servicem
    .on('error', function() {
      console.log('error');
  
    });
  
  servicem
    .on('message', function(topic, payload) {
      console.log('Recieved message:', topic, payload.toString(), '\n');
    });

  // Weather config ------------------------------------
  // set country by ID
  weather.setLang('de');

  // TODO: Move this to config file with examples.
  // set city by name
  // weather.setCity('Zurich');  
  // or set the coordinates (latitude,longitude)
  weather.setCoordinate(47.3774417, 8.5367355);

  // 'metric'  'internal'  'imperial'
  weather.setUnits('metric');
  // check http://openweathermap.org/appid#get for get the APPID
  weather.setAPPID(service_creds.weatherAPIkey);

  var timer = setInterval(function() {
// Datetime-------------------------------------------------------
    var t = new Date().getTime();
    var dt = dateFormat(new Date(), "mmm dS");
    var tm = dateFormat(new Date(), "HH:MM");
    var wd = dateFormat(new Date(), "ddd");;
    
    if (Object.keys(t)) {
      var time_payload = 
      { 
        time: tm,
        date: dt,
        weekday: wd
      };
      var message = JSON.stringify(time_payload);
      // Send the message.
      servicem.publish(time_date_topic, message);
      console.log('Topic:', time_date_topic, '\nMessage: ', message);
    }
// ---------------------------------------------------------------

// Weather--------------------------------------------------------
    // get all the JSON file returned from server (rich of info)
    weather.getAllWeather(function(err, JSONObj){
      // console.log(JSONObj);
      if(err) console.log(err);
      // Send the message.
      var message = JSON.stringify(JSONObj);
      servicem.publish(weather_topic, message);
      console.log('Topic:', weather_topic, '\nMessage: ', message);
    }); 
// ---------------------------------------------------------------
  }, 5000); // ms  

}

exports.servicesM = servicesM;
