var mongoose = require('mongoose');

var Project = new mongoose.Schema({
	_id: {type : String, required : true},
	name: {type : String, required : true, trim:true},
	theme: {type : String, required : false, trim:true},
	description: {type : String, required : false, trim:true},
	city: {type : String, required : true, trim:true},
	address: {type : String, required : false},
	members : [{type : String, required : false}],
	notes : [{
			_id: {type : String, required : true},
			title : {type : String, required : true, trim:true},
			description: {type : String, required : true, trim:true},
			author: {type : String, required : true, trim:true}, 
			date: {type : String, required : true, trim:true}, 
		    modifiable: {type : Boolean, required : true, trim:true}}],
	tags : [{tag : String, required : false}],
	lat: {type : String, required: true},
	lng: {type : String, required: true}, 
    material_id : [{
    		mat_id: {type : String, required : false}}],
    items_list : [{
    		item_id: {type : String, requiered : false}}]

});

module.exports = mongoose.model('Project', Project);