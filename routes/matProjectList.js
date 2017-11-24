var jwt = require('jsonwebtoken');

module.exports = function(app){
	
	var db = require('../database/db');
	var serviceProject = require('../services/project');
	var sendResponse = require('./sendResponse');
	var MatProjectList = db.model('MatProjectList');

    var findAllMatProjectList = function(req, res){
		MatProjectList.find({},function(err, matProjectList){
			if(err)
				res.status(500).send('Internal Server Error');
			else
				return res.status(200).send(matProjectList);
		});
	}

    var findMaterialsOfProjectWithID = function(req, res){
		if(!req.params._id){
			res.status(400).send('_id required');
			return;
		}

		MatProjectList.findById(req.params._id, function(err, matProjectList){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!matProjectList)
				res.status(404).send('Material Project List not found.');
			else
				res.status(200).send(matProjectList);
		});
	}

    var addMatProjectList = function(req,res){
		if(!req.body.project_id){
			return res.status(400).send('project id required');
		}
		
		var matProjectList = new MatProjectList({
			project_id: req.body.project_id
		});

		matProjectList.save(function(err){
			if(err){
                var error = new errorMessage('Internal Server Error',500);
			}
			return sendResponse.sendRes(res,error,"" + matProjectList._id);
		});
	}

	var addMaterialNeedList = function(req,res){
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

		MatProjectList.findById(req.body._id, function(err, matProjectList){
			if(err)
				res.status(500).send(err);
				//res.status(500).send('Internal Server Error');
			else if(!matProjectList)
				res.status(404).send('Material Project List not found.');
			else{
				if(req.body.urgent)
					matProjectList.urgent_need_list.push(req.body.material_id);
				else
					matProjectList.need_list.push(req.body.material_id);

				matProjectList.save(function(err){
					if(err)
						//res.status(500).send(err);
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Material Added to NeedList');
				});	
			}
		});
	}

	var addMaterialInventari = function(req,res){
		if(!req.body._id) {
			res.status(400).send('_id required');
			return;
		}
		if(!req.body.material_id) {
			res.status(400).send('material_id required');
			return;
		}

		MatProjectList.findById(req.body._id, function(err, matProjectList){
			if(err)
				res.status(500).send(err);
				//res.status(500).send('Internal Server Error');
			else if(!matProjectList)
				res.status(404).send('Material Project List not found.');
			else{
				matProjectList.inventari.push(req.body.material_id);

				matProjectList.save(function(err){
					if(err)
						//res.status(500).send(err);
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Material Added to Inventari');
				});	
			}
		});
	}

	var editMatProjectList = function(req, res) {
		if(!req.params._id) {
			res.status(400).send('_id required');
			return;
		}
		if(!req.body.project_id) {
			res.status(400).send("name required");
			return;
		}

		MatProjectList.findById(req.params._id, function(err, matProjectList){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!matProjectList)
				res.status(404).send('Material Project List not found.');
			else{
				matProjectList.project_id = req.body.project_id;
				matProjectList.save(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Material Project List modified');
				});	
			}
		});
	}

	var deleteMatProjectList = function(req, res){
		if(!req.params._id){
			res.status(400).send('_id required');
			return;
		}

		MatProjectList.findById(req.params._id, function(err, matProjectList){
			matProjectList.remove(function(err){
				if(err)
					var error = new errorMessage('Internal Server Error',500);
				else {
					res.status(200).send("Material Project List Deleted");
				}
                return sendResponse.sendRes(res,error);
			});
		});
	}

	var deleteAllMaterialProjectLists = function(req,res){
        if(req.params.sure !== "true") {
			//return res.status(400).send(req.params.sure);
			return res.status(400).send('You sure? You must say true');
			
		}

		MatProjectList.remove(function(err){
			if(err)
				res.status(500).send('Internal Server Error');		
			else{
				res.status(200).send('Material Project List deleted');
			}
		});

	}

	var deleteMaterialNeedList = function(req,res){
		if(!req.body._id) {
			//res.status(400).send(req.body._id);
			res.status(400).send('_id required');
			return;
		}
		if(!req.body.material_id) {
			res.status(400).send('material_id required');
			return;
		}

		MatProjectList.findById(req.body._id, function(err, matProjectList){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!matProjectList)
				res.status(404).send('Material Project List not found.');
			else{
				matProjectList.urgent_need_list.pull(req.body.material_id);
				matProjectList.need_list.pull(req.body.material_id);

				matProjectList.save(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Material Deleted from NeedList');
				});	
			}
		});
	}


	var deleteMaterialInventari = function(req,res){
		if(!req.body._id) {
			res.status(400).send('_id required');
			return;
		}
		if(!req.body.material_id) {
			res.status(400).send('material_id required');
			return;
		}

		MatProjectList.findById(req.body._id, function(err, matProjectList){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!matProjectList)
				res.status(404).send('Material Project List not found.');
			else{
				matProjectList.inventari.pull(req.body.material_id);

				matProjectList.save(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Material Deleted from Inventari');
				});	
			}
		});
	}

	app.get('/matProjectList/findAllLists', findAllMatProjectList);

	app.get('/matProjectList/findMaterialsOfProjectWithID/:_id', findMaterialsOfProjectWithID);

	app.post('/matProjectList/add', addMatProjectList);

	app.put('/matProjectList/addMaterialNeedList', addMaterialNeedList);

	app.put('/matProjectList/addMaterialInventari', addMaterialInventari);

	app.put('/matProjectList/edit/:_id', editMatProjectList);

	app.delete('/matProjectList/delete/:_id', deleteMatProjectList);

	app.delete('/matProjectList/deleteAll/:sure', deleteAllMaterialProjectLists);

	app.put('/matProjectList/deleteMaterialNeedList', deleteMaterialNeedList);

	app.put('/matProjectList/deleteMaterialInventari', deleteMaterialInventari);

}