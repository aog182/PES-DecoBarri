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
			else if(!project)
				res.status(404).send('Project not found.');
			else
				res.send(project);
		});
	}

	findProjectByName = function(req, res){
		if(!req.params.name){
			res.status(400).send('name required');
			return;
		}

		Project.find({'name':req.params.name}, function(err, project){
			if(err)
				res.status(500).send('Internal Server Error');
			else
				res.send(project);
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
					res.status(409).send('User already registered');
				else
					res.status(500).send('Internal Server Error');
			}
			else{
				res.status(200).send(project._id);
			}
		});		
	}

	editProject = function(req, res) {
		var message = "Required: ";
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
	//need to pass name, username, password and email
	app.post('/project/add', addProject);

	app.delete('/project/delete/:_id', deleteProject);

	app.put('/project/edit/:_id', editProject);
	
}