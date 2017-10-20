var jwt = require('jsonwebtoken');

module.exports = function(app){
	
	var db = require('../database/db');
	var Project = db.model('Project');

	findAllProjects = function(req, res){
		Project.find({},function(err, projects){
			if(!projects)
				return res.status(404).send('Projects not found.');
			else
				return res.send(projects);
		});
	}

	findProjectByID = function(req, res){
		if(!req.params.id){
			res.status(400).send('id required');
			return;
		}

		Project.findById(req.params.id, function(err, project){
			if(!project)
				res.status(404).send('Project not found.');
			else
				res.send(project);
		});
	}

	addProject = function(req,res){
		if(!req.body.id){
			return res.status(400).send('id required');
		}
		if(!req.body.name){
			return res.status(400).send('name required');
		}
		if(!req.body.city){
			return res.status(400).send('city required');
		}
		
		var project = new Project({
			_id: req.body.id,
			name: req.body.name,
			theme: req.body.theme,
			description: req.body.description,
			city: req.body.city,
			address: req.body.address
		});

		project.save(function(err){
			if (err)
				if(err.code = 11000)
					return res.status(409).send('Project already registered.');
					//return res.status(500).send('Internal Server Error');
				else
					return res.status(500).send(err.message);
			else
				return res.status(200);
		});		
	}

	//returns all the paraments of all projects
	app.get('/project/findAll', findAllProjects);
	//returns all the paraments
	app.get('/project/findByID/:id', findProjectByID);
	//need to pass name, username, password and email
	app.post('/project/add', addProject);

}