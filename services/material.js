var db = require('../database/db');
var Material = db.model('Material');
var mongoose = require('mongoose');
var path = require('path')
var fs = require('fs')

var errorMessage = require('./error');

function findMaterialByParameter(parameter, callback){
    var error;
    Material.find(parameter, function(err, material){
        if(err){
            error = new errorMessage('Internal Server Error',500);
            return callback(error);
        }
        if(material.length === 0){
            error = new errorMessage('Materials not found', 404);
            return callback(error);
        }
        return callback(null, material);
    });
}

function findAllMaterials(callback){
    findMaterialByParameter({}, function(err, materials){
        return callback(err, materials);
    });
}

function findMaterialByID(id, callback){
    findMaterialByParameter({'_id': id}, function(err, material){
        if (err) return callback(err, material);
        return callback(err, material[0]);
    });
}

function findMaterialsByName(name, callback){
    findMaterialByParameter({'name':name}, function(err, material){
        callback(err, material);
    });
}

function addMaterial(name, description, urgent, quantity, address, image, callback){
    var material = new Material({
        _id: mongoose.Types.ObjectId(),
        name: name,
        description: description,
        urgent: urgent,
        quantity: quantity,
        address: address
    });

    if(image)
        image.img = fs.readFileSync(image.path);

    material.save(function(err){
        if(err){
            var error = new errorMessage('Internal Server Error',500);
            return callback(error);
        }
        callback(null, material._id);
    });
}

function editMaterial(id, name, theme, description, city, address, image, callback){
    findMaterialByID(id, function(err, material) {
        if (err) {
            return callback(err);
        }
        else {
            material.name = name;
            material.theme = theme;
            material.description = description;
            material.city = city;
            material.address = address;
            if(image)
                image.img = fs.readFileSync(image.path);
            material.save(function (err) {
                if (err) {
                    var error = new errorMessage('Internal Server Error', 500);
                    return callback(error, null);
                }
                else
                    return callback(null, 'Material modified');
            })
        }
    })
}

function deleteMaterial(id, callback){
    findMaterialByID(id, function(err, material){
        //if(err)
            //return callback(err);

        material.remove(function(err){
            if(err){
                var error = new errorMessage('Internal Server Error',500);
                return callback(error);
            }
            return callback(null, 'Material deleted');
        })
    })
}

module.exports.findMaterialByParameter = findMaterialByParameter;
module.exports.findAllMaterials = findAllMaterials;
module.exports.findMaterialByID = findMaterialByID;
module.exports.findMaterialsByName = findMaterialsByName;
module.exports.addMaterial = addMaterial;
module.exports.editMaterial = editMaterial;
module.exports.deleteMaterial = deleteMaterial;
