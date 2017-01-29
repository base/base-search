'use strict';

module.exports = function() {
  return {
    collect: function(file, next) {
      return next(null, file);
    },
    index: function(files, options, cb) {
      cb();
    }
  };
};
