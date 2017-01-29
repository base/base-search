'use strict';

var path = require('path');
var lunr = require('lunr');
var exists = require('fs-exists-sync');
var args = require('yargs-parser')(process.argv.slice(2));

if (!exists(path.join(__dirname, 'lunr-search.json'))) {
  console.log('Run `$ node example -i lunr` first to generate the search index.');
  process.exit();
}

var data = require('./lunr-search.json');
var idx = lunr.Index.load(data.idx);
var term = args._.join(' ');
console.log(`Searching for "${term}"`);
var results = idx.search(term);

console.log(`Found ${results.length} result${results.length === 1 ? '' : 's'}`);
console.log();
results.forEach(function(result) {
  var key = result.ref;
  var file = data.files[key];
  console.log(` - ${key}`);
  console.log(file);
  console.log();
});
