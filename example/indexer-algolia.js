'use strict';

var each = require('async-each');
var path = require('path');
var $ = require('cheerio');
var write = require('write');
var algolia = require('algoliasearch');

module.exports = function(config) {
  var client = algolia(config.ALGOLIA_APPLICATION_ID, config.ALGOLIA_SECRET_KEY);
  var idx = client.initIndex('base-search-example');

  return {
    collect: function(file, next) {
      var title = $(file.content).find('title').text();
      next(null, {
        objectID: file.key,
        key: file.key,
        title: file.data.title || title || file.key,
        tags: [],
        category: file.data.category || 'docs',
        description: file.data.description || file.data.title || file.key,
        body: $(file.content).find('.main-content').text()
      });
    },
    index: function(files, options, cb) {
      if (typeof options === 'function') {
        cb = options;
        options = {};
      }

      each(Object.keys(files), function(key, next) {
        if (files.hasOwnProperty(key)) {
          idx.addObject(files[key], next);
          return;
        }
        next();
      }, cb);
    }
  };
};
