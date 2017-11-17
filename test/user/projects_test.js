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

var project = {
	name: "SOAD",
	theme: "software",
	description: "Sistemes Operatius per Aplicacions Distribuides",
	city: "Barcelona",
	address: "c/ Jordi Girona"
}

describe('add a project to a user', function(){
	var data = {
		project_id: null
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
			.post('project/add')
			.send(project)
			.end(function(err, res){
				data.project_id = res.text;
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
			.delete('project/delete/' + data.project_id)
			.end(function(err){
				done();
			});
	});;

	it('returns status 200',function(done){
		chai.request(global.baseUrl)
			.put('user/addProject/' + user.username)
			.send(data)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});	
});

describe('add a repeated project to a user', function(){
	var data = {
		project_id: null
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
			.post('project/add')
			.send(project)
			.end(function(err, res){
				data.project_id = res.text;
				done();
			});
	});

	before(function(done){
		chai.request(global.baseUrl)
			.put('user/addProject/' + user.username)
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
			.delete('project/delete/' + data.project_id)
			.end(function(err){
				done();
			});
	});

	it('returns status 401',function(done){
		chai.request(global.baseUrl)
			.put('user/addProject/' + user.username)
			.send(data)
			.end(function(err, res){
				chai.expect(res).to.have.status(401);
				done();
			});
	});	
});

describe('add a project that does not exist to a user', function(){
	var data = {
		project_id:123
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

	it('returns status 404',function(done){
		chai.request(global.baseUrl)
			.put('user/addProject/' + user.username)
			.send(data)
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});	
});

describe('delete a project to a user', function(){
	var data = {
		project_id: null
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
			.post('project/add')
			.send(project)
			.end(function(err, res){
				data.project_id = res.text;
				done();
			});
	});

	before(function(done){
		chai.request(global.baseUrl)
			.put('user/addProject/' + user.username)
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

	it('returns status 200',function(done){
		chai.request(global.baseUrl)
			.put('user/deleteProject/' + user.username)
			.send(data)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});	
});

describe('delete a project that does not exist to a user', function(){
	var data = {
		project_id: 123
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

	it('returns status 404',function(done){
		chai.request(global.baseUrl)
			.put('user/deleteProject/' + user.username)
			.send(data)
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});	
});