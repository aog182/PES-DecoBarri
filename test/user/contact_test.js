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

var user2 = {
	username: "piguillem",
	name: "jordi",
	password: "1234",
	email: "jordi@email.com"
}

describe('add contact', function(){

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

	var data = {
		username : user2.username
	}

	it('returns status 200',function(done){
		chai.request(global.baseUrl)
			.put('user/addContact/' + user.username)
			.send(data)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});	
});

describe('add contact to a user that does not exist', function(){

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
			.delete('user/delete/' + user2.username)
			.end(function(err){
				done();
			});
	});

	var data = {
		username : user2.username
	}

	it('returns status 404',function(done){
		chai.request(global.baseUrl)
			.put('user/addContact/' + user.username)
			.send(data)
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});	
});

describe('add contact that does not exist', function(){

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
		username : user2.username
	}

	it('returns status 404',function(done){
		chai.request(global.baseUrl)
			.put('user/addContact/' + user.username)
			.send(data)
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});	
});

describe('add yourself as a contact', function(){

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
		username : user.username
	}

	it('returns status 401',function(done){
		chai.request(global.baseUrl)
			.put('user/addContact/' + user.username)
			.send(data)
			.end(function(err, res){
				chai.expect(res).to.have.status(401);
				done();
			});
	});	
});

describe('add a repeated contact', function(){

	var data = {
		username : user2.username
	}

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

	before(function(done){
		chai.request(global.baseUrl)
			.put('user/addContact/' + user.username)
			.send(data)
			.end(function(err, res){
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

	it('returns status 401',function(done){
		chai.request(global.baseUrl)
			.put('user/addContact/' + user.username)
			.send(data)
			.end(function(err, res){
				chai.expect(res).to.have.status(401);
				done();
			});
	});	
});

describe('delete contact', function(){

	var data = {
		username : user2.username
	}

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

	before(function(done){
		chai.request(global.baseUrl)
			.put('user/addContact/' + user.username)
			.send(data)
			.end(function(err, res){
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

	it('returns status 200',function(done){
		chai.request(global.baseUrl)
			.put('user/deleteContact/' + user.username)
			.send(data)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});	
});

describe('delete contact that it is not a contact', function(){

	var data = {
		username : user2.username
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

	it('returns status 200',function(done){
		chai.request(global.baseUrl)
			.put('user/deleteContact/' + user.username)
			.send(data)
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});	
});

describe('delete contact from a user that does not exist', function(){

	var data = {
		username : user2.username
	}


	it('returns status 404',function(done){
		chai.request(global.baseUrl)
			.put('user/deleteContact/' + user.username)
			.send(data)
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});	
});