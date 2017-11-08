var request = require('request');
var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

require('../config');

var user = {
	username: "xavi",
	name: "xavier",
	password: "1234",
	email: "xavi@email.com"
}

describe('find all users on the DB', function(){
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('user/findAll')
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('find users by name', function(){
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
	
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('user/findByName/'+user.name)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('add user', function(){

	after(function(done){
		chai.request(global.baseUrl)
			.delete('user/delete/' + user.username)
			.end(function(err){
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

describe('delete a user from the DB', function(){
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
				chai.expect(res).to.have.status(404);
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
				chai.expect(res.body._id).to.equal(user.username);
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

describe('login succed', function(){
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




//FALTA: addProject, borrar project, showprojects






