var jwt = require('jsonwebtoken');

module.exports = function(app){
	
	var db = require('../database/db');
	var User = db.model('User');

	findAllUsers = function(req, res){
		User.find({},{'password':0},function(err, users){
			if(err)
				res.status(404).send('Users not found.');
			else
				res.send(users);
		});
	}

	findUserByID = function(req, res){
		User.findById(req.params.id,{'password':0}, function(err, user){
			if(err)
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
		if(!req.body.username){
			res.status(400).send('username required');
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

		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password,
			email: req.body.email
		});

		//falta comprovar si existeix, retornar error 409

		user.save(function(err){
			if(err)
				res.status(500).send('Internal Server Error');
			else{
				var myToken = jwt.sign({username: req.body.username}, global.secret)
				res.status(200).json(myToken);
			}
		});		
	}

	deleteUser = function(req, res){
		User.findById(req.params.id, function(err, user){
			if(err)
				res.status(404).send('User not found.');
			else{
				user.remove(function(err){
					if(err)
						res.status(500).send('Internal Server Error');
					else
						res.send('User deleted');
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

		User.findOne({username: req.body.username}, function(err, user){
			if(err)
				res.status(404).send('User not found.');
			else{
				user.comparePassword(req.body.password, function(err, isMath){
					if(err)
						res.status(500).send('Internal Server Error');
					else if(!isMath)
						res.status(401).send('Invalid password');
					else{
						var myToken = jwt.sign({username: req.body.username}, global.secret)
						res.status(200).json(myToken);
					}
						

				});
			}
		});
	}


	//returns all the paraments, except the password, of all users
	app.get('/user/findAll', findAllUsers);
	//returns all the paraments, except the password of the user with that id
	app.get('/user/findByID/:id', findUserByID);
	//need to pass name, username, password and email
	app.post('/user/add', addUser);
	//need to pass the name and the password
	app.post('/user/login', loginUser);
	app.delete('/user/delete/:id', deleteUser);

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