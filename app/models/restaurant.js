var mongoose = require('mongoose');
var SurveyCode = require('./surveycode');

var Schema = mongoose.Schema;
var Email = mongoose.SchemaTypes.Email;
var ObjectId = mongoose.Schema.Types.ObjectId;

var RestaurantSchema = Schema({
	name                  : {type: String, required: true},
	owner_name            : String,
	reservation_email     : String,
	survey_url            : String,
	survey_codes          : [{type: ObjectId, ref: 'SurveyCode'}],
	created_at            : {type: Date, default: Date.now}
});

RestaurantSchema.virtual('num_surveys').get(function() {
	return this.survey_codes.length;
});

RestaurantSchema.methods.getNumValidSurveys = function(cb) {
	var conditions = { $and: [ { _id: { $in: this.survey_codes } }, { is_valid: true} ] };
	
	SurveyCode.count( conditions, function(err, count) { 
		(err) ? cb(err, "") : cb("", count);
	});
}

module.exports = mongoose.model('Restaurant', RestaurantSchema);
