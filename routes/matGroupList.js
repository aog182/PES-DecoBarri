var jwt = require('jsonwebtoken');

module.exports = function(app){
	
	var db = require('../database/db');
	var MatGroupList = db.model('MatGroupList');

	findAllMatGroupList = function(req, res){
		MatGroupList.find({},function(err, matGroupList){
			if(err)
				res.status(500).send('Internal Server Error');
			else
				return res.status(200).send(matGroupList);
		});
	}

	findAllMaterialsOfGroupwhithID = function(req, res){
		if(!req.params._id){
			res.status(400).send('_id required');
			return;
		}

		MatGroupList.findById(req.params._id, function(err, matGroupList){
			if(err)
				res.status(500).send('Internal Server Error');
			if(!matGroupList)
				res.status(404).send('Material Group List not found.');
			else
				res.status(200).send(matGroupList);
		});
	}

	addMatGroupList = function(req,res){
		if(!req.body.project_id){
			return res.status(400).send('project id required');
		}
		
		var matGroupList = new MatGroupList({
			project_id: req.body.project_id
		});

		matGroupList.save(function(err){
			if(err){
				if(err.code == 11000)
					//Impossible arribar aqui, no busquem id
					res.status(409).send('Material Group List already registered');
				else
					//res.status(500).send(err.message);
					res.status(500).send('Internal Server Error');
			}
			else{
				res.status(200).send(matGroupList._id);
			}
		});		
	}

	addMaterialNeedList = function(req,res){
		if(!req.body._id) {
			res.status(400).send('_id required');
			return;
		}
		if(!req.body.material_id) {
			res.status(400).send('material_id required');
			return;
		}
		if(!req.body.urgent) {
			res.status(400).send('urgent param required');
			return;
		}

		MatGroupList.findById(req.body._id, function(err, matGroupList){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!matGroupList)
				res.status(404).send('Material Group List not found.');
			else{
				switch(req.body.urgent) {
					case "True":
					case "true":
					case "1":
					case "T":
					case "t":
						matGroupList.urgent_need_list.push(req.body.material_id);
						break;
					case "False":
					case "false":
					case "0":
					case "F":
					case "f":
						matGroupList.need_list.push(req.body.material_id);
						break;
					default:
						res.status(403).send('urgent has to be true or false');
						return;
				}

				matGroupList.save(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Material Added to NeedList');
				});	
			}
		});
	}

	addMaterialInventari = function(req,res){
		if(!req.body._id) {
			res.status(400).send('_id required');
			return;
		}
		if(!req.body.material_id) {
			res.status(400).send('material_id required');
			return;
		}

		MatGroupList.findById(req.body._id, function(err, matGroupList){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!matGroupList)
				res.status(404).send('Material Group List not found.');
			else{
				matGroupList.inventari.push(req.body.material_id);	

				matGroupList.save(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Material Added to Inventari');
				});	
			}
		});
	}

	editMatGroupList = function(req, res) {
		if(!req.params._id) {
			res.status(400).send('_id required');
			return;
		}
		if(!req.body.project_id) {
			res.status(400).send("name required");
			return;
		}

		MatGroupList.findById(req.params._id, function(err, matGroupList){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!matGroupList)
				res.status(404).send('Material Group List not found.');
			else{
				matGroupList.project_id = req.body.project_id;
				matGroupList.save(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Material Group List modified');
				});	
			}
		});
	}

	deleteMatGroupList = function(req, res){
		if(!req.params._id){
			res.status(400).send('_id required');
			return;
		}

		MatGroupList.findById(req.params._id, function(err, matGroupList){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!matGroupList)
				res.status(404).send('Material Group List not found.');			
			else{
				matGroupList.remove(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Material Group List deleted');
				});
			}
		});
	}

	deleteMaterialNeedList = function(req,res){
		if(!req.body._id) {
			res.status(400).send(req.body._id);
			//res.status(400).send('_id required');
			return;
		}
		if(!req.body.material_id) {
			res.status(400).send('material_id required');
			return;
		}

		MatGroupList.findById(req.body._id, function(err, matGroupList){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!matGroupList)
				res.status(404).send('Material Group List not found.');
			else{
				matGroupList.urgent_need_list.pull(req.body.material_id);	
				matGroupList.need_list.pull(req.body.material_id);	

				matGroupList.save(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Material Deleted from NeedList');
				});	
			}
		});
	}

	deleteMaterialInventari = function(req,res){
		if(!req.body._id) {
			res.status(400).send('_id required');
			return;
		}
		if(!req.body.material_id) {
			res.status(400).send('material_id required');
			return;
		}

		MatGroupList.findById(req.body._id, function(err, matGroupList){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!matGroupList)
				res.status(404).send('Material Group List not found.');
			else{
				matGroupList.inventari.pull(req.body.material_id);	

				matGroupList.save(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Material Deleted from Inventari');
				});	
			}
		});
	}


	app.get('/matGroupList/findAllLists', findAllMatGroupList);

	app.get('/matGroupList/findAllMaterialsOfGroupWithID/:_id', findAllMaterialsOfGroupwhithID);

	app.post('/matGroupList/add', addMatGroupList);

	app.put('/matGroupList/addMaterialNeedList', addMaterialNeedList);

	app.put('/matGroupList/addMaterialInventari', addMaterialInventari);

	app.put('/matGroupList/edit/:_id', editMatGroupList);

	app.delete('/matGroupList/delete/:_id', deleteMatGroupList);

	app.put('/matGroupList/deleteMaterialNeedList', deleteMaterialNeedList);

	app.put('/matGroupList/deleteMaterialInventari', deleteMaterialInventari);

}