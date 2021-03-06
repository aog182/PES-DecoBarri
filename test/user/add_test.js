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

describe('add user', function(){

	before(function(done){
		chai.request(global.baseUrl)
			.delete('user/deleteAllUsers')
			.end(function(err, res){
				done();
			});
	});

	it('returns status 200',function(done){
		chai.request(global.baseUrl)
			.post('user/add')
			.send(user)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});	
});

describe('add user already registered', function(){

	it('returns status 409',function(done){
		chai.request(global.baseUrl)
			.post('user/add')
			.send(user)
			.end(function(err, res){
				chai.expect(res).to.have.status(409);
				done();
			});
	});	
});

describe('add user with same email', function(){

	var user2 = {
		username: user.username,
		name: user.name+'a',
		password: "1234",
		email: user.email
	}

	it('returns status 409',function(done){
		chai.request(global.baseUrl)
			.post('user/add')
			.send(user2)
			.end(function(err, res){
				chai.expect(res).to.have.status(409);
				done();
			});
	});	
});


