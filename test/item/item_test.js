var request = require('request');
var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

require('../../config');

var item = {
	name: "item1",
	description: "this is a test"
}

describe('find all items', function(){
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('item/findAll')
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('find Item By id', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('item/add')
			.send(item)
			.end(function(err,res){
				ID = res.text;
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('item/delete/' + ID)
			.end(function(err){
				done();
			});
	});
	
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('item/findItemByID/'+ ID)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('find Item By name', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('item/add')
			.send(item)
			.end(function(err,res){
				ID = res.text;
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('item/delete/' + ID)
			.end(function(err){
				done();
			});
	});
	
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('item/findItemByName/'+item.name)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('add item', function(){
		var ID;
	after(function(done){
		chai.request(global.baseUrl)
			.delete('item/delete/' + ID)
			.end(function(err){
				done();
			});
	});

	it('returns status 200',function(done){
		chai.request(global.baseUrl)
			.post('item/add')
			.send(item)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				ID = res.text;
				done();
			});
	});	
});

describe('add item already registered', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('item/add')
			.send(item)
			.end(function(err,res){
				ID = res.text;
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('item/delete/' + ID)
			.end(function(err){
				done();
			});
	});

	it('returns status 409',function(done){
		chai.request(global.baseUrl)
			.post('item/add')
			.send(item)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});	
});

describe('delete a item from the DB', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('item/add')
			.send(item)
			.end(function(err, res){

				ID = res.text;
				done();
			});
	});

	it('returns status 200', function(done){
		chai.request(global.baseUrl)
			.delete('item/delete/' + ID)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('delete a item that does not exist', function(){
	it('returns status 404', function(done){
		chai.request(global.baseUrl)
			.delete('item/delete/' + item._id)
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});
});

describe('edit a item that exists', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('item/add')
			.send(item)
			.end(function(err,res){

				ID = res.text;
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('item/delete/' + ID)
			.end(function(err){
				done();
			});
	});

	var new_item = {
		name : 'item2',
		description : 'test2'
	};

	it('returns status 200', function(done){
		chai.request(global.baseUrl)
			.put('item/edit/' + ID)
			.send(new_item)
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});
});

describe('edit a test that does not exist', function(){
		var ID = "aa";
	var new_item = {
		name : 'test2',
		description : "test2"
	};

	it('returns status 404', function(done){
		chai.request(global.baseUrl)
			.put('item/edit/' + ID)
			.send(new_item)
			.end(function(err, res){
				chai.expect(res).to.have.status(404);
				done();
			});
	});
});
