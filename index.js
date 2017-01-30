'use strict';

var Search = require('./lib/search');
var utils = require('./lib/utils');

/**
 * Plugin for [base][] applications like [generate][], [assemble][], [verb][], and [update][]
 * to add methods for creating search indexices using [indexers](#indexers).
 *
 * ```js
 * var app = assemble();
 * app.use(search());
 * ```
 * @name search
 * @param  {Object} `config` Configuration object used to specify default indexer to use.
 * @return {Function} Plugin function passed to `app.use` methods.
 * @api public
 */

module.exports = function(config) {
  return function plugin(app) {
    if (!utils.isValid(app, 'base-search')) return;
    app.define('search', new Search(config));
  };
};
