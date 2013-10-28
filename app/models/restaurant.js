var mongoose = require('mongoose');
var SurveyCode = require('./surveycode');

var Schema = mongoose.Schema;
var Email = mongoose.SchemaTypes.Email;
var ObjectId = mongoose.Schema.Types.ObjectId;

var RestaurantSchema = Schema({
  name                  : {type: String, required: true},
  owner_name            : String,
  reservation_email     : Email,
  survey_url            : String,
  survey_codes          : [{type: ObjectId, ref: 'SurveyCode'}],
  created_at            : {type: Date, default: Date.now}
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
