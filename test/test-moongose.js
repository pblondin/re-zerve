var mongoose = require('../node_modules/mongoose');
mongoose.connect('mongodb://localhost/rezerve');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var Schema = mongoose.Schema;
var Email = mongoose.SchemaTypes.Email;
var ObjectId = mongoose.SchemaTypes.ObjectId;

//var SurveyCode = require('../app/models/surveycode');
//var Restaurant = require('../app/models/restaurant');


var SurveyCodeSchema =  Schema({
  code                  : {type: String, unique: true, required: true},
  valid                 : {type: Boolean, default: true},
  create_date           : {type: Date, default: Date.now},
  used_date             : {type: Date, default: null}
});

var RestaurantSchema = Schema({
  id                    : {type: String, required: true, unique: true},  // Restaurant ID. E.g. Le Bitoque = 'BI0'
  name                  : {type: String, required: true},
  owner_name            : String,
  //reservation_email     : mongoose.SchemaTypes.Email,
  survey_url            : String,
  created_at            : {type: Date, default: Date.now},
  survey_codes          : [{type: ObjectId, ref: SurveyCode}]
});

var Restaurant = mongoose.model('Restaurant', RestaurantSchema);
var SurveyCode = mongoose.model('SurveyCode', SurveyCodeSchema);
