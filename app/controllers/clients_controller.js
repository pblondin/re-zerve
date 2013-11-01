var locomotive = require('locomotive');
var mongoose = require('mongoose');
var Controller = locomotive.Controller;

var ObjectId = mongoose.Schema.Types.ObjectId;

var Restaurant = require('../models/restaurant');
var SurveyCode = require('../models/surveycode');
var couponCode = require('coupon-code');
var ClientController = new Controller();

//Index (GET /survey)
ClientController.startsurvey = function() {
	var self = this;
	self.render('startsurvey', {
		title: 'Check your survey code'
	});
};

//Index (GET /reservation)
ClientController.makereservation = function() {
	
};

module.exports = ClientController;