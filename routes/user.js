module.exports = function(app){

	var jwt_decode = require('jwt-decode');

	var serviceUser = require('../services/user');
	var sendResponse = require('./sendResponse');

	findAllUsers = function(req, res){
		serviceUser.findAllUsers(function(err, users){
			sendResponse.sendRes(res, err, users);
		});
	}

	findUserByID = function(req, res){
		if(!req.params.username){
			res.status(400).send('Username required');
			return;
		}

		serviceUser.findUserByID(req.params.username, function(err, user){
			sendResponse.sendRes(res, err, user);
		});
	}

	findUsersByName = function(req, res){
		if(!req.params.name){
			res.status(400).send('Name required');
			return;
		}

		serviceUser.findUsersByName(req.params.name, function(err, users){
			sendResponse.sendRes(res, err, users);
		});
	}

	addUser = function(req,res){
		if(!req.body.username){ 
			res.status(400).send('Username required');
			return;
		}
		if(!req.body.name){
			res.status(400).send('Name required');
			return ;
		}
		if(!req.body.password){
			res.status(400).send('Password required');
			return ;
		}
		if(!req.body.email){
			res.status(400).send('Email required');
			return;
		}			

		serviceUser.addUser(req.body.username,
							req.body.name,
							req.body.password,
							req.body.email, function(err, data){
			sendResponse.sendRes(res, err, data);
		});
	}

	deleteUser = function(req, res){
		if(!req.params.username){
			res.status(400).send('Username required');
			return;
		}

		serviceUser.deleteUser(req.params.username, function(err, data){
			sendResponse.sendRes(res, err, data);
		});
	}

	loginUser = function(req, res){
		if(!req.body.username){
			res.status(400).send('Username required');
			return ;
		}
		if(!req.body.password){
			res.status(400).send('Password required');
			return;
		}

		serviceUser.loginUser(req.body.username,req.body.password, function(err, data){
			sendResponse.sendRes(res, err, data);
		});
	}
	
	editInfoUser = function(req, res) {
		if(!req.params.username) {
			res.status(400).send('Username required');
			return;
		}
		if(!req.body.name) {
			res.status(400).send('Name required');
			return;
		}
		if(!req.body.email) {
			res.status(400).send('Email required');
			return;
		}

		var new_data = {
			name : req.body.name,
			email : req.body.email
		};

		serviceUser.editInfoUser(req.params.username, new_data, function(err, data){
			sendResponse.sendRes(res, err, data);
		});
	}

	editPassword = function(req, res){
		if(!req.params.username) {
			res.status(400).send('Username required');
			return;
		}
		if(!req.body.new_password) {
			res.status(400).send('New password required');
			return;
		}
		if(!req.body.old_password) {
			res.status(400).send('Old password required');
			return;
		}
		serviceUser.editPasswordUser(req.params.username, 
			req.body.old_password, req.body.new_password, function(err, data){
			sendResponse.sendRes(res, err, data);
		});
	}

	addProject = function(req, res){
		//La id del body es la del projecte, la de la url es del usuari

		if(!req.params.username) {
			res.status(400).send('Username required');
			return;
		}

		if(!req.body.project_id) {
			res.status(400).send('Project required');
			return;
		}

		serviceUser.addProject(req.params.username, req.body.project_id, function(err, data){
			sendResponse.sendRes(res, err, data);
		});
	}

	deleteProject = function(req, res){
		//La id del body es la del projecte, la de la url es del usuari

		if(!req.params.username) {
			res.status(400).send('Username required');
			return;
		}

		if(!req.body.project_id) {
			res.status(400).send('Project required');
			return;
		}
		serviceUser.deleteProject(req.params.username, req.body.project_id, function(err, data){
			sendResponse.sendRes(res, err, data);
		});
	}

	addContact = function(req, res){
		//El username del body es el del contacto

		if(!req.params.username) {
			res.status(400).send('Username required');
			return;
		}

		if(!req.body.username) {
			res.status(400).send('Username contact required');
			return;
		}

		if(req.body.username == req.params.username) {
			res.status(401).send('Usernames invalid');
			return;
		}

		serviceUser.addContact(req.params.username, req.body.username, function(err, data){
			sendResponse.sendRes(res, err, data);
		});
	}

	deleteContact = function(req, res){
		//El username del body es el del contacto

		if(!req.params.username) {
			res.status(400).send('Username required');
			return;
		}

		if(!req.body.username) {
			res.status(400).send('Username contact required');
			return;
		}
		serviceUser.deleteContact(req.params.username, req.body.username, function(err, data){
			sendResponse.sendRes(res, err, data);
		});
	}

	showMyProjects = function(req, res){

		if(!req.params.username) {
			res.status(400).send('Username required');
			return;
		}
s
		serviceUser.showMyProjects(req.params.username, function(err, data){
			sendResponse.sendRes(res, err, data);
		});
	}


	//returns all the paraments, except the password, of all users
	app.get('/user/findAll', findAllUsers);
	//returns all the paraments, except the password of the user with that id
	app.get('/user/findByID/:username', findUserByID);
	app.get('/user/findByName/:name', findUsersByName);
	//need to pass name, username, password and email
	app.post('/user/add', addUser);
	//need to pass the name and the password
	app.post('/user/login', loginUser);
	app.delete('/user/delete/:username', deleteUser);
	app.put('/user/edit/:username', editInfoUser);
	app.put('/user/editPassword/:username', editPassword);
	app.put('/user/addProject/:username', addProject);
	app.put('/user/deleteProject/:username', deleteProject);
	app.put('/user/addContact/:username', addContact);
	app.put('/user/deleteContact/:username', deleteContact);
	app.get('/user/showMyProjects/:username', showMyProjects);

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
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhbGJlcnRMdXRoIiwiaWF0IjoxNTEwODQ2NjUwfQ.3Jz7bXkyJlCfRnBFU2OY6meVevh4fxe8sJ4evLrfgLI
*/