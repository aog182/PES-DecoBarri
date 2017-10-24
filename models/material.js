var mongoose = require('mongoose');

var Material = new mongoose.Schema({
	_id: {type : String, required : true},
	name: {type : String, required : true},
	description: {type : String, required : false},
	address: {type : String, required : false},
	urgent: {type: Boolean, required: false}

},{collection: 'material'});

module.exports = mongoose.model('material', Material);