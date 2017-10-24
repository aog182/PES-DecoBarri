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
		if(!req.params._id){
			res.status(400).send('_id required');
			return;
		}

		User.findById(req.params._id,{'password':0, '__v':0}, function(err, user){
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
	};

	addUser = function(req,res){
		if(!req.body.name){
			res.status(400).send('name required');
			return ;
		}
		if(!req.body._id){
			res.status(400).send('_id required');
			return;
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
			_id: req.body._id,
			name: req.body.name,
			password: req.body.password,
			email: req.body.email
			//projects: [{_id:"1234"},{_id:"1233"}]
		});


		new_user.save(function(err){
			if(err){
				if(err.code == 11000)
					res.status(409).send('User alredy registered');
				else
					res.status(500).send('Internal Server Error');
			}
			else{
				var myToken = jwt.sign({_id: req.body._id}, global.secret)
				res.status(200).json(myToken);
			}
		});
	}

	deleteUser = function(req, res){
		if(!req.params._id){
			res.status(400).send('_id required');
			return;
		}

		User.findById(req.params._id, function(err, user){
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
		if(!req.body._id){
			res.status(400).send('_id required');
			return ;
		}
		if(!req.body.password){
			res.status(400).send('password required');
			return;
		}

		User.findOne({_id: req.body._id}, function(err, user){
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
						var myToken = jwt.sign({_id: req.body._id}, global.secret)
						res.status(200).json(myToken);
					}
						

				});
			}
		});
	}
	
	editUser = function(req, res) {
		if(!req.params._id) {
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

		User.findById(req.params._id, function(err, user){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!user)
				res.status(404).send('User not found.');
			else{
				user.comparePassword(req.body.old_password, function(err, isMath){
					if(err)
						res.status(500).send('Internal Server Error');
					else if(!isMath)
						res.status(401).send('Invalid password');
					else{
						user.name = req.body.name;
						user.password = req.body.new_password;
						user.email = req.body.email;
						user.save(); //per a que el password es torni a encriptar
						res.status(200).send('User modified');
					}
				});
			}
		});
	}

	addProject = function(req, res){
		//La id del body es la del projecte, la de la url es del usuari

		if(!req.params._id) {
			res.status(400).send('username required');
			return;
		}

		if(!req.body.project_id) {
			res.status(400).send('project required');
			return;
		}


		Project.findById(req.body.project_id,{},function(err, project){
			if(err)
				res.status(500).send('Internal Server Error');
			else if(!project)
				res.status(404).send('Project not found');
			else {
				var query = {'_id': req.params._id};
				var project = {'_id':req.body.project_id};

				User.findOneAndUpdate(query, {$push: {'projects': project}}, function(err, user){
					if(err){
						res.status(500).send('Internal Server Error');
					}
					else if(!user){
						res.status(404).send('User not found');
					}
					else{
						res.status(200).send('Project added');
					}
				});
			}
		});
	}


	//returns all the paraments, except the password, of all users
	app.get('/user/findAll', findAllUsers);
	//returns all the paraments, except the password of the user with that id
	app.get('/user/findByID/:_id', findUserByID);
	app.get('/user/findByName/:name', findUserByName);
	//need to pass name, _id, password and email
	app.post('/user/add', addUser);
	//need to pass the name and the password
	app.post('/user/login', loginUser);
	app.delete('/user/delete/:_id', deleteUser);
	app.put('/user/edit/:_id', editUser);
	app.put('/user/addProject/:_id', addProject);

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