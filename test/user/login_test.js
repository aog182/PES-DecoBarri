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

describe('login succed', function(){
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
			.end(function(err){
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('user/delete/' + user.username)
			.end(function(err){
				done();
			});
	});

	let user_login = {
		username: user.username,
		password: user.password
	};

	it('returns status 200',function(done){
		chai.request(global.baseUrl)
			.post('user/login')
			.send(user_login)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('login failed password wrong', function(){
	before(function(done){
		chai.request(global.baseUrl)
			.post('user/add')
			.send(user)
			.end(function(err){
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('user/delete/' + user.username)
			.end(function(err){
				done();
			});
	});

	let user_login = {
		username: user.username,
		password: user.password + 'a'
	};

	it('returns status 401',function(done){
		chai.request(global.baseUrl)
			.post('user/login')
			.send(user_login)
			.end(function(err, res){
				chai.expect(res).to.have.status(401);
				done();
			});
	});
});

describe('login failed id wrong', function(){
	before(function(done){
		chai.request(global.baseUrl)
			.post('user/add')
			.send(user)
			.end(function(err){
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('user/delete/' + user.username)
			.end(function(err){
				done();
			});
	});

	let user_login = {
		username: user.username+'dsfs',
		password: user.password
	};

	it('returns status 404',function(done){
		chai.request(global.baseUrl)
			.post('user/login')
			.send(user_login)
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});
});

