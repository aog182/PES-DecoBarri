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

var matProjectList = {
	project_id: ""
}

before(function(done){
	chai.request(global.baseUrl)
		.post('project/add')
		.send(project)
		.end(function(err, res){
			project['_id'] = res.text;
			matProjectList['project_id'] = project['_id'];
			done(err);
		});
});
before(function(done){
	chai.request(global.baseUrl)
		.post('material/add')
		.send(material_urgent)
		.end(function(err, res){
			material_urgent['_id'] = res.text;
			done();
		});
});
before(function(done){
	chai.request(global.baseUrl)
		.post('material/add')
		.send(material_no_urgent)
		.end(function(err, res){
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


describe('find all material Project Lists on the DB', function(){
    var ID;
    before(function(done){
        chai.request(global.baseUrl)
            .post('matProjectList/add')
            .send(matProjectList)
            .end(function(err, res){
                ID = res.text;
                done();
            });
    });

    after(function(done){
        chai.request(global.baseUrl)
            .delete('matProjectList/delete/' + ID)
            .end(function(err){
                done(err);
            });
    });
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('matProjectList/findAllLists')
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('find all material Project Lists With ID on the DB', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('matProjectList/add')
			.send(matProjectList)
			.end(function(err, res){
				ID = res.text;
				done();
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('matProjectList/delete/' + ID)
			.end(function(err){
				done(err);
			});
	});
	
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('matProjectList/findMaterialsOfProjectWithID/' + ID)
			.end(function(err, res){
				//console.log(ID);
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('add a Material Project List', function(){
	var ID;
	after(function(done){
		chai.request(global.baseUrl)
			.delete('matProjectList/delete/' + ID)
			.end(function(err){
				done(err);
			});
	});
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.post('matProjectList/add')
			.send(matProjectList)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				ID = res.text;
				done(err);
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
			.post('matProjectList/add')
			.send(matProjectList)
			.end(function(err, res){
				material_data['_id'] = res.text;
				material_data['material_id'] = material_urgent['_id'];
				done(err);
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('matProjectList/delete/' + material_data['_id'])
			.end(function(err){
				done(err);
			});
	});

	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.put('matProjectList/addMaterialNeedList')
			.send(material_data)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done(err);
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
			.post('matProjectList/add')
			.send(matProjectList)
			.end(function(err, res){
				material_data['_id'] = res.text;
				material_data['material_id'] = material_urgent['_id'];
				done(err);
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('matProjectList/delete/' + material_data['_id'])
			.end(function(err){
				done(err);
			});
	});

	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.put('matProjectList/addMaterialInventari')
			.send(material_data)
			.end(function(err, res){
				if(err) console.log(err);
				chai.expect(res).to.have.status(200);
				done(err);
			});
	});
});

describe('edit a Material Project List', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('matProjectList/add')
			.send(matProjectList)
			.end(function(err, res){
				ID = res.text;
				matProjectList_data['project_id'] = ID;
				done(err);
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('matProjectList/delete/' + ID)
			.end(function(err){
				done(err);
			});
	});

	var matProjectList_data = {
		project_id : ""
	};

	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.put('matProjectList/edit/' + ID)
			.send(matProjectList_data)
			.end(function(err, res){
				//console.log("id: " + matProjectList_data['_id']);
				chai.expect(res).to.have.status(200);
				done(err);
			});
	});
});

describe('delete a Material Project List', function(){
	var ID;
	before(function(done){
		chai.request(global.baseUrl)
			.post('matProjectList/add')
			.send(matProjectList)
			.end(function(err, res){
				ID = res.text;
				done(err);
			});
	});
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.delete('matProjectList/delete/' + ID)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done(err);
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
			.post('matProjectList/add')
			.send(matProjectList)
			.end(function(err, res){
				material_data['_id'] = res.text;
				material_data['material_id'] = material_urgent['_id'];
				done(err);
			});
	});

	before(function(done){
		chai.request(global.baseUrl)
			.put('matProjectList/addMaterialNeedList')
			.send(material_data)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done(err);
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('matProjectList/delete/' + material_data['_id'])
			.end(function(err){
				done(err);
			});
	});

	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.put('matProjectList/deleteMaterialNeedList')
			.send(material_data)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done(err);
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
			.post('matProjectList/add')
			.send(matProjectList)
			.end(function(err, res){
				material_data['_id'] = res.text;
				material_data['material_id'] = material_urgent['_id'];
				done(err);
			});
	});

	before(function(done){
		chai.request(global.baseUrl)
			.put('matProjectList/addMaterialInventari')
			.send(material_data)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done(err);
			});
	});

	after(function(done){
		chai.request(global.baseUrl)
			.delete('matProjectList/delete/' + material_data['_id'])
			.end(function(err){
				done(err);
			});
	});

	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.put('matProjectList/deleteMaterialInventari')
			.send(material_data)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done(err);
			});
	});
});