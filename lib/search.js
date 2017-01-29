'use strict';

var path = require('path');
var utils = require('./utils');
var indexer = require('./indexer');

function Search(options) {
  if (!(this instanceof Search)) {
    return new Search(options);
  }
  utils.define(this, 'indexers', {});
  utils.define(this, 'options', utils.extend({}, options));
  utils.define(this, 'files', {});
  this.indexer('default', indexer());
}

Search.prototype.indexer = function(name, indexer) {
  if (typeof name !== 'string') {
    throw new TypeError('expected "name" to be a string');
  }

  if (typeof indexer === 'undefined') {
    if (this.indexers[name]) {
      return this.indexers[name];
    }
    throw new Error(`Unable to find indexer "${name}"`);
  }

  this.indexers[name] = indexer;
  return this;
};

Search.prototype.collect = function(options) {
  var self = this;
  var opts = utils.extend({indexer: 'default'}, this.options, options);
  var indexer = this.indexer(opts.indexer);

  return utils.through.obj(function(file, enc, next) {
    indexer.collect(file, function(err, obj) {
      if (err) return next(err);
      self.files[obj.key || file.key] = obj;
      next(null, file);
    });
  });
};

Search.prototype.index = function(options, cb) {
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (typeof cb !== 'function') {
    throw new TypeError('expected "cb" to be a function');
  }

  var opts = utils.extend({indexer: 'default'}, this.options, options);
  var indexer = this.indexer(opts.indexer);
  indexer.index(this.files, opts, cb);
};

module.exports = Search;
