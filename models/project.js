var mongoose = require('mongoose');

var Project = new mongoose.Schema({
	_id: {type : String, required : true},
	name: {type : String, required : true, trim:true},
	theme: {type : String, required : false, trim:true},
	description: {type : String, required : false, trim:true},
	city: {type : String, required : true, trim:true},
	address: {type : String, required : false},
	members : [{type : String}],
	notes : [{
			_id: {type : String, required : true},
			title : {type : String, required : true, trim:true},
			description: {type : String, required : true, trim:true},
			author: {type : String, required : true, trim:true}, 
			date: {type : String, required : true, trim:true}, 
		    modifiable: {type : Boolean, required : true, trim:true}}],
	tags : [{tag : String}]

});

module.exports = mongoose.model('Project', Project);