var db = require('../database/db');
var Project = db.model('Project');
var mongoose = require('mongoose');
var stringSimilarity = require('string-similarity');
var serviceMatProjectList = require('../services/matProjectList');

var errorMessage = require('./error');
var serviceUser = require('./user');

var path = require('path')
var fs = require('fs')

function findProjectByParameter(parameter, callback){
    var error;
	Project.find(parameter, function(err, projects){
		if(err){
			error = new errorMessage('Internal Server Error',500);
			return callback(error);
		}
		if(projects.length === 0){
			error = new errorMessage('Projects not found', 404);
			return callback(error);
		}
		return callback(null, projects);
	});
}

function findAllProjects(callback){
	findProjectByParameter({}, function(err, projects){
		callback(err, projects);
	});
}

function findProjectByID(id, callback){
	findProjectByParameter({'_id': id}, function(err, project){
		if(err)
			return callback(err, project);
		return callback(err, project[0]);
	});
}

function findProjectsByName(name, callback){
	findProjectByParameter({'name':name}, function(err, projects){
		callback(err, projects);
	});
}

function findProjectsByTheme(theme, callback){
	findProjectByParameter({'theme':theme}, function(err, projects){
		callback(err, projects);
	});
}

function findProjectsByCity(city, callback){
	findProjectByParameter({'city':city}, function(err, projects){
		callback(err, projects);
	});
}

function findProjectsByDescription(description, elements, callback){
	var results = [];
	findAllProjects(function(err, projects){
		if(err)
			return callback(err);		

		for (var i = 0; i < projects.length; i++) {
			if(projects[i].description){
				var value = stringSimilarity.compareTwoStrings(description, projects[i].description);
				results.push([value, projects[i]]);
			}
		}
		//ordenar per value en ordre decreixent 
		results.sort(sortFunction);
		results = results.slice(0, elements);
		return callback(null, results);
	});

	function sortFunction(a,b){
		return (a[0] > b[0]) ? -1 : 1;
	}
}

function findProjectsByLocation(lat, lng, callback){
	var results = [];
	findAllProjects(function(err,projects){
		if(err)
			return callback(err);
		
		var latit, longit, result;
		for (var i = projects.length - 1; i >= 0; i--) {
			if(projects[i].lat){
				latit = (+projects[i].lat) - (+lat);
				longit = (+projects[i].lng) - (+lng);
				result = Math.sqrt(Math.pow(latit)+Math.pow(longit));
				results.push([toString(result), projects[i]]);
			}
		}
		//ordenar de mas cercano a mas lejano
		results.sort(sortFunction);
		return callback(null, results);
		
	});

	function sortFunction(a,b){
		return (a[0] > b[0]) ? -1 : 1;
	}
}

function hasProjectID_MaterialGroupList(project_id, callback) {
    findProjectByID(project_id, function(err, project){
    		callback(null, project.material_id === null);
    });
}

function setImage(image, project_id, callback){
	findProjectByID(project_id, function(err, project){
		if(err)
			return callback(err);

		project.img = fs.readFileSync(image.path);
 		project.save(function(err){
			if(err){
				var error = new errorMessage('Internal Server Error',500);
				return callback(error);
			}
			return callback(null, 'Picture uploaded');
		});

	});
}

function addProject(name, theme, description, city, address,  lat, lng, username, image, callback){
	var project = new Project({
		_id: mongoose.Types.ObjectId(),
		name: name,
		theme: theme,
		description: description,
		city: city,
		address: address, 
		lat: lat,
		lng: lng,
		admin: username,
		members: [username],
        material_id: null
	});

	if(image){
		project.img = fs.readFileSync(image.path);
	}

	serviceUser.findUserByID_Password(username, function(err, user){
		if(err)
			return callback(err);
		else{
			user.projects.addToSet(project._id);
			user.save(function(err){
				if(err){
					var error = new errorMessage('Internal Server Error',500);
					return callback(error);
				}
				else {
					project.save(function(err){
						if(err){
							var error = new errorMessage('Internal Server Error',500);
							return callback(error);
						}

				        serviceMatProjectList.addMatProjectList(project._id,function(err, material_id) {
				            if (err) {
				                var error = new errorMessage('Internal Server Error',500);
				                return callback(error);
				            }
				            else {
				                project.material_id = material_id;
				                project.save();
				                callback(null, project._id);
				                
				            }
				        });
					});
				}
			});
		}
	})
}

function getImage(project_id, callback){
	findUserByID(project_id, function(err, project){
		if(err)
			return callback(err);

		callback(null, project.img);
	});
}

function getMaterialProjectListID(id, callback) {
    findProjectByID(id, function(err, project){
        if(err)
            return callback(err);
        return callback(null, "" + project.material_id);
    });
}

function deleteProject(id, callback){
    var material;
	findProjectByID(id, function(err, project){
		if(err)
			return callback(err);

		serviceMatProjectList.deleteMatProjectList(project.material_id, function(err2, material2)  {
            material = material2;
            //El callback d'error, si hi fos es crida des de DINS de deleteMatProjectList
        });

        var project_id = project._id;

        for (var i = 0; i < project.members.length; i++) {
        	serviceUser.deleteProject(project.members[i], project_id, function(err, data){});
        }

        project.remove(function(err){
			if(err){
				serviceMatProjectList.addMatProjectList(material.project_id, null);
                //El callback d'error, si hi fos es crida des de DINS d'addMatProjectList
			}
			else {
				return callback(null, 'Project deleted');
			}
		});
	});
}

function editProject(id, name, theme, description, city, address, callback){
	findProjectByID(id, function(err, project){
		if(err)
			return callback(err);

		project.name = name;
		project.theme = theme;
		project.description = description;
		project.city = city;
		project.address = address;
		project.save(function(err){
			if(err){
				var error = new errorMessage('Internal Server Error',500);
				return callback(error);
			}
			return callback(null, 'Project modified');
		});
	});
}

function addNote(id, title, description, author, modifiable, color, image, callback){
	serviceUser.findUserByID(author, function(err){
		if(err)
			return callback(err);
		else{
			findProjectByID(id, function(err, project){
				if(err)
					return callback(err);

				var date = new Date();
				var note = {'_id': mongoose.Types.ObjectId(),
							'title':title, 
							'description':description,
							'author':author,
							'modifiable': modifiable,
							'date': date.toString().slice(0,21), 
							'color': color};
				if(image){
					note.img = fs.readFileSync(image.path);
				}

				project.notes.push(note);
				project.save(function(err){
					if(err){
						var error = new errorMessage('Internal Server Error',500);
						return callback(error);
					}
					return callback(null, note._id);
				});
			});
		}
	});
}

function editNote(project_id, note_id, description, modifiable, color, image, callback){
	findProjectByID(project_id, function(err, project){
		if(err)
			return callback(err);

		var note = project.notes.find(notes => notes._id == idNote);
		if(note){
			note.description = description;
			note.modifiable = modifiable;
			note.color = color;
			if(image)
				note.img = fs.readFileSync(image.path);	
			project.save(function(err){
				if(err){
					var error = new errorMessage('Internal Server Error',500);
					return callback(error);
				}
				return callback(null, 'Note deleted');
			});
		}
		else{
			var error = new errorMessage('Note not registered',404);
			return callback(error);
		}

	});
}

function deleteNote(idProject, idNote, callback){

	findProjectByID(idProject, function(err, project){
		if(err)
			return callback(err);
		
		var note = project.notes.find(notes => notes._id == idNote);
		if(note){
			project.notes.remove(note);		
			project.save(function(err){
				if(err){
					var error = new errorMessage('Internal Server Error',500);
					return callback(error);
				}
				return callback(null, 'Note deleted');
			});
		}
		else{
			var error = new errorMessage('Note not registered',404);
			return callback(error);
		}
	});
}

function addMember(username, project_id, callback){
	findProjectByID(project_id, function(err, project){
		if(err)
			return callback(err);

		var index = project.requests.indexOf(username);

		if(index == -1){
			var error = new errorMessage('The user has not request to join', 401);
			return callback(error);
		}

		index = project.members.indexOf(username);
		if(index === -1){
			project.requests.remove(username);
			project.members.push(username);
			project.save(function(err){
				if(err){
					var error = new errorMessage('Internal Server Error',500);
					return callback(error);
				}
				return callback(null, 'Project added');
			});
		}
		else{
			var error = new errorMessage('Member already registered',401);
			return callback(error);
		}
	});
}

function deleteMember(username, project_id, callback){
	findProjectByID(project_id, function(err, project){
		if(err)
			return callback(err);

		if(project.admin == username){
			if(project.members.length > 1){
				project.members.shift(); //elimina el primer miembro (admin)
				project.admin = project.members[0];
				project.save(function(err){
					if(err){
						var error = new errorMessage('Internal Server Error',500);
						return callback(error);
					}
					return callback(null, 'Project modified');
				});
			}
			else{
				//solo queda un miembro que es el admin
				deleteProject(project_id, function(err, data){
					return callback(err, data);
				})
				
			}
		}
		else{
			var index = project.members.indexOf(username);
			if(index !== -1){
				project.members.remove(username);			
				project.save(function(err){
					if(err){
						var error = new errorMessage('Internal Server Error',500);
						return callback(error);
					}
					return callback(null, 'Project modified');
				});
			}
			else{
				var error = new errorMessage('Member not registered',404);
				return callback(error);
			}
		}
	});
}

function getMembers(id, callback){
	var result = [];
	findProjectByID(id, function(err, project){
		if(err)
			return callback(err);

		var calls = 0;
		for (i = 0; i < project.members.length;i++){
			serviceUser.getNamePictureDeactivated(project.members[i], function(err, data){
				//if(err)
					//return callback(err);

				calls++;
				if(!err){
					result.push(data);

					//esperar que busqui tots el contactes per tornar el resultat
					//si es fa fora del for, s'executa abans i no retorna res
					if(calls == project.members.length){
						callback(null, result);
					}
				}
			});		
		}
	});
}

function addMaterialGroupList(project_id, _id, callback) {
    findProjectByID(project_id, function(err, project){
    	if(err)
    		return callback(err);
        else if(project.material_id === null) {

        	project.material_id = _id;
        	return callback (null);
        }
        else {
            var error = new errorMessage('The Project already has a Material Group List', 401);
            return callback(error);
		}
    });
}

function deleteMaterialGroupList(project_id, callback) {
    findProjectByID(project_id, function(err, project){
    	if(err)
    		return callback(err);
        else if (project.material_id !== null) {
            project.material_id = null;
            return callback(null);
        } else {
            var error = new errorMessage('The Project does not have a Material Group List', 402);
            return callback(error);
        }
    });
}

function getMaterials(project_id, callback){
	findProjectByID(project_id, function(err, project){
		if(err)
			return callback(err);
		else if (project.material_id == null){
			var error = new errorMessage('The project does not have any material', 402);
		}
		else return callback(null, project.material_id);
	});
}

function getNotes(project_id, callback){
	findProjectByID(project_id, function(err, project){
		if(err)
			return callback(err);
		else if (project.notes == null){
			var error = new errorMessage('The project does not have any note', 402);
		}
		else return callback(null, project.notes);
	});
}

function getItems(project_id, callback){
	findProjectByID(project_id, function(err, project){
		if(err)
			return callback(err);
		else if (project.items_list == null){
			var error = new errorMessage('The project does not have any item', 402);
            return callback(error);
		}
		else{
			return callback(null, project.items_list);
		} 
	});
}

function addItem(id, name, description, callback){
	findProjectByID(id, function(err, project){
		if(err)return callback(err);
		
		var item = {'_id': mongoose.Types.ObjectId(),
					'name':name, 
					'description':description};

		project.items_list.push(item);

		project.save(function(err){
			if(err){
				var error = new errorMessage('Internal Server Error',500);
				return callback(error);
			}
			return callback(null, item._id);
		});
	});
}

function editItem(idProject, idItem, name, description, callback){
	findProjectByID(idProject, function(err, project){
		if(err)
			return callback(err);

		var index = project.items_list.findIndex(item => item._id == idItem);
		if(index !== -1){
			project.items_list[index].name = name;
			project.items_list[index].description = description;
			project.save(function(err){
				if(err){
					var error = new errorMessage('Internal Server Error',500);
					return callback(error);
				}
				return callback(null, 'Project item list modified');
			});
		}
		else{
			var error = new errorMessage('Item not registered',404);
			return callback(error);
		}
	});
}

function deleteItem(idProject, idItem, callback){

	findProjectByID(idProject, function(err, project){
		if(err)
			return callback(err);
		
		var index = project.items_list.findIndex(item => item._id == idItem);
		if(index !== -1){
			project.items_list.remove(idItem);			
			project.save(function(err){
				if(err){
					var error = new errorMessage('Internal Server Error',500);
					return callback(error);
				}
				return callback(null, 'item deleted');
			});
		}
		else{
			var error = new errorMessage('Item not registered',404);
			return callback(error);
		}
	});
}

function addRequest(idProject, username, callback){
	findProjectByID(idProject, function(err, project){
		if(err)
			return callback(err);

		var index = project.members.indexOf(username);

		if(index != -1){
			var error = new errorMessage('The user is already a member', 401);
			return callback(error);
		}
		
		serviceUser.findUserByID(username, function(err, user){
			if(err)
				return callback(err);

			index = project.requests.indexOf(username);
			if(index == -1){
				project.requests.addToSet(username);
				project.save(function(err){
					if(err){
						var error = new errorMessage('Internal Server Error',500);
						return callback(error);
					}
					return callback(null, 'Request added');
				});
			}
			else{
				var error = new errorMessage('Request already registered',401);
				return callback(error);
			}
		});

	});
}

function deleteRequest(idProject, username, callback){
	findProjectByID(idProject, function(err, project){
		if(err)
			return callback(err);

		var index = project.requests.indexOf(username);
		if(index != -1){
			project.requests.remove(username);			
			project.save(function(err){
				if(err){
					var error = new errorMessage('Internal Server Error',500);
					return callback(error);
				}
				return callback(null, 'Request deleted');
			});
		}
		else{
			var error = new errorMessage('Request not registered', 404);
			return callback(error);
		}
	});
}

function getRequests(username, callback){
	findAllProjects(function(err, projects){
		if(err)
			return callback(err);

		var result = [];
		for (var i = 0; i < projects.length; i++) {
			if(projects[i].admin == username){
				result.push({_id : projects[i]._id, name: projects[i].name, requests: projects[i].requests});
			}
		}
		callback(null, result);
	});
}


module.exports.findAllProjects = findAllProjects;
module.exports.findProjectByID = findProjectByID;
module.exports.findProjectsByName = findProjectsByName;
module.exports.findProjectsByTheme = findProjectsByTheme;
module.exports.findProjectsByCity = findProjectsByCity;
module.exports.findProjectsByDescription = findProjectsByDescription;
module.exports.findProjectsByLocation = findProjectsByLocation;
module.exports.hasProjectID_MaterialGroupList = hasProjectID_MaterialGroupList;
module.exports.addProject = addProject;
module.exports.getMaterialProjectListID = getMaterialProjectListID;
module.exports.deleteProject = deleteProject;
module.exports.editProject = editProject;
module.exports.addNote = addNote;
module.exports.deleteNote = deleteNote;
module.exports.addMember = addMember;
module.exports.deleteMember = deleteMember;
module.exports.addMaterialGroupList = addMaterialGroupList;
module.exports.deleteMaterialGroupList = deleteMaterialGroupList;
module.exports.getMaterials = getMaterials;
module.exports.getNotes = getNotes;
module.exports.getMembers = getMembers;
module.exports.getItems = getItems;
module.exports.addItem = addItem;
module.exports.editItem = editItem;
module.exports.deleteItem = deleteItem;
module.exports.getImage = getImage;
module.exports.setImage = setImage;
module.exports.editNote = editNote;
module.exports.addRequest = addRequest;
module.exports.deleteRequest = deleteRequest;
module.exports.getRequests = getRequests;