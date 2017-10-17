var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var db = mongoose.createConnection(global.BD_URI, { useMongoClient: true });

db.once('open', function(){
	console.info('Connection to the DB succed! :D');
});

db.on('error', function(err){
	console.log('ERROR: connection to the DB failed :(');
	throw err;
});


module.exports = db;