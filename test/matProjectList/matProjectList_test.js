var request = require('request');
var chai = require('chai');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

require('../../config');

var project = {
	_id: "",
    name: "PES",
    theme: "Software",
    description: "Programming project",
    city: "Barcelona",
    address: "c/ Jordi Girona",
    lat: "10",
    lng: "10"
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
	_id: "",
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

before(function(done){
    chai.request(global.baseUrl)
        .get('project/getMatProjectListID/'+project['_id'])
        .end(function(err, res){
            matProjectList['_id'] = res.text;
            done(err);
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
	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.get('matProjectList/findMaterialsOfProjectWithID/' + matProjectList['_id'])
			.end(function(err, res){
				//console.log(ID);
				chai.expect(res).to.have.status(200);
				done();
			});
	});
});

describe('add a Material to Need List', function(){
	var material_data = {
		material_id : "",
		urgent : "true"
	};
    before(function(done){
        material_data['material_id'] = material_urgent['_id'];
		done();
    });

	after(function(done){
		chai.request(global.baseUrl)
            .put('matProjectList/deleteMaterialNeedList/'+matProjectList['_id'])
            .send(material_data)
			.end(function(err){
				done(err);
			});
	});

	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.put('matProjectList/addMaterialNeedList/'+matProjectList['_id'])
			.send(material_data)
			.end(function(err, res){
				chai.expect(res).to.have.status(200);
				done(err);
			});
	});
});

describe('add a Material to Inventari', function(){
    var material_data = {
        material_id : ""
    };
    before(function(done){
        material_data['material_id'] = material_no_urgent['_id'];
        done();
    });

    after(function(done){
        chai.request(global.baseUrl)
            .put('matProjectList/deleteMaterialInventari/'+matProjectList['_id'])
            .send(material_data)
            .end(function(err){
                done(err);
            });
    });

	it('return status 200', function(done){
		chai.request(global.baseUrl)
			.put('matProjectList/addMaterialInventari/'+matProjectList['_id'])
			.send(material_data)
			.end(function(err, res){
				//if(err) console.log(err);
				chai.expect(res).to.have.status(200);
				done(err);
			});
	});
});

describe('delete a Material from Need List', function(){
	var material_data = {
		material_id : "",
		urgent : "true"
	};

    before(function(done){
        material_data['material_id'] = material_urgent['_id'];
        chai.request(global.baseUrl)
            .put('matProjectList/addMaterialNeedList/'+matProjectList['_id'])
            .send(material_data)
            .end(function(err){
                done(err);
            });
    });

    it('return status 200', function(done){
        chai.request(global.baseUrl)
            .put('matProjectList/deleteMaterialNeedList/'+matProjectList['_id'])
            .send(material_data)
            .end(function(err, res){
                chai.expect(res).to.have.status(200);
                done(err);
            });
    });
});


describe('delete a Material from Inventari', function(){
    var material_data = {
        material_id : ""
    };

    before(function(done){
        material_data['material_id'] = material_no_urgent['_id'];
        chai.request(global.baseUrl)
            .put('matProjectList/addMaterialInventari/'+matProjectList['_id'])
            .send(material_data)
            .end(function(err){
                done(err);
            });
    });

    it('return status 200', function(done){
        chai.request(global.baseUrl)
            .put('matProjectList/deleteMaterialInventari/'+matProjectList['_id'])
            .send(material_data)
            .end(function(err, res){
                chai.expect(res).to.have.status(200);
                done(err);
            });
    });
});