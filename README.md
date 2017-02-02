# base-search [![NPM version](https://img.shields.io/npm/v/base-search.svg?style=flat)](https://www.npmjs.com/package/base-search) [![NPM monthly downloads](https://img.shields.io/npm/dm/base-search.svg?style=flat)](https://npmjs.org/package/base-search)  [![NPM total downloads](https://img.shields.io/npm/dt/base-search.svg?style=flat)](https://npmjs.org/package/base-search) [![Linux Build Status](https://img.shields.io/travis/node-base/base-search.svg?style=flat&label=Travis)](https://travis-ci.org/node-base/base-search)

> Base plugin that adds methods for creating, updating and using search indices.

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

Plugin for [base](https://github.com/node-base/base) applications like [generate](https://github.com/generate/generate), [assemble](https://github.com/assemble/assemble), [verb](https://github.com/verbose/verb), and [update](https://github.com/update/update) to add an instance of [sarge](https://github.com/doowb/sarge) as `app.search` that has methods for creating search indices using [indexers](#indexers).

**Params**

* `config` **{Object}**: Configuration object used to specify default indexer to use.
* `returns` **{Function}**: Plugin function passed to `app.use` methods.

**Example**

```js
var app = assemble();
app.use(search());
console.log(app.search);
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

### Related projects

* [assemble](https://www.npmjs.com/package/assemble): Get the rocks out of your socks! Assemble makes you fast at creating web projects… [more](https://github.com/assemble/assemble) | [homepage](https://github.com/assemble/assemble "Get the rocks out of your socks! Assemble makes you fast at creating web projects. Assemble is used by thousands of projects for rapid prototyping, creating themes, scaffolds, boilerplates, e-books, UI components, API documentation, blogs, building websit")
* [base](https://www.npmjs.com/package/base): base is the foundation for creating modular, unit testable and highly pluggable node.js applications, starting… [more](https://github.com/node-base/base) | [homepage](https://github.com/node-base/base "base is the foundation for creating modular, unit testable and highly pluggable node.js applications, starting with a handful of common methods, like `set`, `get`, `del` and `use`.")
* [generate](https://www.npmjs.com/package/generate): Command line tool and developer framework for scaffolding out new GitHub projects. Generate offers the… [more](https://github.com/generate/generate) | [homepage](https://github.com/generate/generate "Command line tool and developer framework for scaffolding out new GitHub projects. Generate offers the robustness and configurability of Yeoman, the expressiveness and simplicity of Slush, and more powerful flow control and composability than either.")
* [sarge](https://www.npmjs.com/package/sarge): Register and use custom search indexers to create, update and use search indices. | [homepage](https://github.com/doowb/sarge "Register and use custom search indexers to create, update and use search indices.")
* [search-indexer-algolia](https://www.npmjs.com/package/search-indexer-algolia): base-search indexer to enable collecting and adding records to an algolia search index | [homepage](https://github.com/doowb/search-indexer-algolia "base-search indexer to enable collecting and adding records to an algolia search index")
* [update](https://www.npmjs.com/package/update): Be scalable! Update is a new, open source developer framework and CLI for automating updates… [more](https://github.com/update/update) | [homepage](https://github.com/update/update "Be scalable! Update is a new, open source developer framework and CLI for automating updates of any kind in code projects.")
* [verb](https://www.npmjs.com/package/verb): Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used… [more](https://github.com/verbose/verb) | [homepage](https://github.com/verbose/verb "Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used on hundreds of projects of all sizes to generate everything from API docs to readmes.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](contributing.md) for advice on opening issues, pull requests, and coding standards.

### Building docs

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

### Running tests

Install dev dependencies:

```sh
$ npm install && npm test
```

### Author

**Brian Woodward**

* [github/doowb](https://github.com/doowb)
* [twitter/doowb](https://twitter.com/doowb)

### License

Copyright © 2017, [Brian Woodward](https://github.com/doowb).
MIT

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.4.2, on February 01, 2017._