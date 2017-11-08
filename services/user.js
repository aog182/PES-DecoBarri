var db = require('../database/db');
var User = db.model('User');

var serviceProject = require('./project');
var errorMessage = require('./error');
var jwt = require('jsonwebtoken');

function findUsersByParameter(parameter, fields, callback){
	User.find(parameter,fields, function(err, users){
		if(err){
			var error = new errorMessage('Internal Server Error',500);
			return callback(error);
		}
		if(users.length == 0){
			var error = new errorMessage('Users not found',404);
			return callback(error);
		}
		callback(null, users);
	});
}

function checkPassword(user, password, callback){
	user.comparePassword(password, function(err, isMath){
		if(err){
			var error = new errorMessage('Internal Server Error',500);
			return callback(error);
		}
		if(!isMath){
			var error = new errorMessage('Password incorret',401);
			return callback(error);
		}
		return callback(null, isMath);
	});
}

function findAllUsers(callback){
	findUsersByParameter({}, {'password':0, '__v':0}, function(err, user){
		callback(err, user);
	});
}

function findUserByID(username, callback){
	findUsersByParameter({'_id': username},{'password':0, '__v':0}, function(err, user){
		if(err)
			return callback(err, user);
		
		callback(err, user[0]);
	});
}

function findUserByID_Password(username, callback){
	findUsersByParameter({'_id': username},{'__v':0}, function(err, user){
		if(err)
			return callback(err, user);
		
		callback(err, user[0]);
	});
}


function findUsersByName(name, callback){
	findUsersByParameter({'name': name},{'password':0, '__v':0}, function(err, users){
		callback(err, users);
	});
}

function findUserByEmail(email, callback){
	findUsersByParameter({'email': email},{'password':0, '__v':0}, function(err, user){
		if(err)
			return callback(err, user);
		
		callback(err, user[0]);
	});
}

function addUser(username, name, password, email, callback){
	
	var new_user = new User({
		_id: username, 
		name: name,
		password: password,
		email: email
	});

	findUserByEmail(email, function(err, user){
		if(err){
			if(err.code == 500)
				return callback(err);
			
			new_user.save(function(err){
				if(err){
					if(err.code == 11000){
						var error = new errorMessage('Username already registered',409);
						return callback(error);
					}
					var error = new errorMessage('Internal Server Error',500);
					return callback(error);						
				}
				
				var myToken = jwt.sign({_id: username}, global.secret)
				return callback(null, myToken);					
			});
		}
		else{
			var error = new errorMessage('Email already registered',409);
			return callback(error);
		}
	});
}

function deleteUser(username,callback){
	findUserByID(username, function(err, user){
		if(err)
			return callback(err);

		user.remove(function(err){
			if(err){
				var error = new errorMessage('Internal Server Error',500);
				return callback(error);
			}					
			return callback(null, 'User Deleted');
		});
	});
}

function editInfoUser(username, new_data, callback){
	findUserByID(username, function(err, user){
		if(err)
			return callback(err);			
		//SELECT * FROM users WHERE users._id != username AND users.email = email
		User.find({"_id": {"$ne": username},"email": new_data.email}, function(err, users){
			if(err){
				var error = new errorMessage('Internal Server Error',500);
				return callback(error);
			}
			if(users.length){
				var error = new errorMessage('Email already registered',409);
				return callback(error);
			}
			user.name = new_data.name;
			user.email = new_data.email;
			user.save(function(err){
				if(err){
					var error = new errorMessage('Internal Server Error',500);
					return callback(error);
				}
				return callback(null, 'User modified');
			});
		});
	});
}

function editPasswordUser(username, old_password, new_password, callback){
	findUserByID_Password(username, function(err, user){
		if(err)
			return callback(err);
		checkPassword(user, old_password, function(err, isMath){
			if(err)
				return callback(err);
			user.password = new_password;
			user.save(function(err){
				if(err){
					var error = new errorMessage('Internal Server Error',500);
					return callback(error);
				}
				return callback(null, 'Password modified');
			});
		});

	});
}

function loginUser(username, password, callback){
	findUserByID_Password(username, function(err, user){
		if(err)
			return callback(err);
		checkPassword(user, password, function(err, isMath){
			if(err)
				return callback(err);

			var myToken = jwt.sign({_id: username}, global.secret)
			callback(null, myToken);
		});
	});
}

function addProject(username, project_id, callback){
	serviceProject.findProjectByID(project_id, function(err, project){
		if(err)
			return callback(err);
		findUserByID(username, function(err, user){
			if(err)
				return callback(err);

			var index = user.projects.indexOf(project_id);
			if(index == -1){
				user.projects.addToSet(project_id);
				user.save(function(err){
					if(err){
						var error = new errorMessage('Internal Server Error',500);
						return callback(error);
					}
					return callback(null, 'User modified');
				});
			}
			else{
				var error = new errorMessage('Project already registered',401);
				return callback(error);
			}
		});
	});
}

function deleteProject(username, project_id, callback){
	findUserByID(username, function(err, user){
		if(err)
			return callback(err);
		
		var index = user.projects.indexOf(project_id);
		if(index != -1){
			user.projects.remove(project_id);			
			user.save(function(err){
				if(err){
					var error = new errorMessage('Internal Server Error',500);
					return callback(error);
				}
				return callback(null, 'User modified');
			});
		}
		else{
			var error = new errorMessage('Project not registered',404);
			return callback(error);
		}
	});
}

function addContact(username, usernameContact, callback){
	findUserByID(username, function(err, user){
		if(err)
			return callback(err);
		findUserByID(usernameContact, function(err, userContact){
			if(err)
				return callback(err);
			var index = user.contacts.indexOf(usernameContact);
			if(index == -1){
				user.contacts.addToSet(usernameContact);
				user.save(function(err){
					if(err){
						var error = new errorMessage('Internal Server Error',500);
						return callback(error);
					}
					return callback(null, 'Contact added');
				});
			}
			else{
				var error = new errorMessage('Contact already registered',401);
				return callback(error);
			}
		});
	})
}

function deleteContact(username, usernameContact, callback){
	findUserByID(username, function(err, user){
		if(err)
			return callback(err);
		var index = user.contacts.indexOf(usernameContact);
		if(index != -1){
			user.contacts.remove(usernameContact);			
			user.save(function(err){
				if(err){
					var error = new errorMessage('Internal Server Error',500);
					return callback(error);
				}
				return callback(null, 'Contact deleted');
			});
		}
		else{
			var error = new errorMessage('Contact not registered',404);
			return callback(error);
		}
	});
}

function showMyProjects(username, callback){
	findUsersByParameter({'_id': username},{'projects':1}, function(err, projects){
		if(err)
			return callback(err);
		
		callback(null, projects);
	})
}

module.exports.findAllUsers = findAllUsers;
module.exports.findUserByID = findUserByID;
module.exports.findUsersByName = findUsersByName;
module.exports.addUser = addUser;
module.exports.deleteUser = deleteUser;
module.exports.editInfoUser = editInfoUser;
module.exports.editPasswordUser = editPasswordUser;
module.exports.loginUser = loginUser;
module.exports.addProject = addProject;
module.exports.deleteProject = deleteProject;
module.exports.addContact = addContact;
module.exports.deleteContact = deleteContact;
module.exports.showMyProjects = showMyProjects;