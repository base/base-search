'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('is-valid-app', 'isValid');
require('sarge', 'Sarge');

require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
