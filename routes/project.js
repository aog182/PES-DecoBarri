module.exports = function(app){

	var serviceProject = require('../services/project');
	var sendResponse = require('./sendResponse');


    var findAllProjects = function (req, res) {
        serviceProject.findAllProjects(function (err, projects) {
            sendResponse.sendRes(res, err, projects);
        });
    }

    var findProjectByID = function (req, res) {
        serviceProject.findProjectByID(req.params._id, function (err, project) {
            sendResponse.sendRes(res, err, project);
        });
    }

    var findProjectsByName = function (req, res) {
        var name = new RegExp(req.params.name, 'i');  // 'i' makes it case insensitive
        serviceProject.findProjectsByName(name, function (err, project) {
            sendResponse.sendRes(res, err, project);
        });
    }

    var findProjectsByTheme = function (req, res) {
        var theme = new RegExp(req.params.theme, 'i');  // 'i' makes it case insensitive
        serviceProject.findProjectsByTheme(theme, function (err, project) {
            sendResponse.sendRes(res, err, project);
        });
    }

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
    }

    var findProjectsByCity = function (req, res) {
        var city = new RegExp(req.params.city, 'i');  // 'i' makes it case insensitive
        serviceProject.findProjectsByCity(city, function (err, project) {
            sendResponse.sendRes(res, err, project);
        });
    }

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
	}

    var addProject = function (req, res) {
        if (!req.body.name) {
            return res.status(400).send('name required');
        }
        if (!req.body.city) {
            return res.status(400).send('city required');
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
            req.body.lng, function (err, id) {
                sendResponse.sendRes(res, err, id);
            });
    }

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
    }

    var deleteProject = function (req, res) {
        serviceProject.deleteProject(req.params._id, function (err, data) {
            sendResponse.sendRes(res, err, data);
        });
    }

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

        serviceProject.addNote(req.params._id,
            req.body.title,
            req.body.description,
            req.body.author,
            req.body.modifiable, function (err, data) {
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
    }

    var getMaterials = function(req, res){
    	serviceProject.getMaterials(req.params._id, function(err, data){
    		sendResponse.sendRes(res, err, data);
    	});
    }

    var getNotes = function(req, res){
        serviceProject.getNotes(req.params._id, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    }

    var getMembers = function(req, res){
        serviceProject.getMembers(req.params._id, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    }  

    var getItems = function(req, res){
        serviceProject.getItems(req.params._id, function(err, data){
            sendResponse.sendRes(res, err, data);
        });
    }

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
    //need to pass name, username, password and email
	app.post('/project/add', addProject);

	app.put('/project/edit/:_id', editProject);

	app.delete('/project/delete/:_id', deleteProject);
	app.post('/project/addNote/:_id', addNote);
	app.put('/project/deleteNote/:_id', deleteNote);

    app.post('/project/addItem/:_id', addItem);

}