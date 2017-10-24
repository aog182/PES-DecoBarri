var jwt = require('jsonwebtoken');

module.exports = function(app){
	
	var db = require('../database/db');
	var Material = db.model('Material');

	findAllMaterials = function(req, res){
		Material.find({},function(err, materials){
			if(err)
				res.status(500).send('Internal Server Error');
			else
				return res.status(200).send(materials);
		});
	}

	//returns all the paraments of all projects
	app.get('/material/findAll', findAllMaterials);
}