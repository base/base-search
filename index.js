'use strict';

var Search = require('./lib/search');
var utils = require('./lib/utils');

module.exports = function(config) {
  return function(app) {
    if (!utils.isValid(app, 'base-search')) return;

    app.define('search', new Search(config));
  };
};
