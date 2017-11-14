var request = require('request');
var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

require('../../config');

var project = {
	name: "PES",
	theme: "Software",
	description: "Programming project",
	city: "Barcelona",
	address: "c/ Jordi Girona"
}

describe('find all projects on the DB', function(){
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('project/findAll')
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('add a project', function(){
	var ID;
	after(function(done){
		chai.request(global.baseUrl)
			.delete('project/delete/' + ID)
			.end(function(err){
				done();
			});
	});
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.post('project/add')
			.send(project)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				ID = res.text;
				done();
			});
	});
});


describe('delete a project', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('project/add')
			.send(project)
			.end(function(err, res){
				ID = res.text;
				done();
			});
	});
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.delete('project/delete/' + ID)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('delete a project that does not exist', function(){
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.delete('project/add/' + 'ID')
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});
});

describe('find project by id', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('project/add')
			.send(project)
			.end(function(err, res){
				ID = res.text;
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('project/delete/' + ID)
			.end(function(err){
				done();
			});
	});
	
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('project/findByID/'+ID)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('find project by name', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('project/add')
			.send(project)
			.end(function(err, res){
				ID = res.text;
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('project/delete/' + ID)
			.end(function(err){
				done();
			});
	});
	
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('project/findByName/'+project.name)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				chai.expect(res.text.length).to.be.above(0);
				done();
			});
	});
});

describe('find project by theme', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('project/add')
			.send(project)
			.end(function(err, res){
				ID = res.text;
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('project/delete/' + ID)
			.end(function(err){
				done();
			});
	});
	
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('project/findByName/'+project.name)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				chai.expect(res.text.length).to.be.above(0);
				done();
			});
	});
});

describe('find project by description', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('project/add')
			.send(project)
			.end(function(err, res){
				ID = res.text;
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('project/delete/' + ID)
			.end(function(err){
				done();
			});
	});
	
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('project/findByDescription/'+project.description)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				chai.expect(res.text.length).to.be.above(0);
				done();
			});
	});
});

describe('find project by city', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('project/add')
			.send(project)
			.end(function(err, res){
				ID = res.text;
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('project/delete/' + ID)
			.end(function(err){
				done();
			});
	});
	
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('project/findByDescription/'+project.description)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				chai.expect(res.text.length).to.be.above(0);
				done();
			});
	});
});
