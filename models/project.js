var mongoose = require('mongoose');
var Integer = require("asn1/lib/ber/types").Integer;

var Project = new mongoose.Schema({
	_id: {type : String, required : true},
	name: {type : String, required : true, trim:true},
	theme: {type : String, required : false, trim:true},
	description: {type : String, required : false, trim:true},
	city: {type : String, required : true, trim:true},
	address: {type : String, required : false},
	members : [{type : String, required : false}],
	admin: {type : String, required : true, trim:true},
	notes : [{
			_id: {type : String, required : true},
			title : {type : String, required : true, trim:true},
			description: {type : String, required : true, trim:true},
			author: {type : String, required : true, trim:true}, 
			date: {type : String, required : true, trim:true}, 
		    modifiable: {type : Boolean, required : true, trim:true},
			color: {type : String, required : true, trim:true}}],
	tags : [{tag : String, required : false}],
	lat: {type : String, required: true},
	lng: {type : String, required: true}, 
    items_list : [{
    		_id: {type : String, requiered : true},
    		name: {type : String, required : true, trim:true},
    		description: {type : String, required : true, trim:true}}],
	material_id : [{type: mongoose.Schema.Types.ObjectId, ref: 'Material'}]

});

module.exports = mongoose.model('Project', Project);