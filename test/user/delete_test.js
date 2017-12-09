var request = require('request');
var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

require('../../config');

var user = {
	username: "xavi",
	name: "xavier",
	password: "1234",
	email: "xavi@email.com"
}

describe('delete a user from the DB', function(){
	before(function(done){
		chai.request(global.baseUrl)
			.delete('user/deleteAllUsers')
			.end(function(err, res){
				done();
			});
	});

	before(function(done){
		chai.request(global.baseUrl)
			.post('user/add')
			.send(user)
			.end(function(err, res){
				done();
			});
	});

	it('returns status 200', function(done){
		chai.request(global.baseUrl)
			.delete('user/delete/' + user.username)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('delete a user that does not exist', function(){

	it('returns status 404', function(done){
		chai.request(global.baseUrl)
			.delete('user/delete/' + user.username)
			.end(function(err, res){
				console.log(res.text);
				chai.expect(res).to.have.status(404);
				done();
			});
	});
});
