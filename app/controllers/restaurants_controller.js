var locomotive = require('locomotive');
var mongoose = require('mongoose');
var Controller = locomotive.Controller;

var ObjectId = mongoose.Schema.Types.ObjectId;

var Restaurant = require('../models/restaurant');
var SurveyCode = require('../models/surveycode');
var couponCode = require('coupon-code');
var RestaurantController = new Controller();
 
 
//TODO: Add authentication

/*
 * Routes for Restaurant
 * 
 * Name				Method		Path
 * ---------------------------------------------
 * Index			GET 		/restaurants
 * Show				GET			/restaurants/:id
 * New				GET			/restaurants/new
 * Create			POST		/restaurants
 * Edit 			GET 		/restaurants/edit
 * Update 			PUT 		/restaurants/:id
 * Delete 			GET 		/restaurants/delete
 * Destroy 			DELETE 		/restaurants/:id
 * Search			GET			/restaurants/search?<query>
 * Showcodes		GET			/restaurants/:id/codes
 * Generatecodes	GET			/restaurants/:id/generate?n=<number>
 */


// Index (GET /restaurants)
RestaurantController.index = function() {
	var self = this;
	
	fetchResource({}, self.res, function(err, restaurants) {
	  (err) ? self.next(err) : self.res.json(restaurants);
	});
};

//RestaurantController.index = function() {
//  var self = this;
//  
//  function updateRestaurants(restaurants) {
//	  console.log("update restaurants");
//	  console.log("length: " + restaurants.length);
//	  /*for (var i = 0; i < restaurants.length; i++) {
//		  restaurants[i].getNumValidSurveys(function (err, count) {
//			  console.log("count: " + count);
//			  restaurants[i]['num_valid_surveys'] = count;
//		  });  
//	  }*/
//	  self.render('index', {
//		  'title': "Show all restaurants",
//		  'restaurants': restaurants});
//  }
// 
//  fetchResource({}, self.res, function(err, restaurants) {
//	  if (err)
//		  self.next(err);
//	  else {
//		  updateRestaurants(restaurants);
//	  }
//  });
//};

//Show (GET  /restaurants/:id)
RestaurantController.show = function() {
  var self = this;
  fetchResource({_id: self.param('id')}, self.res, function(err, restaurant) {
    (err) ? self.next(err) : self.render('show', {
    	'title': "View a restaurant",
    	'restaurant': restaurant[0]
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

  var restaurant = new Restaurant({
	  name               : self.param('name'),
	  owner_name         : self.param('owner_name'),
	  reservation_email  : self.param('reservation_email'),
	  survey_url         : self.param('survey_url')
	  });
  restaurant.save(function(err) {
	  (err) ? self.next(err) : self.res.redirect(self.urlFor({ action: 'index' }));
  });
};

// Edit (GET /restaurants/edit)
RestaurantController.edit = function() { 
	var self = this;
	fetchResource({}, self.res, function(err, restaurants) {
	   (err) ? self.next(err) : self.render('edit', {
										title		: 'Edit a restaurant',
										restaurants	: restaurants
									});
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

// Search (GET /restaurants/search?<query>)
RestaurantController.search = function() {
  var self = this;
  var query = self.req.query;
  
  for (var k in query) {
	  if( query.hasOwnProperty(k) ) {
		  query[k] = new RegExp(query[k], "i"); // Find case-insensitive match
	  }
  }  
  fetchResource(query, self.res, function(err, restaurants) {
    (err) ? self.next(err) : self.res.json(restaurants);
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

// Generate survey codes for a specific restaurant (GET /restaurants/:id/generate?n=<number>)
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


//Utility function
fetchResource = function(params, res, cb) {
  Restaurant.find(params, function(err, restaurant) {
    if (err)
      return cb(err, null);
    else if (!restaurant || restaurant.length == 0)
      return cb(null, []);	// Restaurant not found.
    else
      return cb(null, restaurant);
  });
};

updateResource = function(id, update, res, cb) {
  Restaurant.findByIdAndUpdate(id, update, function(err, restaurant) {
    if (err)
      return cb(err, null);
    else if (!restaurant || restaurant.length == 0)
      return cb(null, []);	// Restaurant not found.
    else
      return cb(null, restaurant);
  });
};

module.exports = RestaurantController;
