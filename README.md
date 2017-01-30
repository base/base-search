# base-search [![NPM version](https://img.shields.io/npm/v/base-search.svg?style=flat)](https://www.npmjs.com/package/base-search) [![NPM monthly downloads](https://img.shields.io/npm/dm/base-search.svg?style=flat)](https://npmjs.org/package/base-search)  [![NPM total downloads](https://img.shields.io/npm/dt/base-search.svg?style=flat)](https://npmjs.org/package/base-search) [![Linux Build Status](https://img.shields.io/travis/node-base/base-search.svg?style=flat&label=Travis)](https://travis-ci.org/node-base/base-search)

> Base plugin that adds methods for creating, updating and using search indexes.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save base-search
```

## Usage

```js
var search = require('base-search');
```

## API

### [.search](index.js#L20)

Plugin for [base](https://github.com/node-base/base) applications like [generate](https://github.com/generate/generate), [assemble](https://github.com/assemble/assemble), [verb](https://github.com/verbose/verb), and [update](https://github.com/update/update) to add methods for creating search indexices using [indexers](#indexers).

**Params**

* `config` **{Object}**: Configuration object used to specify default indexer to use.
* `returns` **{Function}**: Plugin function passed to `app.use` methods.

**Example**

```js
var app = assemble();
app.use(search());
```

### [Search](lib/search.js#L21)

Search object used to register [indexers](#indexers) and execute the [collect](#collect) and [index](#index) methods on indexers.

**Params**

* `options` **{Object}**: Options to control defaults.
* `options.indexer` **{String}**: Set a default indexer to use when one isn't specified in [.collect](#collect) or [.index](#index). Defaults to "default".

**Example**

```js
// plugin adds `.search` property to `app` which is an instance of `Search`
app.use(search())
console.log(app.search);
```

### [.indexer](lib/search.js#L46)

Get or set an indexer by name. This throws an error if only name is passed and the indexer is not found.

**Params**

* `name` **{String}**: Name of indexer to get or set.
* `indexer` **{Object}**: Instance of an indexer. See [indexers](#indexers) for more information.
* `returns` **{Object}**: Search instance when setting, indexer instance when getting.

**Example**

```js
// set
app.search.indexer('foo', foo);
// get
var foo = app.search.indexer('foo');
```

### [.collect](lib/search.js#L79)

Creates a through stream that will execute `.collect` method on specified indexer for each file passing through the stream. The `.collect` method passes an object to the callback that will be collected and then indexed when `.index` is called.

**Params**

* `options` **{Object}**: Options used to specify the indexer to use.
* `returns` **{Stream}**: Through stream that's used to collect files to index.

**Example**

```js
app.src('*.md')
  // use default set on instance or "default" indexer
  .pipe(app.search.collect())
  // or specify a registred indexer to use
  .pipe(app.search.collect({indexer: 'foo'}));
```

### [.index](lib/search.js#L118)

Executes the `.index` method on the specified indexer passing the collected files and options along with a callback to indicate when indexing is finished.

**Params**

* `options` **{Object}**: Options to specify the indexer to use and to pass into the `.index` method.
* `cb` **{Function}**: Callback function passed into the indexer's `.index` method to specify when indexing is finished.

**Example**

```js
// use default indexer specified when adding the plugin
app.search.index(function(err) {
  if (err) return console.error(err);
  console.log('indexing finished');
});

// use registered indexer
app.search.index({indexer: 'foo'}, function(err) {
  if (err) return console.error(err);
  console.log('indexing finished');
});
```

### Indexers

Indexers are objects that have `collect` and `index` methods that will be executed when [collect](#collect) or [index](#index) are called on [app.search](#search).

The indexer objects may be plain objects or instances created with those methods. See the [examples](examples) to see what indexers may look like.

Simple object to be used in examples below.

```js
var indexer = {};
```

#### .collect

The collect method on an indexer will be passed a `file` object and a `next` callback. The collect method
should create an object to pass back to `next` that will be added to the `.files` collection on the `search` instance.

If `file` is a view from [assemble](https://github.com/assemble/assemble), we can collect information about the file that we want to index:

```js
indexer.collect = function(file, next) {
  var obj = {
    key: file.key,
    title: file.data.title,
    category: file.data.category,
    url: file.data.url,
    body: file.content
  };
  // return the object
  next(null, obj);
};
```

#### .index

The index method on an indexer will be passed a `files` object containing all fo the collected files, an `options` object which is the same as the `options` passed into the [search.index](#index) method, and a callback function to call when indexing is complete. The callback function is the same as the one passed into the [search.index](#index) method so users may choose to return additional information if necessary.

```js
indexer.index = function(files, options, cb) {
  for (var key in files) {
    if (files.hasOwnProperty(key)) {
      console.log(key);
      console.log(files[key]);
      console.log();
    }
  }
  cb();
};
```

## About

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](contributing.md) for advice on opening issues, pull requests, and coding standards.

### Building docs

_(This document was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme) (a [verb](https://github.com/verbose/verb) generator), please don't edit the readme directly. Any changes to the readme must be made in [.verb.md](.verb.md).)_

To generate the readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-generate-readme && verb
```

### Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

### Author

**Brian Woodward**

* [github/doowb](https://github.com/doowb)
* [twitter/doowb](https://twitter.com/doowb)

### License

Copyright © 2017, [Brian Woodward](https://github.com/doowb).
Released under the [MIT license](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.4.1, on January 30, 2017._