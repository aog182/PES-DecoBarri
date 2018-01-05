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
        if (!req.body.username) {
            return res.status(400).send('username required');
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
            req.body.username,
            req.file, function (err, id) {
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
            req.file, function (err, data) {
                sendResponse.sendRes(res, err, data);
            });
    };

    var deleteNote = function (req, res) {
        if (!req.body.note_id) {
            res.status(400).send('note_id required');
            return;
        }

        serviceProject.deleteNote(req.params._id, req.body.note_id, function (err, data) {
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
            req.body.description, function (err, data) {
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

        serviceProject.editItem(req.params._id, req.body._id, req.body.name, req.body.description, function (err, data) {
            sendResponse.sendRes(res, err, data);
        });
    };

    var editImage = function(req, res){
        if (!req.file) {
            res.status(400).send('Image required');
            return;
        }

        serviceProject.setImage(req.file, req.params._id, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    }

    var getImage = function(req, res){
        serviceProject.getImage(req.params._id, function(err, data){
            sendResponse.sendRes(res, err, null, data);
        });
    }

    var editNote = function(req, res){
        if(!req.body.note_id){
            res.status(400).send('note_id required');
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
            req.body.note_id,
            req.body.description, 
            req.body.modifiable,
            req.body.color,
            req.file, function(err, data){
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
        serviceProject.getRequests(req.params._id, function(err, data){
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
	app.post('/project/add', upload.single('image'), addProject);
	app.get('/project/getMatProjectListID/:_id', getMaterialProjectListID);

	app.put('/project/edit/:_id', editProject);

	app.delete('/project/delete/:_id', deleteProject);
	app.post('/project/addNote/:_id', upload.single('image'),addNote);
	app.put('/project/deleteNote/:_id', deleteNote);

    app.post('/project/addItem/:_id', addItem);
    app.put('/project/deleteItem/:_id', deleteItem);
    app.put('/project/editItem/:_id', editItem);
    app.post('/project/editImage/:_id',upload.single('image'), editImage)
    app.post('/project/editNote/:_id',upload.single('image'), editNote)
    app.post('/project/addRequest/:_id', addRequest);
    app.post('/project/deleteRequest/:_id', deleteRequest);
    app.get('/project/getRequests/:_id', getRequests);


};