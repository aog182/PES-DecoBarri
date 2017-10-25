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

	addMaterial = function(req,res){
		if(!req.body.name){
			return res.status(400).send('name required');
		}
		if(!req.body.urgent){
			return res.status(400).send('urgent required');
		}
		
		var material = new Material({
			name: req.body.name,
			description: req.body.description,
			urgent: req.body.urgent,
			quantity: req.body.quantity,
			address: req.body.address
		});

		material.save(function(err){
			if(err){
				if(err.code == 11000)
					res.status(409).send('Material already registered');
				else
					res.status(500).send(err.message);
					//res.status(500).send('Internal Server Error');
			}
			else{
				res.status(200).send(material._id);
			}
		});		
	}

	app.get('/material/findAll', findAllMaterials);

	app.post('/material/add', addMaterial);

}