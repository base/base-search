'use strict';

var algolia = require('algoliasearch');
var args = require('yargs-parser')(process.argv.slice(2));
var config = require('./config')(args);

var client = algolia(config.ALGOLIA_APPLICATION_ID, config.ALGOLIA_SECRET_KEY);
var idx = client.initIndex('base-search-example');
var term = args._.join(' ');

console.log(`Searching for "${term}"`);
idx.search(term, function(err, results) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Found ${results.nbHits} result${results.nbHits === 1 ? '' : 's'}`);
  console.log();
  results.hits.forEach(function(result) {
    var key = result.key;
    console.log(` - ${key}`);
    console.log(result);
    console.log();
  });
  process.exit();
});
