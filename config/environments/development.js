var express = require('express');
var utils = require('connect').utils;

module.exports = function() {
  this.set('db-uri', 'mongodb://localhost/rezerve');
  this.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  
  // Set pretty prints
  this.express.locals.pretty = true;
};
