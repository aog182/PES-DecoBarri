module.exports = function(app){	

	var serviceItem = require('../services/item');
	var sendResponse = require('./sendResponse');

	findAllItems = function(req, res){
		serviceItem.findAllItems(function(err, items){
			sendResponse.sendRes(res, err, items);
		});
	}

	findItemByID = function(req, res){
		serviceItem.findItemByID(req.params._id, function(err, item){
			sendResponse.sendRes(res, err, item);
		});
	}

	findItemByName = function(req, res){
		var name = new RegExp(req.params.name, 'i');  // 'i' makes it case insensitive
		serviceItem.findItemByName(name, function(err, item){
			sendResponse.sendRes(res, err, item);
		});
	}

	addItem = function(req,res){
		if(!req.body.name){
			return res.status(400).send('name required');
		}

		serviceItem.addItem(	req.body.name,
								req.body.description, function(err, id){
										sendResponse.sendRes(res, err, id);
		});			
	}

	editItem = function(req, res) {
		if(!req.body.name){
			return res.status(400).send('name required');
		}

		serviceItem.editItem(req.body._id,
								req.body.name,
								req.body.description, function(err, data){
									sendResponse.sendRes(res, err, data);
		});
	}

	deleteItem = function(req, res){
		serviceItem.deleteItem(req.params._id, function(err, data){
			sendResponse.sendRes(res, err, data);
		});
	}


	app.get('/item/findAll', findAllItems);
	app.get('/item/findItemByID/:_id', findItemByID);
	app.get('/item/findItemByName/:name', findItemByName);
	app.post('/item/add/', addItem);

	app.put('/item/edit/:_id', editItem);

	app.delete('/item/delete/:_id', deleteItem);

}