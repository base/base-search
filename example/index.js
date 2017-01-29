'use strict';

var assemble = require('assemble');
var search = require('../');

var args = require('yargs-parser')(process.argv.slice(2), {
  alias: {i: 'indexer'},
  default: {i: 'default'}
});

var config = require('./config')(args);
var app = new assemble();
app.use(search({indexer: args.i}));
app.search.indexer('lunr', require('./indexer-lunr')(config))
app.search.indexer('algolia', require('./indexer-algolia')(config))

app.src('docs/*.html', {cwd: __dirname})
  .pipe(app.search.collect())
  .on('data', function(){})
  .on('end', function() {
    app.search.index(function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(app.search.files);
      console.log('done');
      process.exit();
    });
  });
