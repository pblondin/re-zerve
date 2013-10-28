var express = require('express');

module.exports = function() {
  this.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  this.set('db-uri', 'mongodb://localhost/rezerve');
  this.set('view options', {
    pretty: true
  });
}
