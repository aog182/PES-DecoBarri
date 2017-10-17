var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var SALT_WORK_FACTOR = 10;

var User = new mongoose.Schema({
	_id: {type : String, required : true},
	name: {type : String, required : true},
	password: {type : String, required : true},
	email: {type : String, required : true}
});

User.pre('save', function(next){
	var user = this;

	//only hash the password if it has been modified (or is new)
	if(!user.isModified('password')) 
		return next();

	//generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err)
			return next(err);

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function(err, hash){
			if(err)
				return next(err);

			user.password = hash;
			next();
		});
	});
});

User.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if(err)
			return cb(err);
		cb(null, isMatch);
	});
};



module.exports = mongoose.model('User', User);


//https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1