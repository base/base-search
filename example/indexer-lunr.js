'use strict';

var path = require('path');
var lunr = require('lunr');
var write = require('write');
var $ = require('cheerio');

module.exports = function(config) {
  var idx = lunr(function() {
    this.ref('key');
    this.field('title', { boost: 10000 });
    this.field('description', { boost: 100 });
    this.field('tags', { boost: 10 });
    this.field('category', { boost: 10 });
    this.field('body');
  });

  return {
    collect: function(file, next) {
      var title = $(file.content).find('title').text();
      next(null, {
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

      for (var key in files) {
        if (files.hasOwnProperty(key)) {
          idx.add(files[key]);
        }
      }
      var fp = options.base
        ? path.join(options.base, 'lunr-search.json')
        : path.join(__dirname, 'lunr-search.json');
      var content = JSON.stringify({files: files, idx: idx});
      write(fp, content, cb);
    }
  };
};
