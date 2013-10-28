var express = require('express');

module.exports = function() {
  this.use(express.errorHandler());
  this.set('db-uri', 'mongodb://localhost/rezerve');
}
