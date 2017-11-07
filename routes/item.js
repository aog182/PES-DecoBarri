
module.exports = function(app){
	
	var db = require('../database/db');
	var Item = db.model('Item');

	findAllItems = function(req, res){
		Item.find({},function(err, items){
			if(err)
				res.status(500).send('Internal Server Error');
			else
				return res.send(items);
		});
	}

	findItemByID = function(req, res){
		if(!req.params._id){
			res.status(400).send('_id required');
			return;
		}

		Item.findById(req.params._id, function(err, project){
			if(err)
				res.status(500).send('Internal Server Error');
			if(!project)
				res.status(404).send('Item not found.');
			else
				res.status(200).send(item);
		});
	}

	findItemByName = function(req, res){
		if(!req.params.name){
			res.status(400).send('name required');
			return;
		}

		var regex = new RegExp(req.params.name, 'i');  // 'i' makes it case insensitive
		Item.find({name:regex}, function(err, item){
			if(err)
				res.status(500).send('Internal Server Error');
			else if (item && item.length != 0)
				res.status(200).send(item);
			else 
				res.status(404).send("Item not found");
		});
	}

	findProjectByDescription = function(req, res){
		if(!req.params.description){
			res.status(400).send('description required');
			return;
		}

		var regex = new RegExp(req.params.description, 'i');  // 'i' makes it case insensitive
		Item.find({description:regex}, function(err, item){
			if(err)
				res.status(500).send('Internal Server Error');
			else if (item && item.length != 0)
				res.status(200).send(item);
			else 
				res.status(404).send("Item not found");
		});
	}

	addItem = function(req,res){
		if(!req.body.name){
			return res.status(400).send('name required');
		}
		if(!req.body.description){
			return res.status(400).send('description required');
		}
		
		var item = new Item({
			name: req.body.name,
			description: req.body.description,
		});

		item.save(function(err){
			if(err){
				if(err.code == 11000)
					//Impossible arribar aqui, no busquem id
					res.status(409).send('Item already registered');
				else
					res.status(500).send('Internal Server Error');
			}
			else{
				res.status(200).send(item._id);
			}
		});		
	}

	editItem = function(req, res) {
		if(!req.params._id) {
			res.status(400).send('_id required');
			return;
		}
		if(!req.body.name) {
			res.status(400).send("name required");
			return;
		}
		if(!req.body.description) {
			res.status(400).send("description required");
			return;
		}

		Item.findById(req.params._id, function(err, item){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!project)
				res.status(404).send('Item not found.');
			else{
				item.name = req.body.name;
				item.description = req.body.description;
				item.save(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Item modified');
				});	
			}
		});
	}

	deleteItem = function(req, res){
		if(!req.params._id){
			res.status(400).send('_id required');
			return;
		}

		Item.findById(req.params._id, function(err, item){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!project)
				res.status(404).send('Item not found.');			
			else{
				item.remove(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Item deleted');
				});
			}
		});
	}


	//returns all the paraments of all projects
	app.get('/item/findAllItems', findAllItems);
	//returns all the paraments
	app.get('/item/findItemByID/:_id', findItemByID);
	app.get('/item/findItemByName/:name', findItemByName);
	app.get('/item/findProjectByDescription/:description', findProjectByDescription);
	app.post('/item/addItem', addItem);

	app.put('/item/editItem/:_id', editItem);

	app.delete('/item/deleteItem/:_id', deleteItem);

}