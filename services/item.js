var db = require('../database/db');
var Item = db.model('Item');
var mongoose = require('mongoose');

var errorMessage = require('./error');
var serviceUser = require('./user');

function findItemByParameter(parameter, callback){
	Item.find(parameter, function(err, items){
		if(err){
			var error = new errorMessage('Internal Server Error',500);
			return callback(error);
		}
		if(items.length == 0){
			var error = new errorMessage('Items not found', 404);
			return callback(error);
		}
		return callback(null, items);
	});
}

function findAllItems(callback){
	findItemByParameter({}, function(err, items){
		callback(err, items);
	});
}

function findItemByID(id, callback){
	findItemByParameter({'_id': id}, function(err, item){
		if(err)return callback(err, item);

		return callback(err, item[0]);
	});
}

function findItemByName(name, callback){
	findItemByParameter({'name':name}, function(err, items){
		callback(err, items);
	});
}

function addItem(name, description, callback){
	var item = new Item({
		_id: mongoose.Types.ObjectId(),
		name: name,
		description: description
	});

	item.save(function(err){
		if(err){
			//console.log(err);
			var error = new errorMessage('Internal Server Error',500);
			return callback(error);
		}
		callback(null, item._id);
	});
}

function deleteItem(id, callback){
	findItemByID(id, function(err, item){
		if(err)
			return callback(err);

		item.remove(function(err){
			if(err){
				var error = new errorMessage('Internal Server Error',500);
				return callback(error);
			}
			callback(null, 'Item deleted');
		});
	});
}

function editItem(id, name, description, callback){
	findItemByID(id, function(err, item){
		if(err){
			return callback(err);
		}

		item.name = name;
		item.description = description;
		item.save(function(err){
			if(err){
				var error = new errorMessage('Internal Server Error',500);
				return callback(error);
			}
			return callback(null, 'Item modified');
		});
	});
}

module.exports.findAllItems = findAllItems;
module.exports.findItemByID = findItemByID;
module.exports.findItemByName = findItemByName;
module.exports.addItem = addItem;
module.exports.deleteItem = deleteItem;
module.exports.editItem = editItem;