module.exports = function(app){

    var multer  = require('multer');
    var upload = multer({ dest: 'database/images' });

    var serviceProject = require('../services/project');
    var sendResponse = require('./sendResponse');


    var findAllProjects = function (req, res) {
        serviceProject.findAllProjects(function (err, projects) {
            sendResponse.sendRes(res, err, projects);
        });
    };

    var findProjectByID = function (req, res) {
        serviceProject.findProjectByID(req.params._id, function (err, project) {
            sendResponse.sendRes(res, err, project);
        });
    };

    var findProjectsByName = function (req, res) {
        var name = new RegExp(req.params.name, 'i');  // 'i' makes it case insensitive
        serviceProject.findProjectsByName(name, function (err, project) {
            sendResponse.sendRes(res, err, project);
        });
    };

    var findProjectsByTheme = function (req, res) {
        var theme = new RegExp(req.params.theme, 'i');  // 'i' makes it case insensitive
        serviceProject.findProjectsByTheme(theme, function (err, project) {
            sendResponse.sendRes(res, err, project);
        });
    };

    var findProjectsByDescription = function (req, res) {
        if (!req.body.description) {
            res.status(400).send('description required');
            return;
        }

        if (!req.body.elements) {
            res.status(400).send('elements required');
            return;
        }

        serviceProject.findProjectsByDescription(req.body.description,
            req.body.elements,
            function (err, project) {
                sendResponse.sendRes(res, err, project);
            });
    };

    var findProjectsByCity = function (req, res) {
        var city = new RegExp(req.params.city, 'i');  // 'i' makes it case insensitive
        serviceProject.findProjectsByCity(city, function (err, project) {
            sendResponse.sendRes(res, err, project);
        });
    };

    var findProjectsByLocation = function(req, res){
        if (!req.body.lat) {
            return res.status(400).send('lat required');
        }
        if (!req.body.lng) {
            return res.status(400).send('lng required');
        }

        serviceProject.findProjectsByLocation(req.body.lat, req.body.lng, function(err, project){
            sendResponse.sendRes(res, err, project);
        });
    };

    var addProject = function (req, res) {
        if (!req.body.name) {
            return res.status(400).send('name required');
        }
        if (!req.body.city) {
            return res.status(400).send('city required');
        }
        if (!req.body.admin) {
            return res.status(400).send('admin required');
        }
        if (!req.body.lat) {
            return res.status(400).send('lat required');
        }
        if (!req.body.lng) {
            return res.status(400).send('lng required');
        }

        serviceProject.addProject(req.body.name,
            req.body.theme,
            req.body.description,
            req.body.city,
            req.body.address, 
            req.body.lat,
            req.body.lng,
            req.body.admin,
            req.body.img, function (err, id) {
                sendResponse.sendRes(res, err, id);
            });
    };

    var getMaterialProjectListID = function (req, res) {
        serviceProject.getMaterialProjectListID(req.params._id, function(err,matProjectList_ID) {
                sendResponse.sendRes(res, err, matProjectList_ID);
        });
    };

    var editProject = function (req, res) {
        if (!req.body.name) {
            res.status(400).send("name required");
            return;
        }
        if (!req.body.city) {
            res.status(400).send("city required");
            return;
        }

        serviceProject.editProject(req.params._id,
            req.body.name,
            req.body.theme,
            req.body.description,
            req.body.city,
            req.body.address, function (err, data) {
                sendResponse.sendRes(res, err, data);
            });
    };

    var deleteProject = function (req, res) {
        serviceProject.deleteProject(req.params._id, function (err, data) {
            sendResponse.sendRes(res, err, data);
        });
    };

    var addNote = function (req, res) {
        if (!req.body.title) {
            res.status(400).send('title required');
            return;
        }
        if (!req.body.description) {
            res.status(400).send('description required');
            return;
        }
        if (!req.body.author) {
            res.status(400).send('author required');
            return;
        }
        if (!req.body.modifiable) {
            res.status(400).send('modifiable required');
            return;
        }
        if (!req.body.color) {
            res.status(400).send('color required');
            return;
        }

        serviceProject.addNote(req.params._id,
            req.body.title,
            req.body.description,
            req.body.author,
            req.body.modifiable,
            req.body.color,
            req.body.img, function (err, data) {
                sendResponse.sendRes(res, err, data);
            });
    };

    var deleteNote = function (req, res) {
        if (!req.body._id) {
            res.status(400).send('_id required');
            return;
        }

        serviceProject.deleteNote(req.params._id, req.body._id, function (err, data) {
            sendResponse.sendRes(res, err, data);
        });
    };

    var getMaterials = function(req, res){
        serviceProject.getMaterials(req.params._id, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    };

    var getNotes = function(req, res){
        serviceProject.getNotes(req.params._id, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    };

    var getMembers = function(req, res){
        serviceProject.getMembers(req.params._id, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    };

    var getItems = function(req, res){
        serviceProject.getItems(req.params._id, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    };

    var addItem = function (req, res) {
        if (!req.body.name) {
            res.status(400).send('name required');
            return;
        }
        if (!req.body.description) {
            res.status(400).send('description required');
            return;
        }

        serviceProject.addItem(req.params._id,
            req.body.name,
            req.body.description,
            req.body.img, function (err, data) {
                sendResponse.sendRes(res, err, data);
            });
    }; 

    var deleteItem = function (req, res) {
        if (!req.body._id) {
            res.status(400).send('items id required');
            return;
        }

        serviceProject.deleteItem(req.params._id, req.body._id, function (err, data) {
            sendResponse.sendRes(res, err, data);
        });
    };

    var editItem = function (req, res) {
        if (!req.body._id) {
            res.status(400).send('items id required');
            return;
        }

        serviceProject.editItem(req.params._id, req.body._id, req.body.name, req.body.description, req.body.img, function (err, data) {
            sendResponse.sendRes(res, err, data);
        });
    };

    var editImage = function(req, res){
        if (!req.body.img) {
            res.status(400).send('Image required');
            return;
        }

        serviceProject.setImage(req.body.img, req.params._id, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    }

    var getImage = function(req, res){
        serviceProject.getImage(req.params._id, function(err, data){
            sendResponse.sendRes(res, err, null, data);
        });
    }

    var editNote = function(req, res){
        if(!req.body._id){
            res.status(400).send('_id required');
            return;
        }
        if(!req.body.description){
            res.status(400).send('description required');
            return;
        }
        if(!req.body.modifiable){
            res.status(400).send('modifiable required');
            return;
        }
        if(!req.body.color){
            res.status(400).send('color required');
            return;
        }

        serviceProject.editNote(
            req.params._id,
            req.body._id,
            req.body.description, 
            req.body.modifiable,
            req.body.color,
            req.body.img, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    }

    var addRequest = function(req, res){
        if(!req.body.username){
            res.status(400).send('Username required');
            return;
        }
        serviceProject.addRequest(req.params._id, req.body.username, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    }

    var deleteRequest = function(req, res){
        if(!req.body.username){
            res.status(400).send('Username required');
            return;
        }
        serviceProject.deleteRequest(req.params._id, req.body.username, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    }

    var getRequests = function(req, res){
        serviceProject.getRequests(req.params.username, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    }

    //MATERIALS NEED LIST

    var getNeedList = function(req, res){
        serviceProject.getNeedList(req.params._id, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    }

    var addNeedListMaterial = function(req, res){
        if (!req.body.name) {
           return res.status(400).send('name required');
        }
        if (!req.body.urgent) {
            return res.status(400).send('urgent required');
        }
        if (!req.body.quantity) {
            return res.status(400).send('quantity required');
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

        serviceProject.addNeedListMaterial(
            req.params._id,
            req.body.name,
            req.body.description,
            req.body.urgent,
            req.body.quantity,
            req.body.address,
            req.body.img, function (err, id) {
                sendResponse.sendRes(res, err, id);
        });
    }

    var editNeedListMaterial = function(req, res){
        if (!req.body._id) {
           return res.status(400).send('_id required');
        }
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

        serviceProject.editNeedListMaterial(
            req.params._id,
            req.body._id,
            req.body.name,
            req.body.description,
            req.body.urgent,
            req.body.quantity,
            req.body.address,
            req.body.img, function (err, data) {
                sendResponse.sendRes(res, err, data);
        });
    }

    var deleteNeedListMaterial = function(req, res){
        if (!req.body._id) {
           return res.status(400).send('_id required');
        }
        serviceProject.deleteNeedListMaterial(req.params._id,req.body._id, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    }

    //MATERIAL INVENTORY

    var getInventory = function(req, res){
        serviceProject.getInventory(req.params._id, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    }

    var getAllNeedMaterials = function(req, res){
        serviceProject.getAllNeedMaterials(function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    }

    var addInventoryMaterial = function(req, res){
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

        serviceProject.addInventoryMaterial(
            req.params._id,
            req.body.name,
            req.body.description,
            req.body.urgent,
            req.body.quantity,
            req.body.address,
            req.body.img, function (err, id) {
                sendResponse.sendRes(res, err, id);
        });
    }

    var editInventoryMaterial = function(req, res){
        if (!req.body._id) {
           return res.status(400).send('_id required');
        }
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

        serviceProject.editInventoryMaterial(
            req.params._id,
            req.body._id,
            req.body.name,
            req.body.description,
            req.body.urgent,
            req.body.quantity,
            req.body.address,
            req.body.img, function (err, data) {
                sendResponse.sendRes(res, err, data);
        });
    }

    var deleteInventoryMaterial = function(req, res){
        if (!req.body._id) {
           return res.status(400).send('_id required');
        }
        serviceProject.deleteInventoryMaterial(req.params._id,req.body._id, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    }

    //returns all the paraments of all projects
    app.get('/project/findAll', findAllProjects);
    //returns all the paraments
    app.get('/project/findByID/:_id', findProjectByID);
    app.get('/project/findByName/:name', findProjectsByName);
    app.get('/project/findByTheme/:theme', findProjectsByTheme);
    app.post('/project/findByDescription/', findProjectsByDescription);
    app.get('/project/findByCity/:city', findProjectsByCity);
    app.post('/project/findProjectsByLocation/', findProjectsByLocation);
    app.get('/project/getMaterials/:_id', getMaterials);
    app.get('/project/getNotes/:_id', getNotes);
    app.get('/project/getMembers/:_id', getMembers);
    app.get('/project/getItems/:_id', getItems);
    app.get('/project/getImage/:_id', getImage);
    //need to pass name, username, password and email
    app.post('/project/add', addProject);
    app.get('/project/getMatProjectListID/:_id', getMaterialProjectListID);

    app.put('/project/edit/:_id', editProject);

    app.delete('/project/delete/:_id', deleteProject);
    app.post('/project/addNote/:_id', addNote);
    app.put('/project/deleteNote/:_id', deleteNote);

    app.post('/project/addItem/:_id',addItem);
    app.put('/project/deleteItem/:_id', deleteItem);
    app.put('/project/editItem/:_id', editItem);
    app.post('/project/editImage/:_id', editImage)
    app.post('/project/editNote/:_id', editNote)
    app.post('/project/addRequest/:_id', addRequest);
    app.post('/project/deleteRequest/:_id', deleteRequest);
    app.get('/project/getRequests/:username', getRequests);


    app.get('/project/getNeedList/:_id', getNeedList);
    app.post('/project/addNeedListMaterial/:_id',addNeedListMaterial)
    app.put('/project/editNeedListMaterial/:_id',editNeedListMaterial)
    app.post('/project/deleteNeedListMaterial/:_id', deleteNeedListMaterial)

    app.get('/project/getInventory/:_id', getInventory);
    app.post('/project/addInventoryMaterial/:_id', addInventoryMaterial)
    app.put('/project/editInventoryMaterial/:_id', editInventoryMaterial)
    app.post('/project/deleteInventoryMaterial/:_id', deleteInventoryMaterial)

    app.get('/project/getAllNeedMaterials', getAllNeedMaterials);
};