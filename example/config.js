'use strict';

var extend = require('extend-shallow');
var exists = require('fs-exists-sync');
var path = require('path');

module.exports = function(options) {
  var config = {};
  var config = {};
  if (exists(path.join(__dirname, '../tmp/config.json'))) {
    config = require('../tmp/config.json');
  } else if (exists(path.join(__dirname, 'config.json'))) {
    config = require('./config.json');
  }
  config = extend({}, config, options);
  return config;
};
