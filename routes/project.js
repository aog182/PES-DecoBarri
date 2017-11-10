module.exports = function(app){

	var serviceProject = require('../services/project');
	var sendResponse = require('./sendResponse');

	findAllProjects = function(req, res){
		serviceProject.findAllProjects(function(err, projects){
			sendResponse.sendRes(res, err, projects);
		});
	}

	findProjectByID = function(req, res){
		if(!req.params._id){
			res.status(400).send('_id required');
			return;
		}

		serviceProject.findProjectByID(req.params._id, function(err, project){
			sendResponse.sendRes(res, err, project);
		});
	}

	findProjectByName = function(req, res){
		if(!req.params.name){
			res.status(400).send('name required');
			return;
		}

		var name = new RegExp(req.params.name, 'i');  // 'i' makes it case insensitive
		serviceProject.findProjectByName(name, function(err, project){
			sendResponse.sendRes(res, err, project);
		});
	}

	findProjectByTheme = function(req, res){
		if(!req.params.theme){
			res.status(400).send('theme required');
			return;
		}

		var theme = new RegExp(req.params.theme, 'i');  // 'i' makes it case insensitive
		serviceProject.findProjectByTheme(theme, function(err, project){
			sendResponse.sendRes(res, err, project);
		});
	}

	findProjectByDescription = function(req, res){
		if(!req.params.description){
			res.status(400).send('description required');
			return;
		}

		var description = new RegExp(req.params.city, 'i');  // 'i' makes it case insensitive
		serviceProject.findProjectByDescription(description, function(err, project){
			sendResponse.sendRes(res, err, project);
		});
	}

	findProjectByCity = function(req, res){
		if(!req.params.city){
			res.status(400).send('city required');
			return;
		}

		var city = new RegExp(req.params.city, 'i');  // 'i' makes it case insensitive
		serviceProject.findProjectByCity(city, function(err, project){
			sendResponse.sendRes(res, err, project);
		});
	}

	addProject = function(req,res){
		if(!req.body.name){
			return res.status(400).send('name required');
		}
		if(!req.body.city){
			return res.status(400).send('city required');
		}

		serviceProject.addProject(	req.body.name,
									req.body.theme,
									req.body.description,
									req.body.city,
									req.body.address, function(err, id){
										sendResponse.sendRes(res, err, id);
		});		
	}

	editProject = function(req, res) {
		if(!req.params._id) {
			res.status(400).send('_id required');
			return;
		}
		if(!req.body.name) {
			res.status(400).send("name required");
			return;
		}
		if(!req.body.city) {
			res.status(400).send("city required");
			return;
		}

		serviceProject.editProject(	req.params._id,
									req.body.name, 
									req.body.theme,
									req.body.description,
									req.body.city,
									req.body.address, function(err, data){
										sendResponse.sendRes(res, err, data);
		});
	}

	deleteProject = function(req, res){
		if(!req.params._id){
			res.status(400).send('_id required');
			return;
		}

		serviceProject.deleteProject(req.params._id, function(err, data){
			sendResponse.sendRes(res, err, data);
		});
	}

	addNote = function(req, res){
		if(!req.params._id){
			res.status(400).send('_id required');
			return;
		}
		if(!req.body.title){
			res.status(400).send('title required');
			return;
		}
		if(!req.body.description){
			res.status(400).send('description required');
			return;
		}
		if(!req.body.author){
			res.status(400).send('author required');
			return;
		}
		if(!req.body.modifiable){
			res.status(400).send('modifiable required');
			return;
		}

		serviceProject.addNote(	req.params._id,
								req.body.title,
								req.body.description,
								req.body.author,
								req.body.modifiable, function(err, data){
			sendResponse.sendRes(res, err, data);
		});
	};

	deleteNote = function(req, res){
		if(!req.params._id){
			res.status(400).send('_id required');
			return;
		}
		if(!req.body.note_id){
			res.status(400).send('note_id required');
			return;
		}

		serviceProject.deleteNote(req.params._id, req.body.note_id, function(err, data){
			sendResponse.sendRes(res, err, data);
		})
	}


	//returns all the paraments of all projects
	app.get('/project/findAll', findAllProjects);
	//returns all the paraments
	app.get('/project/findByID/:_id', findProjectByID);
	app.get('/project/findByName/:name', findProjectByName);
	app.get('/project/findByTheme/:theme', findProjectByTheme);
	app.get('/project/findByDescription/:description', findProjectByDescription);
	app.get('/project/findByCity/:city', findProjectByCity);
	//need to pass name, username, password and email
	app.post('/project/add', addProject);

	app.put('/project/edit/:_id', editProject);

	app.delete('/project/delete/:_id', deleteProject);
	app.post('/project/addNote/:_id', addNote);
	app.put('/project/deleteNote/:_id', deleteNote);

}