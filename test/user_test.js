var request = require('request');
var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var baseUrl = 'http://localhost:5000/'


var user = {
	_id: "xavi",
	name: "xavier",
	password: "1234",
	email: "xavi@email.com"
}

describe('find all users on the DB', function(){
	it('return status 200', function(done){
		chai.request(baseUrl)
			.get('user/findAll')
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('add user', function(){

	after(function(done){
		chai.request(baseUrl)
			.delete('user/delete/' + user._id)
			.end(function(err){
				done();
			});
	});

	it('returns status 200',function(done){
		chai.request(baseUrl)
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
		chai.request(baseUrl)
			.post('user/add')
			.send(user)
			.end(function(err){
				done();
			});
	});

	after(function(done){
		chai.request(baseUrl)
			.delete('user/delete/' + user._id)
			.end(function(err){
				done();
			});
	});

	it('returns status 409',function(done){
		chai.request(baseUrl)
			.post('user/add')
			.send(user)
			.end(function(err, res){
				chai.expect(res).to.have.status(409);
				done();
			});
	});	
});

describe('delete a user from the DB', function(){
	before(function(done){
		chai.request(baseUrl)
			.post('user/add')
			.send(user)
			.end(function(err, res){
				done();
			});
	});

	it('returns status 200', function(done){
		chai.request(baseUrl)
			.delete('user/delete/' + user._id)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('delete a user that does not exist', function(){

	it('returns status 404', function(done){
		chai.request(baseUrl)
			.delete('user/delete/' + user._id)
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});
});

describe('get a user by the _id', function(){
	before(function(done){
		chai.request(baseUrl)
			.post('user/add')
			.send(user)
			.end(function(err, res){
				done();
			});
	});

	after(function(done){
		chai.request(baseUrl)
			.delete('user/delete/' + user._id)
			.end(function(err, res){
				done();
			});
	});

	it('return status 200 and all paraments except the password and __v', function(done){
		chai.request(baseUrl)
			.get('user/findByID/' + user._id)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				chai.expect(res.body._id).to.equal(user._id);
				chai.expect(res.body.name).to.equal(user.name);
				chai.expect(res.body.email).to.equal(user.email);
				chai.expect(res.body).to.not.have.property('password');
				chai.expect(res.body).to.not.have.property('__v');
				done();
			});
	});
});

describe('get a user by the _id, user does not exist', function(){

	it('return status 404', function(done){
		chai.request(baseUrl)
			.get('user/findByID/' + user._id)
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});
});


describe('login succed', function(){
	before(function(done){
		chai.request(baseUrl)
			.post('user/add')
			.send(user)
			.end(function(err){
				done();
			});
	});

	after(function(done){
		chai.request(baseUrl)
			.delete('user/delete/' + user._id)
			.end(function(err){
				done();
			});
	});

	let user_login = {
		_id: user._id,
		password: user.password
	};

	it('returns status 200',function(done){
		chai.request(baseUrl)
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
		chai.request(baseUrl)
			.post('user/add')
			.send(user)
			.end(function(err){
				done();
			});
	});

	after(function(done){
		chai.request(baseUrl)
			.delete('user/delete/' + user._id)
			.end(function(err){
				done();
			});
	});

	let user_login = {
		_id: user._id,
		password: user.password + 'a'
	};

	it('returns status 401',function(done){
		chai.request(baseUrl)
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
		chai.request(baseUrl)
			.post('user/add')
			.send(user)
			.end(function(err){
				done();
			});
	});

	after(function(done){
		chai.request(baseUrl)
			.delete('user/delete/' + user._id)
			.end(function(err){
				done();
			});
	});

	let user_login = {
		_id: user._id+'2',
		password: user.password
	};

	it('returns status 404',function(done){
		chai.request(baseUrl)
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
		chai.request(baseUrl)
			.post('user/add')
			.send(user)
			.end(function(err){
				done();
			});
	});

	after(function(done){
		chai.request(baseUrl)
			.delete('user/delete/' + user._id)
			.end(function(err){
				done();
			});
	});

	var new_user = {
		_id : user._id,
		name : 'albert',
		password : 'abcd',
		email : 'albert@email.com'
	};

	it('returns status 200', function(done){
		chai.request(baseUrl)
			.put('user/edit/' + user._id)
			.send(new_user)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('edit a user that does not exist', function(){

	var new_user = {
		_id : user._id,
		name : 'albert',
		password : 'abcd',
		email : 'albert@email.com'
	};

	it('returns status 404', function(done){
		chai.request(baseUrl)
			.put('user/edit/' + user._id)
			.send(new_user)
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});
});







