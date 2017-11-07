var mongoose = require('mongoose');

var Projects_tags = new mongoose.Schema({
	_id: {type : String, required : true, trim:true},
	projects : [{_id : String}]
});

module.exports = mongoose.model('Projects_tags', Projects_tags);


//https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1