var jwt = require('jsonwebtoken');

module.exports = function(app){
	
	var db = require('../database/db');
	var Material = db.model('Material');

	findAllMaterials = function(req, res){
		Project.find({},function(err, materials){
			if(err)
				res.status(500).send('Internal Server Error');
			else
				return res.send(materials);
		});
	}

	//returns all the paraments of all projects
	app.get('/project/findAll', findAllMaterials);

}