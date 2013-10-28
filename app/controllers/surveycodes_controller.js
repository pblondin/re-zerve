var locomotive = require('locomotive');
var Controller = locomotive.Controller;

var SurveyCode = require('../models/surveycode');
var CouponCode = require('coupon-code');
var SurveyCodeController = new Controller();
 
 
//TODO: Add authentification

// Show (GET  /surveycodes/:id)
SurveyCodeController.show = function() {
  var self = this;
  SurveyCode
    .findById(self.param('id'))
    .populate('rest_ref')
    .exec(function(err, surveycode) {
      if (err)
        self.next(err);
      else if (!surveycode)
        self.res.send('Survey Code not found.');
      else
        self.res.send(surveycode);
    });
};

// Update (PUT /surveycodes/:id)
SurveyCodeController.update = function() { 
  var self = this;
  var body = self.req.body;
  
  SurveyCode.findByIdAndUpdate(self.param('id'), body, function(err, surveycode) {
    surveycode; 
    if (err)
      self.next(err);
    else if (!surveycode)
      self.res.send('SurveyCode not found.');
    else
      self.res.send(surveycode);
  });
};

// Destroy (DELETE /surveycodes/:id)
SurveyCodeController.destroy = function() {
  var self = this;
  SurveyCode.findByIdAndRemove(self.param('id'), function(err, surveycode) {
    if (err)
      self.next(err);
    else if (!surveycode)
      self.res.send('SurveyCode not found.');
    else
      self.res.send('SurveyCode successfully deleted.');
  });
};

// Validate (POST /surveycodes/validate)
SurveyCodeController.validate = function() {
  var self = this;
  var uCode = self.req.body.code;
  var vCode = CouponCode.validate({code: uCode, parts: 2});
  
  if (vCode == '')
    return  self.res.send('Code is invalid.');

  SurveyCode
    .find({code: vCode})
    .populate('rest_ref')
    .exec(function(err, surveycode) {
      if (err)
        self.next(err);
      else if (!surveycode)
        self.res.send('SurveyCode not found.');
      else
        self.res.send(surveycode);
    });
};

module.exports = SurveyCodeController; 
