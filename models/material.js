var mongoose = require('mongoose');

var Material = new mongoose.Schema({
	name: {type : String, required : true},
	description: {type : String, required : false},
	urgent: {type: Boolean, required: true},
	quantity: {type : String, required : true},
	address: {type : String, required : false}
});

module.exports = mongoose.model('Material', Material);