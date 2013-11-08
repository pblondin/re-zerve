// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.
module.exports = function routes() {
  //this.root('restaurants#index');
  //this.resources('restaurants');
	

	/*
	 * Clients routes
	 */
	this.match('survey', { controller: 'clients', action: 'startsurvey', via: 'GET'});
	//this.match('reservation', { controller: 'clients', action: 'makereservation', via: 'GET'});
	
	/*
	 * Restaurants routes
	 */
	
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
	this.match('restaurants', 				'restaurants#index');
	this.match('restaurants/new', 			'restaurants#new');
	this.match('restaurants/edit', 			'restaurants#edit');
	this.match('restaurants/delete', 		'restaurants#delete');
	this.match('restaurants/search', 		'restaurants#search');
	this.match('restaurants/:id', 			'restaurants#show');
	this.match('restaurants/:id/showcodes', 'restaurants#showcodes');
	this.match('restaurants/:id/gencodes', 	'restaurants#generatecodes');
	this.match('restaurants', 				{ controller: 'restaurants', action: 'create', via: 'POST'});
	this.match('restaurants/:id', 			{ controller: 'restaurants', action: 'update', via: 'PUT'});
	this.match('restaurants/:id', 			{ controller: 'restaurants', action: 'destroy', via: 'DELETE'});

	/*
	 * Surveys routes
	 */
	this.match('surveycodes/generate', { controller: 'surveycodes', action: 'generate', via: 'POST'});
	this.match('surveycodes/check', { controller: 'surveycodes', action: 'check', via: 'GET'});
	this.match('surveycodes/validate', { controller: 'surveycodes', action: 'validate', via: 'POST'});
	this.resources('surveycodes', { only: ['show', 'update', 'destroy'] });
}
