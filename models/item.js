var mongoose = require('mongoose');

var Item = new mongoose.Schema({
	name: {type : String, required : true},
	description: {type : String, required : false},
});

module.exports = mongoose.model('Item', Item);


//https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1