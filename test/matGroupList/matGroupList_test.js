var request = require('request');
var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

require('../../config');

var project = {
	_id: "",
	name: "test-name",
	city: "test-city"
}

var material_urgent = {
	_id: "",
	name: "test-name",
	urgent: "true",
	quantity: 4
}

var material_no_urgent = {
	_id: "",
	name: "test-name",
	urgent: "false",
	quantity: 4
}

var matGroupList = {
	project_id: ""
}

before(function(done){
	chai.request(global.baseUrl)
		.post('project/add')
		.send(project)
		.end(function(err, res){
			if(err) throw err;
			project['_id'] = res.text;
			matGroupList['project_id'] = project['_id'];
			done();
		});
});
before(function(done){
	chai.request(global.baseUrl)
		.post('material/add')
		.send(material_urgent)
		.end(function(err, res){
			if(err) throw err;
			material_urgent['_id'] = res.text;
			done();
		});
});
before(function(done){
	chai.request(global.baseUrl)
		.post('material/add')
		.send(material_no_urgent)
		.end(function(err, res){
			if(err) throw err;
			material_no_urgent['_id'] = res.text;
			done();
		});
});

after(function(done){
	chai.request(global.baseUrl)
		.delete('project/delete/' + project['_id'])
		.end(function(err){
			done();
		});
});
after(function(done){
	chai.request(global.baseUrl)
		.delete('material/delete/' + material_urgent['_id'])
		.end(function(err){
			done();
		});
});
after(function(done){
	chai.request(global.baseUrl)
		.delete('material/delete/' + material_no_urgent['_id'])
		.end(function(err){
			done();
		});
});


describe('find all material Group Lists on the DB', function(){
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('matGroupList/findAllLists')
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('find all material Group Lists With ID on the DB', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('matGroupList/add')
			.send(matGroupList)
			.end(function(err, res){
				ID = res.text;
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('matGroupList/delete/' + ID)
			.end(function(err){
				done();
			});
	});
	
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('matGroupList/findAllMaterialsOfGroupWithID/' + ID)
			.end(function(err, res){
				//console.log(ID);
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('add a Material Group List', function(){
	var ID;
	after(function(done){
		chai.request(global.baseUrl)
			.delete('matGroupList/delete/' + ID)
			.end(function(err){
				done();
			});
	});
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.post('matGroupList/add')
			.send(matGroupList)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				ID = res.text;
				done();
			});
	});
});

describe('add a Material to Need List', function(){
	var material_data = {
		_id : "",
		material_id : "",
		urgent : "true"
	}; 

	before(function(done){
		chai.request(global.baseUrl)
			.post('matGroupList/add')
			.send(matGroupList)
			.end(function(err, res){
				material_data['_id'] = res.text;
				material_data['material_id'] = material_urgent['_id'];
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('matGroupList/delete/' + material_data['_id'])
			.end(function(err){
				if(err) throw err;
				done();
			});
	});

	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.put('matGroupList/addMaterialNeedList')
			.send(material_data)
			.end(function(err, res){
				if(err) done(err);
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('add a Material to Inventari', function(){
	var material_data = {
		_id : "",
		material_id : ""
	}; 

	before(function(done){
		chai.request(global.baseUrl)
			.post('matGroupList/add')
			.send(matGroupList)
			.end(function(err, res){
				material_data['_id'] = res.text;
				material_data['material_id'] = material_urgent['_id'];
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('matGroupList/delete/' + material_data['_id'])
			.end(function(err){
				done();
			});
	});

	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.put('matGroupList/addMaterialInventari')
			.send(material_data)
			.end(function(err, res){
				//console.log("id: " + material_data['_id']);
				if(err) done(err);
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('edit a Material Group List', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('matGroupList/add')
			.send(matGroupList)
			.end(function(err, res){
				ID = res.text;
				matGroupList_data['project_id'] = ID;
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('matGroupList/delete/' + ID)
			.end(function(err){
				done();
			});
	});

	var matGroupList_data = {
		project_id : ""
	}; 

	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.put('matGroupList/edit/' + ID)
			.send(matGroupList_data)
			.end(function(err, res){
				//console.log("id: " + matGroupList_data['_id']);
				//if(err) done(err);
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('delete a Material Group List', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('matGroupList/add')
			.send(matGroupList)
			.end(function(err, res){
				ID = res.text;
				done();
			});
	});
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.delete('matGroupList/delete/' + ID)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('delete a Material from Need List', function(){
	var material_data = {
		_id : "",
		material_id : "",
		urgent : "true"
	}; 

	before(function(done){
		chai.request(global.baseUrl)
			.post('matGroupList/add')
			.send(matGroupList)
			.end(function(err, res){
				material_data['_id'] = res.text;
				material_data['material_id'] = material_urgent['_id'];
				done();
			});
	});

	before(function(done){
		chai.request(global.baseUrl)
			.put('matGroupList/addMaterialNeedList')
			.send(material_data)
			.end(function(err, res){
				if(err) done(err);
				chai.expect(res).to.have.status(200);
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('matGroupList/delete/' + material_data['_id'])
			.end(function(err){
				if(err) throw err;
				done();
			});
	});

	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.put('matGroupList/deleteMaterialNeedList')
			.send(material_data)
			.end(function(err, res){
				if(err) done(err);
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});


describe('delete a Material from Inventari', function(){
	var material_data = {
		_id : "",
		material_id : ""
	}; 

	before(function(done){
		chai.request(global.baseUrl)
			.post('matGroupList/add')
			.send(matGroupList)
			.end(function(err, res){
				material_data['_id'] = res.text;
				material_data['material_id'] = material_urgent['_id'];
				done();
			});
	});

	before(function(done){
		chai.request(global.baseUrl)
			.put('matGroupList/addMaterialInventari')
			.send(material_data)
			.end(function(err, res){
				if(err) done(err);
				chai.expect(res).to.have.status(200);
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('matGroupList/delete/' + material_data['_id'])
			.end(function(err){
				if(err) throw err;
				done();
			});
	});

	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.put('matGroupList/deleteMaterialInventari')
			.send(material_data)
			.end(function(err, res){
				if(err) done(err);
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});