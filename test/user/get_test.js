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

describe('get all users on the DB', function(){
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('user/findAll')
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('get a user by the username', function(){
	before(function(done){
		chai.request(global.baseUrl)
			.post('user/add')
			.send(user)
			.end(function(err, res){
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('user/delete/' + user.username)
			.end(function(err, res){
				done();
			});
	});

	it('return status 200 and all paraments except the password and __v', function(done){
		chai.request(global.baseUrl)
			.get('user/findByID/' + user.username)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				chai.expect(res.body.username).to.equal(user.username);
				chai.expect(res.body.name).to.equal(user.name);
				chai.expect(res.body.email).to.equal(user.email);
				chai.expect(res.body).to.not.have.property('password');
				chai.expect(res.body).to.not.have.property('__v');
				done();
			});
	});
});

describe('get a user by the name', function(){
	before(function(done){
		chai.request(global.baseUrl)
			.post('user/add')
			.send(user)
			.end(function(err, res){
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('user/delete/' + user.username)
			.end(function(err, res){
				done();
			});
	});

	it('return status 200 and all paraments except the password and __v', function(done){
		chai.request(global.baseUrl)
			.get('user/findByName/' + user.name)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('get a user by the username, user does not exist', function(){

	it('return status 404', function(done){
		chai.request(global.baseUrl)
			.get('user/findByID/' + user.username)
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});
});


