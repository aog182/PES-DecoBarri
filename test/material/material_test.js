var request = require('request');
var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

require('../../config');

describe('find all materials on the DB', function(){
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('material/findAll')
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('add a Material', function(){
	var material = {
		_id: "",
		name: "test-name",
		urgent: "true",
		quantity: 5
	}
	after(function(done){
		chai.request(global.baseUrl)
			.delete('material/delete/' + material['_id'])
			.end(function(err){
				done();
			});
	});
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.post('material/add')
			.send(material)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				material['_id'] = res.text;
				done();
			});
	});
});

describe('edit a Material', function(){
	var material = {
		_id: "",
		name: "test-name-diff",
		urgent: "true",
		quantity: 5
	};
	before(function(done){
		chai.request(global.baseUrl)
			.post('material/add')
			.send(material)
			.end(function(err, res){
				material['_id'] = res.text;
				done(err);
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('material/delete/' + material['_id'])
			.end(function(err){
				done(err);
			});
	});

	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.put('material/edit/' + material['_id'])
			.send(material)
			.end(function(err, res){
				//console.log("id: " + material_data['_id']);
				//if(err) done(err);
				chai.expect(res).to.have.status(200);
				done(err);
			});
	});
});

describe('delete a Material Group List', function(){
	var material = {
		_id: "",
		name: "test-name",
		urgent: "true",
		quantity: 5
	};
	before(function(done){
		chai.request(global.baseUrl)
			.post('material/add')
			.send(material)
			.end(function(err, res){
				material['_id'] = res.text;
				done(err);
			});
	});
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.delete('material/delete/' + material['_id'])
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done(err);
			});
	});
});