'use strict';

var utils = require('./lib/utils');

/**
 * Plugin for [base][] applications like [generate][], [assemble][], [verb][], and [update][]
 * to add an instance of [sarge][] as `app.search` that has methods for creating search indices using [indexers](#indexers).
 *
 * ```js
 * var app = assemble();
 * app.use(search());
 * console.log(app.search);
 * ```
 * @name search
 * @param  {Object} `config` Configuration object used to specify default indexer to use.
 * @return {Function} Plugin function passed to `app.use` methods.
 * @api public
 */

module.exports = function(config) {
  return function plugin(app) {
    if (!utils.isValid(app, 'base-search')) return;
    app.define('search', new utils.Sarge(config));
  };
};
