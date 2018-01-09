var multer  = require('multer');
var upload = multer({ dest: 'database/images' });

var serviceMaterial = require('../services/material');
var sendResponse = require('./sendResponse');

module.exports = function(app){

	var findAllMaterials = function(req, res){
		serviceMaterial.findAllMaterials(function (err, material) {
            sendResponse.sendRes(res, err, material);
        });
	};

    var findMaterialByID = function (req, res) {
        serviceMaterial.findMaterialByID(req.params._id, function (err, material) {
            sendResponse.sendRes(res, err, material);
        });
    };

    var findMaterialsByName = function (req, res) {
        var name = new RegExp(req.params.name, 'i');  // 'i' makes it case insensitive
        serviceMaterial.findMaterialsByName(name, function (err, material) {
            sendResponse.sendRes(res, err, material);
        });
    };
    var addMaterial = function (req, res) {findAllMaterials
        if (!req.body.name) {
            return res.status(400).send('name required');
        }
        if (!req.body.urgent) {
            return res.status(400).send('urgent required');
        }
        if (!req.body.quantity) {
            return res.status(400).send('urgent required');
        }
        if (!Boolean(req.body.urgent)) {
            return res.status(401).send("urgent must be a boolean");
        }
        if (!Number(req.body.quantity)) {
            return res.status(401).send("quantity must be a number");
        }
        if (req.body.quantity < 0) {
            return res.status(401).send("quantity must be a number over 0");
        }

        serviceMaterial.addMaterial(req.body.name,
            req.body.description,
            req.body.urgent,
            req.body.quantity,
            req.body.address,
            req.file, function (err, id) {
                sendResponse.sendRes(res, err, id);
            });
    };

	var editMaterial = function(req, res) {
		if(!req.params._id) {
			res.status(400).send('_id required');
			return;
		}
		else if(!req.body.name) {
			res.status(400).send("name required");
			return;
		}
		else if(!req.body.urgent) {
			res.status(400).send("urgent required");
			return;
		}
		else if (!Boolean(req.body.urgent)) {
			res.status(401).send("urgent must be a boolean");
			return;
		}
		else if(!req.body.quantity) {
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

        serviceMaterial.editMaterial(req.params._id,req.body.name,
            req.body.description,
            req.body.urgent,
            req.body.quantity,
            req.body.address,
            req.file, function (err, data) {
                sendResponse.sendRes(res, err, data);
            });
	};

	var deleteMaterial = function(req, res){
        serviceMaterial.deleteMaterial(req.params._id, function (err, data) {
            sendResponse.sendRes(res, err, data);
        });
	};

	app.get('/material/findAll', findAllMaterials);

	app.get('/material/findMaterialByID', findMaterialByID);

	app.get('/material/findMaterialsByName', findMaterialsByName);

	app.post('/material/add', upload.single('image'), addMaterial);

	app.put('/material/edit/:_id', upload.single('image'), editMaterial);

	app.delete('/material/delete/:_id', deleteMaterial);

}