var jwt = require('jsonwebtoken');

module.exports = function(app){
	
	var db = require('../database/db');
	var User = db.model('User');

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
				res.send(user);
		});
	}

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
		});

		//si existeix, retornar error 409
		User.findById(req.body._id, function(err, user){
			if(user){
				res.status(409).send('User already registered.');
				return;
			}
			else{
				new_user.save(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else{
						var myToken = jwt.sign({_id: req.body._id}, global.secret)
						res.status(200).json(myToken);
					}
				});	
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

	editName = function(req, res) {
		if(!req.params._id) {
			res.status(400).send('_id required');
			return;
		}

		if(!req.body.name) {
			res.status(400).send('Name required');
			return;
		}

		var query = {'_id': req.params._id}

		User.findOneAndUpdate(query, {'name': req.body.name}, function(err, user){
			if(!user)
				res.status(404).send('User not found');
			else
				res.status(200).send('User modified');
			});
	}


	//returns all the paraments, except the password, of all users
	app.get('/user/findAll', findAllUsers);
	//returns all the paraments, except the password of the user with that id
	app.get('/user/findByID/:_id', findUserByID);
	//need to pass name, _id, password and email
	app.post('/user/add', addUser);
	//need to pass the name and the password
	app.post('/user/login', loginUser);
	app.delete('/user/delete/:_id', deleteUser);
	app.put('/user/edit/:_id', editName);

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