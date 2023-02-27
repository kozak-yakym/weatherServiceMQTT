//=============================================
// Author: Andrii Yakymenko kozakyakym@gmail.com
// Create date:
// Description:
// Copyright: License.txt
//=============================================

//------------------------------------------------------------------------------
var debug_level = 0;
const DEBUG_LEVEL_JSON = 100;
const VERSION = 'v0.1';
const app_title = "weather-service" + VERSION;

var cfg = {
  config_file: '../config.json',
};

//------------------------------------------------------------------------------
// Add timestamps in front of log messages
require('console-stamp')(console, {
   pattern: "yyyy-mm-dd HH:MM:ss.l"
 });
//------------------------------------------------------------------------------
const stdio = require('stdio');
var ops = stdio.getopt({
  'config': {
    key: 'c',
    args: 1,
    description: 'Config file'
  },
  'debug_level': {
    key: 'd',
    args: 1,
    description: 'Debug level'
  },
});

if (ops.config)
  cfg.config_file = ops.config;
if (ops.debug_level)
  debug_level = ops.debug_level;

console.log('cfg.config_file: ' + cfg.config_file);

const fs = require('fs');
const path = require('path');
const async = require('async');

// Read config from file
var config_file = path.join(__dirname, cfg.config_file);
console.log('Reading config from \'' + config_file + '\'');
try {
  var data = fs.readFileSync(config_file, 'utf8');
//  console.log('config: ' + data);
  cfg = eval('(' + data + ')');
  cfg.config_file = config_file;
} catch (err) {
  console.log('Error: Can\'t read config file \'' + config_file + '\' (' + err.name + ':' + err.message + ')! Default config will be used.\n');
}


//------------------------------------------------------------------------------
  const servicesM = require('./services').servicesM;
  var credentials = new servicesM(cfg.creds[0]);
//------------------------------------------------------------------------------
