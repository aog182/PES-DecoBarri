var db = require('../database/db');
var User = db.model('User');

var serviceProject = require('./project');
var errorMessage = require('./error');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var path = require('path')
var fs = require('fs')

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
			var error = new errorMessage('Invalid password',401);
			return callback(error);
		}
		return callback(null, isMath);
	});
}

function findAllUsers(callback){
	findUsersByParameter({'deactivated': null}, {'password':0, '__v':0, '_id':0}, function(err, user){
		callback(err, user);
	});
}

function deleteAllUsers(callback){
	User.remove({}, function(err) {
            if (err) {
                console.log(err)
            }
            callback();
        }
    );
}

function findUserByID(username, callback){
	findUsersByParameter({'username': username},{'password':0, '__v':0, '_id':0}, function(err, user){
		if(err)
			return callback(err);
		if(user.deactivated){
			var error = new errorMessage('User deactivated',403);
			return callback(error);
		}
		
		callback(err, user[0]);
	});
}

function findUserByID_Password(username, callback){
	findUsersByParameter({'username': username},{'__v':0}, function(err, user){
		if(err)
			return callback(err);
		
		callback(err, user[0]);
	});
}


function findUsersByName(name, callback){
	findUsersByParameter({'name': name,'deactivated': null},{'password':0, '__v':0, '_id':0}, function(err, users){
		callback(err, users);
	});
}

function findUserByEmail(email, callback){
	findUsersByParameter({'email': email,'deactivated': null},{'password':0, '__v':0, '_id':0}, function(err, user){
		if(err)
			return callback(err);
		
		callback(err, user[0]);
	});
}

function addUser(username, name, password, email, callback){
	
	var new_user = new User({
		_id: mongoose.Types.ObjectId(),
		username: username, 
		name: name,
		password: password,
		email: email,
		deactivated: null
	});

	findUserByID(username, function(err, user){
		if(err){
			//si no existe ningun usuario registrado (404) o dado de baja (403) con el mismo username
			if(err.code == 403){
				var error = new errorMessage('Username already registered',409);
				return callback(error);
			}
			else if(err.code != 404)
				return callback(err);
			else{
				findUserByEmail(email, function(err, user){
					if(err){
						if(err.code != 404)
							return callback(err);
						else{
							new_user.save(function(err){
								if(err){
									var error = new errorMessage('Internal Server Error',500);
									return callback(error);						
								}
								
								var myToken = jwt.sign({username: username}, global.secret)
								return callback(null, myToken);					
							});
						}
					}
					else {
						var error = new errorMessage('Email already registered',409);
						return callback(error);
					}
				});
			}
		}
		else {
			var error = new errorMessage('Username already registered',409);
			return callback(error);
		}
	});
}

function deleteUser(username,callback){
	findUserByID_Password(username, function(err, user){
		if(err)
			return callback(err);

		var date = new Date();
		user.deactivated = date;
		user.save(function(err){
			if(err){
				//console.log(err);
				var error = new errorMessage('Internal Server Error',500);
				return callback(error);
			}
			return callback(null, 'User deactivated');
		});
	});
}

function editInfoUser(username, new_data, image, callback){
	findUserByID_Password(username, function(err, user){
		if(err)
			return callback(err);

		if(image)
			uploadImage(image,username,function(err,data){});

		//SELECT * FROM users WHERE users._id != username AND users.email = email
		User.find({"username": {"$ne": username},"email": new_data.email}, function(err, users){
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

		if(user.deactivated){
			var error = new errorMessage('User deactivated',403);
			return callback(error); 
		}
		else{
			checkPassword(user, password, function(err, isMath){
				if(err)
					return callback(err);
				else{
					var myToken = jwt.sign({username: username}, global.secret)
					callback(null, myToken);
				}
			});
		}
	});
}

function addProject(username, project_id, callback){
	findUserByID_Password(username, function(err, user){
		if(err)
			return callback(err);

		serviceProject.addMember(username,project_id, function(err, message){
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
	findUserByID_Password(username, function(err, user){
		if(err)
			return callback(err);

		serviceProject.deleteMember(username, project_id, function(err, message){
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
		})
	});
}

function addContact(username, usernameContact, callback){
	findUserByID_Password(username, function(err, user){
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
						//console.log("ENTRA");
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
	findUserByID_Password(username, function(err, user){
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
				return callback(null, 'Contact deactivated');
			});
		}
		else{
			var error = new errorMessage('Contact not registered',404);
			return callback(error);
		}
	});
}

function getNamePictureDeactivated(username, callback){
	//Quan estiguin les imatges ha de retornar picture tambe
	findUsersByParameter({'username': username},{'username':1,'name':1,'deactivated':1}, function(err, user){
		if(err)
			return callback(err);	
		callback(err, user[0]);
	});
}

function getContacts(username, callback){
	var result = new Array();
	findUserByID(username, function(err, user){
		if(err)
			return callback(err);
		
		var calls = 0;
		for (var i = 0; i < user.contacts.length; i++) {
			getNamePictureDeactivated(user.contacts[i], function(err, data){
				//if(err)
					//return callback(err);
				calls++;
				if(!err){
					result.push(data);

					//esperar que busqui tots el contactes per tornar el resultat
					//si es fa fora del for, s'executa abans i no retorna res
					if(calls == user.contacts.length)
						callback(null, result);
				}
			});
		}
	});
}

function showMyProjects(username, callback){
	findUsersByParameter({'username': username},{'projects':1}, function(err, projects){
		if(err)
			return callback(err);
		
		callback(null, projects);
	})
}

function uploadImage(image, username, callback){
	findUserByID_Password(username, function(err, user){
		if(err)
			return callback(err);

		user.img = fs.readFileSync(image.path);
 		user.save(function(err){
			if(err){
				var error = new errorMessage('Internal Server Error',500);
				return callback(error);
			}
			return callback(null, 'Picture uploaded');
		});

	});
}

function getImage(username, callback){
	findUserByID(username, function(err, user){
		if(err)
			return callback(err);

		callback(null, user.img);
	});
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
module.exports.getContacts = getContacts;
module.exports.getNamePictureDeactivated = getNamePictureDeactivated;
module.exports.deleteAllUsers = deleteAllUsers;
module.exports.findUserByID_Password = findUserByID_Password;
module.exports.uploadImage = uploadImage;
module.exports.getImage = getImage;