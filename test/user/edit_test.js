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

describe('edit a user that exists', function(){
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

	var new_user = {
		name : 'albert',
		email : 'albert@email.com'
	};

	it('returns status 200', function(done){
		chai.request(global.baseUrl)
			.put('user/edit/' + user.username)
			.send(new_user)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('edit a user that does not exist', function(){

	var new_user = {
		name : 'albert',
		old_password : user.password,
		new_password : 'abcd',
		email : 'albert@email.com'
	};

	it('returns status 404', function(done){
		chai.request(global.baseUrl)
			.put('user/edit/' + user.username)
			.send(new_user)
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});
});

describe('edit password user that exists', function(){
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

	var data = {
		new_password : 'albert',
		old_password : user.password
	};

	it('returns status 200', function(done){
		chai.request(global.baseUrl)
			.put('user/editPassword/' + user.username)
			.send(data)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('edit password user that does not exist', function(){
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

	var data = {
		new_password : 'albert',
		old_password : user.password
	};

	it('returns status 404', function(done){
		chai.request(global.baseUrl)
			.put('user/editPassword/' + user.username+'aa')
			.send(data)
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});
});

describe('edit password user that exists and wrong password', function(){
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

	var data = {
		new_password : 'albert',
		old_password : user.password+'aaa'
	};

	it('returns status 401', function(done){
		chai.request(global.baseUrl)
			.put('user/editPassword/' + user.username)
			.send(data)
			.end(function(err, res){
				chai.expect(res).to.have.status(401);
				done();
			});
	});
});

describe('edit a user that exists and email duplicated', function(){
	var user2 = {
		username : 'albertLuth',
		name : 'albert',
		password : '1234',
		email : 'albert@email.com'
	};

	before(function(done){
		chai.request(global.baseUrl)
			.post('user/add')
			.send(user)
			.end(function(err){
				done();
			});
	});

	before(function(done){
		chai.request(global.baseUrl)
			.post('user/add')
			.send(user2)
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

	after(function(done){
		chai.request(global.baseUrl)
			.delete('user/delete/' + user2.username)
			.end(function(err){
				done();
			});
	});

	var new_user = {
		name : user.name,
		old_password : user.password,
		new_password : 'abcd',
		email : user2.email
	};

	it('returns status 409', function(done){
		chai.request(global.baseUrl)
			.put('user/edit/' + user.username)
			.send(new_user)
			.end(function(err, res){
				chai.expect(res).to.have.status(409);
				done();
			});
	});
});

