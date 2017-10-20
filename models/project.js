var mongoose = require('mongoose');

var Project = new mongoose.Schema({
	_id: {type : String, required : true},
	name: {type : String, required : true},
	theme: {type : String, required : false},
	description: {type : String, required : false},
	city: {type : String, required : true},
	address: {type : String, required : false}

},{collection: 'Project'});

module.exports = mongoose.model('Project', Project);