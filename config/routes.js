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
	this.match('restaurants/search', 'restaurants#search');
	this.match('restaurants/:id/showcodes', 'restaurants#showcodes');
	this.match('restaurants/:id/gencodes', 'restaurants#generatecodes');
	this.resources('restaurants');
	/*
	 * Surveys routes
	 */
	this.match('surveycodes/generate', { controller: 'surveycodes', action: 'generate', via: 'POST'});
	this.match('surveycodes/check', { controller: 'surveycodes', action: 'check', via: 'GET'});
	this.match('surveycodes/validate', { controller: 'surveycodes', action: 'validate', via: 'POST'});
	this.resources('surveycodes', { only: ['show', 'update', 'destroy'] });
}
