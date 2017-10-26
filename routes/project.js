var jwt = require('jsonwebtoken');

module.exports = function(app){
	
	var db = require('../database/db');
	var Project = db.model('Project');

	findAllProjects = function(req, res){
		Project.find({},function(err, projects){
			if(err)
				res.status(500).send('Internal Server Error');
			else
				return res.send(projects);
		});
	}

	findProjectByID = function(req, res){
		if(!req.params._id){
			res.status(400).send('_id required');
			return;
		}

		Project.findById(req.params._id, function(err, project){
			if(err)
				res.status(500).send('Internal Server Error');
			if(!project)
				res.status(404).send('Project not found.');
			else
				res.status(200).send(project);
		});
	}

	findProjectByName = function(req, res){
		if(!req.params.name){
			res.status(400).send('name required');
			return;
		}

		var regex = new RegExp(req.params.name, 'i');  // 'i' makes it case insensitive
		Project.find({name:regex}, function(err, project){
			if(err)
				res.status(500).send('Internal Server Error');
			else if (project && project.length != 0)
				res.status(200).send(project);
			else 
				res.status(404).send("Project not found");
		});
	}

	findProjectByTheme = function(req, res){
		if(!req.params.theme){
			res.status(400).send('theme required');
			return;
		}

		var regex = new RegExp(req.params.theme, 'i');  // 'i' makes it case insensitive
		Project.find({theme:regex}, function(err, project){
			if(err)
				res.status(500).send('Internal Server Error');
			else if (project && project.length != 0)
				res.status(200).send(project);
			else 
				res.status(404).send("Project not found");
		});
	}

	findProjectByDescription = function(req, res){
		if(!req.params.description){
			res.status(400).send('description required');
			return;
		}

		var regex = new RegExp(req.params.description, 'i');  // 'i' makes it case insensitive
		Project.find({description:regex}, function(err, project){
			if(err)
				res.status(500).send('Internal Server Error');
			else if (project && project.length != 0)
				res.status(200).send(project);
			else 
				res.status(404).send("Project not found");
		});
	}

	findProjectByCity = function(req, res){
		if(!req.params.city){
			res.status(400).send('city required');
			return;
		}

		var regex = new RegExp(req.params.city, 'i');  // 'i' makes it case insensitive
		Project.find({city:regex}, function(err, project){
			if(err)
				res.status(500).send('Internal Server Error');
			else if (project && project.length != 0)
				res.status(200).send(project);
			else 
				res.status(404).send("Project not found");
		});
	}

	findProjectByAddress = function(req, res){
		if(!req.params.address){
			res.status(400).send('address required');
			return;
		}

		var regex = new RegExp(req.params.address, 'i');  // 'i' makes it case insensitive
		Project.find({address:regex}, function(err, project){
			if(err)
				res.status(500).send('Internal Server Error');
			else if (project && project.length != 0)
				res.status(200).send(project);
			else 
				res.status(404).send("Project not found");
		});
	}


	addProject = function(req,res){
		if(!req.body.name){
			return res.status(400).send('name required');
		}
		if(!req.body.city){
			return res.status(400).send('city required');
		}
		
		var project = new Project({
			name: req.body.name,
			theme: req.body.theme,
			description: req.body.description,
			city: req.body.city,
			address: req.body.address
		});

		project.save(function(err){
			if(err){
				if(err.code == 11000)
					//Impossible arribar aqui, no busquem id
					res.status(409).send('Project already registered');
				else
					res.status(500).send('Internal Server Error');
			}
			else{
				res.status(200).send(project._id);
			}
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

		Project.findById(req.params._id, function(err, project){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!project)
				res.status(404).send('Project not found.');
			else{
				project.name = req.body.name;
				project.theme = req.body.theme;
				project.description = req.body.description;
				project.city = req.body.city;
				project.address = req.body.address;
				project.save(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Project modified');
				});	
			}
		});
	}

	deleteProject = function(req, res){
		if(!req.params._id){
			res.status(400).send('_id required');
			return;
		}

		Project.findById(req.params._id, function(err, project){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!project)
				res.status(404).send('Project not found.');			
			else{
				project.remove(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('Project deleted');
				});
			}
		});
	}

	//returns all the paraments of all projects
	app.get('/project/findAll', findAllProjects);
	//returns all the paraments
	app.get('/project/findByID/:_id', findProjectByID);
	app.get('/project/findByName/:name', findProjectByName);
	app.get('/project/findByTheme/:theme', findProjectByTheme);
	app.get('/project/findByDescription/:description', findProjectByDescription);
	app.get('/project/findByCity/:city', findProjectByCity);
	app.get('/project/findByAddress/:address', findProjectByAddress);
	//need to pass name, username, password and email
	app.post('/project/add', addProject);

	app.put('/project/edit/:_id', editProject);

	app.delete('/project/delete/:_id', deleteProject);

}