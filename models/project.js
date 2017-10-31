var mongoose = require('mongoose');

var Project = new mongoose.Schema({
	name: {type : String, required : true},
	theme: {type : String, required : false},
	description: {type : String, required : false},
	city: {type : String, required : true},
	address: {type : String, required : false},
	notes : [{
			title : String, 
			description: String,
			author: String, 
			date: String, 
		    modifiable: Boolean}]
});

module.exports = mongoose.model('Project', Project);