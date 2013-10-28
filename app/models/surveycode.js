var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var SurveyCodeSchema = Schema({
  code                  : {type: String, unique: true, required: true},
  valid                 : {type: Boolean, default: true},
  create_date           : {type: Date, default: Date.now},
  used_date             : {type: Date, default: null},
  rest_ref		: {type: ObjectId, ref: 'Restaurant'}
});

module.exports = mongoose.model('SurveyCode', SurveyCodeSchema);
