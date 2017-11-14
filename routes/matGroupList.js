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
			else if(!matGroupList)
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
				res.status(200).send(""+matGroupList._id);
			}
		});		
	}

	addMaterialNeedList = function(req,res){
		if(!req.body._id) {
			res.status(400).send('_id required');
			return;
		}
		if(!req.body.material_id) {
			res.status(401).send('material_id required');
			return;
		}
		if(!req.body.urgent) {
			res.status(402).send('urgent param required');
			return;
		}

		MatGroupList.findById(req.body._id, function(err, matGroupList){
			if(err)
				res.status(500).send(err);
				//res.status(500).send('Internal Server Error');
			else if(!matGroupList)
				res.status(404).send('Material Group List not found.');
			else{
				if(req.body.urgent)
					matGroupList.urgent_need_list.push(req.body.material_id);
				else
					matGroupList.need_list.push(req.body.material_id);

				matGroupList.save(function(err){
					if(err)
						//res.status(500).send(err);
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
				res.status(500).send(err);
				//res.status(500).send('Internal Server Error');
			else if(!matGroupList)
				res.status(404).send('Material Group List not found.');
			else{
				matGroupList.inventari.push(req.body.material_id);	

				matGroupList.save(function(err){
					if(err)
						//res.status(500).send(err);
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
				res.status(500).send(err);
				//res.status(500).send('Internal Server Error');
			else if(!matGroupList)
				res.status(404).send('Material Group List not found.');			
			else{
				matGroupList.remove(function(err){
					if(err)
						//res.status(500).send(err);
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Material Group List deleted');
				});
			}
		});
	}

	deleteAllMaterialGroupLists = function(req,res){
		if(req.params.sure != "true") {
			//return res.status(400).send(req.params.sure);
			return res.status(400).send('You sure? You must say true');
			
		}

		MatGroupList.remove(function(err, matGroupList){
			if(err)
				res.status(500).send('Internal Server Error');		
			else{
				res.status(200).send('Material Group List deleted');
			}
		});

	}

	deleteMaterialNeedList = function(req,res){
		if(!req.body._id) {
			//res.status(400).send(req.body._id);
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

	app.delete('/matGroupList/deleteAll/:sure', deleteAllMaterialGroupLists);

	app.put('/matGroupList/deleteMaterialNeedList', deleteMaterialNeedList);

	app.put('/matGroupList/deleteMaterialInventari', deleteMaterialInventari);

}