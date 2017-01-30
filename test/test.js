'use strict';

require('mocha');
var Base = require('base-app');
var assert = require('assert');
var each = require('async-each');
var search = require('../');
var app;

describe('base-search', function() {
  beforeEach(function() {
    app = new Base();
    app.use(search());
  });

  it('should export a function', function() {
    assert.equal(typeof search, 'function');
  });

  it('should add a `search` property to a base application', function() {
    assert(app.search, 'expected app to have a `search` property');
    assert.equal(typeof app.search, 'object');
  });

  it('should register an indexer', function() {
    var foo = {
      collect: function() {},
      index: function() {}
    };

    app.search.indexer('foo', foo);
    assert.deepEqual(app.search.indexers.foo, foo);
  });

  it('should get a registered indexer', function() {
    var foo = {
      collect: function() {},
      index: function() {}
    };

    app.search.indexer('foo', foo);
    assert.deepEqual(app.search.indexer('foo'), foo);
  });

  it('should throw an error if getting an unregistered indexer', function(cb) {
    try {
      app.search.indexer('foo');
      cb(new Error('expected an error'));
    } catch (err) {
      assert.equal(err.message, 'Unable to find indexer "foo"');
      cb();
    }
  });

  describe('collect', function() {
    it('should return a stream', function() {
      var stream = app.search.collect();
      assert(stream, 'expected a stream to be returned');
      assert.equal(typeof stream.on, 'function');
      assert.equal(typeof stream.pipe, 'function');
    });

    it('should collect file objects and add them to the files object', function(cb) {
      var stream = app.search.collect();
      stream.once('error', cb);
      stream.on('data', function() {});
      stream.on('end', function() {
        assert.deepEqual(app.search.files, {
          foo: {key: 'foo'},
          bar: {key: 'bar'},
          baz: {key: 'baz'}
        });
        cb();
      });

      stream.write({key: 'foo'});
      stream.write({key: 'bar'});
      stream.write({key: 'baz'});
      stream.end();
    });
  });

  describe('index', function() {
    it('should index files with the index method on the indexer', function(cb) {
      var foo = {
        collect: function(file, next) {
          next(null, file);
        },
        index: function(files, options, next) {
          assert.deepEqual(files, {
            foo: {key: 'foo'},
            bar: {key: 'bar'},
            baz: {key: 'baz'}
          });
          next();
        }
      };
      app.search.indexer('foo', foo);
      var stream = app.search.collect({indexer: 'foo'});
      stream.once('error', cb);
      stream.on('data', function() {});
      stream.on('end', function() {
        app.search.index({indexer: 'foo'}, cb);
      });

      stream.write({key: 'foo'});
      stream.write({key: 'bar'});
      stream.write({key: 'baz'});
      stream.end();
    });

    it('should allow using multiple indexers', function(cb) {
      var count = 0;
      var foo = {
        index: function(files, options, next) {
          count++;
          assert.deepEqual(files, {
            foo: {key: 'foo'},
            bar: {key: 'bar'},
            baz: {key: 'baz'}
          });
          next();
        }
      };

      var bar = {
        index: function(files, options, next) {
          count++;
          assert.deepEqual(files, {
            foo: {key: 'foo'},
            bar: {key: 'bar'},
            baz: {key: 'baz'}
          });
          next();
        }
      };

      app.search.indexer('foo', foo);
      app.search.indexer('bar', bar);

      // use default indexer to collect files
      var stream = app.search.collect();
      stream.once('error', cb);
      stream.on('data', function() {});
      stream.on('end', function() {
        // use foo and bar indexers to index results
        each(['foo', 'bar'], function(name, next) {
          app.search.index({indexer: name}, next);
        }, function(err) {
          if (err) return cb(err);
          assert.equal(count, 2);
          cb();
        });
      });

      stream.write({key: 'foo'});
      stream.write({key: 'bar'});
      stream.write({key: 'baz'});
      stream.end();
    });
  });
});
