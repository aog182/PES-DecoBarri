var mongoose = require('mongoose');

var Material = new mongoose.Schema({
	_id: {type : String, required : true},
	name: {type : String, required : true},
	description: {type : String, required : false},
	urgent: {type: Boolean, required: true},
	quantity: {type : Number, min: 0, required : true},
	address: {type : String, required : false},
	img : {type: Buffer} 
});

module.exports = mongoose.model('Material', Material);
