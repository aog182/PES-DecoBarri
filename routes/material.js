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
					//Impossible arribar aqui, no busquem id
					res.status(409).send('Material already registered');
				else
					//res.status(500).send(err.message);
					res.status(500).send('Internal Server Error');
			}
			else{
				res.status(200).send(material._id);
			}
		});		
	}

	editMaterial = function(req, res) {
		if(!req.params._id) {
			res.status(400).send('_id required');
			return;
		}
		if(!req.body.name) {
			res.status(400).send("name required");
			return;
		}
		if(!req.body.urgent) {
			res.status(400).send("urgent required");
			return;
		}
		else if (!Boolean(req.body.urgent)) {
			res.status(401).send("urgent must be a boolean");
			return;
		}
		if(!req.body.quantity) {
			res.status(400).send("quantity required");
			return;
		}
		else if (!Number(req.body.quantity)) {
			res.status(401).send("quantity must be a number");
			return;
		}
		else if (req.body.quantity < 0) {
			res.status(401).send("quantity must be a number over 0");
			return;
		}


		Material.findById(req.params._id, function(err, material){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!material)
				res.status(404).send('Material not found.');
			else{
				material.name = req.body.name;
				material.description = req.body.description;
				material.urgent = req.body.urgent;
				material.quantity = req.body.quantity;
				material.address = req.body.address;
				material.save(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Material modified');
				});	
			}
		});
	}

	deleteMaterial = function(req, res){
		if(!req.params._id){
			res.status(400).send('_id required');
			return;
		}

		Material.findById(req.params._id, function(err, material){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!material)
				res.status(404).send('Material not found.');			
			else{
				material.remove(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Material deleted');
				});
			}
		});
	}

	app.get('/material/findAll', findAllMaterials);

	app.post('/material/add', addMaterial);

	app.put('/material/edit/:_id', editMaterial);

	app.delete('/material/delete/:_id', deleteMaterial);

}