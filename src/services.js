//=============================================
// Author: Andrii Yakymenko kozakyakym@gmail.com
// Create date:
// Description:
// Copyright: License.txt
//=============================================
var dateFormat = require('dateformat');
var weather = require('openweather-apis');
// TODO: Move this to config file with examples.
var ownKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxx"

function servicesM(service_creds) {
  var template;

  // Device config parse and MQTT connectivity
  var mqtt = require('mqtt'), url = require('url');

  // clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8)
  // protocol: "mqtts",
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

  //
  // servicem is an instance returned by mqtt.Client(), see mqtt.js for full
  // documentation.
  //
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
  // weather.setLang('ua');
  
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
  weather.setAPPID(ownKey);

/*    
  // Payload composing 
  var me = this;
  var model = {};

  // var id = getDeviceId(connectionString);
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  } //!FIXME

  for (var key in template) {
    model[key] = {
      model: me,
      key: key,
      type: template[key].type,
      fs: template[key].fs,
      update: template[key].update
    };
    if (template[key].value)
      model[key].value = clone(template[key].value);
    if (template[key].data)
      model[key].data = clone(template[key].data);

    if (model[key].type === 'stream') {
      model[key].index = 0;
      model[key].frame_size = template[key].frame_size;
    }
  }

  // this.getDeviceId = getDeviceId; 

  this.getData = function(t) {
    var d = {};

    for (var key in model) {
      if (!model[key].t)
        model[key].t = t;
      switch (model[key].type) {
        case 'value':
        case 'vector':
        case 'text':
          if ((t - model[key].t) * 0.001 < 1.0 / model[key].fs)
            break;
          model[key].t += 1000.0 / model[key].fs;
          if (typeof(model[key].update) === 'function')
            model[key].value = model[key].update(model[key], t);
          d[key] = model[key].value;
          break;

        case 'stream':
          if ((t - model[key].t) * 0.001 < 1.0 / model[key].fs * model[key].frame_size)
            break;
          var buf = [];
          if (typeof(model[key].update) === 'function') {
            buf = model[key].update(model[key], model[key].t, model[key].index);
          }  
          d[key] = { t: model[key].t, index: model[key].index, buf: buf };
          model[key].index += buf.length;
          model[key].t += 1000.0 / model[key].fs * buf.length;
          break;
        }
    }
    return d;
  };
*/
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
    // // get the Temperature  
    // weather.getTemperature(function(err, temp){
    //   console.log(temp);
    // });
  
    // // get the Atm Pressure
    // weather.getPressure(function(err, pres){
    //     console.log(pres);
    // });
  
    // // get the Humidity
    // weather.getHumidity(function(err, hum){
    //     console.log(hum);
    // });
  
    // // get the Description of the weather condition
    // weather.getDescription(function(err, desc){
    //     console.log(desc);
    // });
  
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

// exports.getDeviceId = getDeviceId;
exports.servicesM = servicesM;
