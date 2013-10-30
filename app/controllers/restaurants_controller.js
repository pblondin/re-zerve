var locomotive = require('locomotive');
var mongoose = require('mongoose');
var Controller = locomotive.Controller;

var ObjectId = mongoose.Schema.Types.ObjectId;

var Restaurant = require('../models/restaurant');
var SurveyCode = require('../models/surveycode');
var couponCode = require('coupon-code');
var RestaurantController = new Controller();
 
 
//TODO: Add authentification

// Utility function
fetchResource = function(params, res, cb) {
  Restaurant.find(params, function(err, restaurant) {
    if (err)
      return cb(err, null);
    else if (!restaurant || restaurant.length == 0)
      return res.send('Restaurant not found.');
    else
      return cb(null, restaurant);
  });
};

updateResource = function(id, update, res, cb) {
  Restaurant.findByIdAndUpdate(id, update, function(err, restaurant) {
    if (err)
      return cb(err, null);
    else if (!restaurant || restaurant.length == 0)
      return res.send('Restaurant not found.');
    else
      return cb(null, restaurant);
  });
};

// Index (GET /restaurants)
RestaurantController.index = function() {
  var self = this; 
  fetchResource({}, self.res, function(err, restaurants) {
    (err) ? self.next(err) : self.render('index', {
    	'title': "Show all restaurants",
    	'restaurants': restaurants
    });
  });
};

// New (GET	/restaurants/new)
RestaurantController.new = function() { 
  var self = this;
  self.render('new', {
	  title		: 'New restaurant'
  });
};

// Create (POST	/restaurants)
RestaurantController.create = function() {
  var self = this;
  
  self.req.assert('name', 'Name is required').notEmpty();
  self.req.assert('survey_url', 'A valid URL is required').isUrl();
  self.req.assert('survey_url', 'Survey URL is required').notEmpty();
  self.req.assert('reservation_email', 'A valid email is required').isEmail();
  self.req.assert('reservation_email', 'Reservation email is required').notEmpty();
  
  var errors = self.req.validationErrors(true);
  if (errors) {
	  self.res.json({
		  title			: 'New restaurant',
		  has_errors	: true,
		  errors		: errors
	  });
  } else {
	  var restaurant = new Restaurant({
		  name               : self.param('name'),
		  owner_name         : self.param('owner_name'),
		  reservation_email  : self.param('reservation_email'),
		  survey_url         : self.param('survey_url')
		  });
	  restaurant.save(function(err) {
		  (err) ? self.next(err) : self.res.json({ has_errors: false, url: self.urlFor({ action: 'index' }) });
	  });
  }
};

// Show (GET  /restaurants/:id)
RestaurantController.show = function() {
  var self = this;
  fetchResource({_id: self.param('id')}, self.res, function(err, restaurant) {
    (err) ? self.next(err) : self.render('show', {
    	'title': "View a restaurant",
    	'restaurant': restaurant[0]
    });
  });
};

// Search (GET /restaurants/search?s=<query>)
RestaurantController.search = function() {
  var self = this;
  fetchResource(self.req.query, self.res, function(err, restaurants) {
    (err) ? self.next(err) : self.res.send(restaurants);
  });
};

// Edit (GET /restaurants/:id/edit)
RestaurantController.edit = function() { 
  var self = this;
  updateResource(self.param('id'), self.req.query, self.res, function(err, restaurant) {
    (err) ? self.next(err) : self.res.send(restaurant);
  });
};

// Update (PUT /restaurants/:id)
RestaurantController.update = function() { 
  var self = this;
  updateResource(self.param('id'), self.req.body, self.res, function(err, restaurant) {
    (err) ? self.next(err) : self.res.send(restaurant);
  });
};

// Destroy (DELETE /restaurants/:id)
RestaurantController.destroy = function() {
  var self = this;
  Restaurant.findByIdAndRemove(self.param('id'), function(err, restaurant) {
    if (err)
      self.next(err);
    else if (!restaurant)
      self.res.send('Restaurant not found.');
    else
      self.res.send('Restaurant successfully deleted.');
  });
};

// Show all survey codes (GET /restaurants/:id/codes)
RestaurantController.showcodes = function() {
  var self = this;
  Restaurant
    .findById(self.param('id'))
    .populate('survey_codes')
    .exec(function(err, restaurant) {
      if (err)
        self.next(err);
      else if (!restaurant)
        self.res.send('No restaurant found.'); 
      else if (restaurant.survey_codes.length == 0)
        self.res.send('No survey codes are yet generated.');
      else
        self.res.send(restaurant.survey_codes);
    });        
};

// Generate survey codes for a specific restaurant (GET /restaurants/:id/generate?n=XX)
RestaurantController.generatecodes = function() {
  var self = this;
  var number_of_codes = 10;

  fetchResource({_id: self.param('id')}, self.res, function(err, restaurant) {
    if (err)
      self.next(err);
    else {
      var number = (! self.param('n')) ? number_of_codes : self.param('n');
      for (var i = 1; i <= number; i++) {
        var cc = couponCode.generate({ parts: 2});
        var my_code = new SurveyCode({code: cc, rest_ref: restaurant[0]._id });
        my_code.save(function(err){	
          if (err) return next(err); //self.res.send('Error saving the survey code.');
        });
        restaurant[0].survey_codes.push(my_code._id);
      } 
      restaurant[0].save(function(err) {
        (err) ? self.next(err) : self.res.send(restaurant[0]);
      });
    }
  });
};

module.exports = RestaurantController;
