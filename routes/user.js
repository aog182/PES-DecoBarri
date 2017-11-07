var jwt = require('jsonwebtoken');

module.exports = function(app){
	
	var db = require('../database/db');
	var User = db.model('User');
	var Project = db.model('Project');

	findAllUsers = function(req, res){
		User.find({},{'password':0, '__v':0},function(err, users){
			if(err)
				res.status(500).send('Internal Server Error');
			else
				res.send(users);
		});
	}

	findUserByID = function(req, res){
		if(!req.params.username){
			res.status(400).send('username required');
			return;
		}

		User.findById(req.params.username,{'password':0, '__v':0}, function(err, user){
			if(err)
				res.status(500).send('Internal Server Error');
			if(!user)
				res.status(404).send('User not found.');
			else
				res.status(200).send(user);
		});
	}

	findUserByName = function(req, res){
		if(!req.params.name){
			res.status(400).send('name required');
			return;
		}

		User.find({'name':req.params.name},{'password':0, '__v':0}, function(err, users){
			if(err)
				res.status(500).send('Internal Server Error');
			else
				res.status(200).send(users);
		});
	}

	addUser = function(req,res){
		if(!req.body.username){ 
			res.status(400).send('username required');
			return;
		}
		if(!req.body.name){
			res.status(400).send('name required');
			return ;
		}
		if(!req.body.password){
			res.status(400).send('password required');
			return ;
		}
		if(!req.body.email){
			res.status(400).send('email required');
			return;
		}

		var new_user = new User({
			_id: req.body.username, //Els que fan servir l'API no tenen perquè saber que la clau es diu "_id"
			name: req.body.name,
			password: req.body.password,
			email: req.body.email
		});

		User.find({'email':req.body.email},{}, function(err, users){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(users.length)
				res.status(409).send('Email already registered');
			else{
				new_user.save(function(err){
					if(err){
						if(err.code == 11000)
							res.status(409).send('User alredy registered');
						else
							res.status(500).send('Internal Server Error');
					}
					else{
						var myToken = jwt.sign({_id: req.body.username}, global.secret)
						res.status(200).json(myToken);
					}
				});
			}
		});
	}

	deleteUser = function(req, res){
		if(!req.params.username){
			res.status(400).send('username required');
			return;
		}

		User.findById(req.params.username, function(err, user){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!user)
				res.status(404).send('User not found.');			
			else{
				user.remove(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.status(200).send('User deleted');
				});
			}
		});
	}

	loginUser = function(req, res){
		if(!req.body.username){
			res.status(400).send('username required');
			return ;
		}
		if(!req.body.password){
			res.status(400).send('password required');
			return;
		}

		User.findById(req.body.username, function(err, user){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!user)
				res.status(404).send('User not found.');
			else{
				user.comparePassword(req.body.password, function(err, isMath){
					if(err)
						res.status(500).send('Internal Server Error');
					else if(!isMath)
						res.status(401).send('Invalid password');
					else{
						var myToken = jwt.sign({_id: req.body.username}, global.secret)
						res.status(200).json(myToken);
					}
						

				});
			}
		});
	}
	
	editUser = function(req, res) {
		if(!req.params.username) {
			res.status(400).send('username required');
			return;
		}
		if(!req.body.name) {
			res.status(400).send('Name required');
			return;
		}
		if(!req.body.new_password) {
			res.status(400).send('Password required');
			return;
		}
		if(!req.body.old_password) {
			res.status(400).send('Old password required');
			return;
		}
		if(!req.body.email) {
			res.status(400).send('Email required');
			return;
		}

		//SELECT * FROM users WHERE users._id != req.params.username AND users.email = req.body.email
		User.find({"_id": {"$ne": req.params.username},"email": req.body.email}, function(err, users){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(users.length)
				res.status(409).send('Email already registered');
			else{
				User.findById(req.params.username,function(err, user){
					if(!user)
						res.status(404).send('User not found');
					else{
						user.comparePassword(req.body.old_password, function(err, isMatch){
							if(err)
								res.status(500).send('Internal Server Error');
							else if(!isMatch)
								res.status(401).send('Invalid password');
							else{
								user.name = req.body.name;
								user.password = req.body.new_password;
								user.email = req.body.email;
								user.save(function(err){ //per a que el password es torni a encriptar
									if(err)
										res.status(500).send('Internal Server Error');
									else
										res.status(200).send('User modified');
								});
							}
						});
					}
				});
			}
		});
	}

	addProject = function(req, res){
		//La id del body es la del projecte, la de la url es del usuari

		if(!req.params.username) {
			res.status(400).send('username required');
			return;
		}

		if(!req.body.project_id) {
			res.status(400).send('project required');
			return;
		}

		Project.findById(req.body.project_id,{},function(err, projectObj){
			if(err && err.code)
				res.status(500).send('Internal Server Error');
			else if(!projectObj)
				res.status(404).send('Project not found');
			else {
				User.findById(req.params.username,function(err, user){
					if(err){
						res.status(500).send('Internal Server Error');
					}
					else if(!user){
						res.status(404).send('User not found');
					}
					else{
						var project = {'_id':req.body.project_id};
						//comrpovar si existeix, si ja existeix no s'afegeix
						if(user.projects.find(o => o._id == req.body.project_id))
							res.status(409).send('The user has been already registered in this project');
						else{
							user.projects.push(project);
							user.save(function(err){
								if(err)
									res.status(500).send('Internal Server Error');
								else
									res.status(200).send('User modified');
							});
						}
					}
				});
			}
		});
	}

	deleteProject = function(req, res){
		//La id del body es la del projecte, la de la url es del usuari

		if(!req.params.username) {
			res.status(400).send('username required');
			return;
		}

		if(!req.body.project_id) {
			res.status(400).send('project required');
			return;
		}
		User.findById(req.params.username,function(err, user){
			if(err){
				res.status(500).send('Internal Server Error');
			}
			else if(!user){
				res.status(404).send('User not found');
			}
			else{
				//comprovar que no existeix, si no existeix retorna error
				if(!user.projects.find(o => o._id == req.body.project_id))
					res.status(409).send('The user is not registered in this project');
				else{
					var project = {'_id':req.body.project_id};
					user.projects.pull(project);
					user.save(function(err){
						if(err)
							res.status(500).send('Internal Server Error');
						else
							res.status(200).send('User modified');
					});
				}				
			}
		});
	}

	showMyProjects = function(req, res){

		if(!req.params.username) {
			res.status(400).send('username required');
			return;
		}

		User.findById(req.params.username,{'password':0, '__v':0}, function(err, user){
			if(err)
				res.status(500).send('Internal Server Error');
			if(!user)
				res.status(404).send('User not found.');
			else
				res.status(200).send(user.projects);
		});
	}

	addContact = function(req, res){
		//La id del body es la del projecte, la de la url es del usuari

		if(!req.params.username) {
			res.status(400).send('username required');
			return;
		}

		/*if(!req.body.username) {
			res.status(400).send('friendUsername required');
			return;
		}*/

		User.findById(req.body.username,{'password':0, '__v':0},function(err, userObj){
			if(err && err.code)
				res.status(500).send('Internal Server Error');
			else if(!userObj)
				res.status(404).send('User not found');
			else {
				User.findById(req.params.username,{'password':0, '__v':0},function(err, user){
					if(err){
						res.status(500).send('Internal Server Error');
					}
					else if(!user){
						res.status(404).send('User not found');
					}
					else{
						var friend = {'_username':req.body.username};
						//comrpovar si existeix, si ja existeix no s'afegeix
						if(user.contactList.find(o => o._id == req.body.username))
							res.status(409).send('That friend is already registred in your contactList');
						else{
							user.contactList.push(friend);
							user.save(function(err){
								if(err)
									res.status(500).send('Internal Server Error');
								else
									res.status(200).send('User modified, friend registred');
							});
						}
					}
				});
			}
		});
	}


	//returns all the paraments, except the password, of all users
	app.get('/user/findAll', findAllUsers);
	//returns all the paraments, except the password of the user with that id
	app.get('/user/findByID/:username', findUserByID);
	app.get('/user/findByName/:name', findUserByName);
	//need to pass name, username, password and email
	app.post('/user/add', addUser);
	//need to pass the name and the password
	app.post('/user/login', loginUser);
	app.delete('/user/delete/:username', deleteUser);
	app.put('/user/edit/:username', editUser);
	app.put('/user/addProject/:username', addProject);
	app.put('/user/deleteProject/:username', deleteProject);
	app.get('/user/showMyProjects/:username', showMyProjects);
	app.put('/user/addContact/:username', addContact);

}


/*
sudo service mongod start
sudo service mongod stop
mongo
show dbs
use
show collectionss
https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/
Authorization
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsYmVydEx1dGgiLCJpYXQiOjE1MDc5MjAwNjB9.eukhPGfPXkScnw5lAo0EK-CJ1if8uYTthUcI-CuU4ms
*/