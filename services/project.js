var db = require('../database/db');
var Project = db.model('Project');
var mongoose = require('mongoose');
var stringSimilarity = require('string-similarity');

var errorMessage = require('./error');
var serviceUser = require('./user');

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

function findProjectsByTheme(name, callback){
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
				value = stringSimilarity.compareTwoStrings(description, projects[i].description);
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

function addProject(name, theme, description, city, address, lat, lng, callback){
	var project = new Project({
		_id: mongoose.Types.ObjectId(),
		name: name,
		theme: theme,
		description: description,
		city: city,
		address: address, 
		lat: lat,
		lng: lng
	});

	project.save(function(err){
		if(err){
			var error = new errorMessage('Internal Server Error',500);
			return callback(error);
		}
		callback(null, project._id);
	});
}

function deleteProject(id, callback){
	findProjectByID(id, function(err, project){
		if(err)
			return callback(err);

		project.remove(function(err){
			if(err){
				var error = new errorMessage('Internal Server Error',500);
				return callback(error);
			}
			callback(null, 'Project deleted');
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

function addNote(id, title, description, author, modifiable, callback){
	serviceUser.findUserByID(author, function(err, user){
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
							'date': date};
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

function deleteNote(idProject, idNote, callback){

	findProjectByID(idProject, function(err, project){
		if(err)
			return callback(err);
		
		var index = project.notes.findIndex(note => note._id == idNote);
		if(index != -1){
			project.notes.remove(idNote);			
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

		var index = project.members.indexOf(username);
		if(index == -1){
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

		var index = project.members.indexOf(username);
		if(index != -1){
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
	});
}

function getMembers(id, callback){
	var result = new Array();
	findProjectByID(id, function(err, project){
		if(err)
			return callback(err);

		for (var i = 0; i < project.members.length; i++){
			serviceUser.getNamePictureDeactivated(project.members[i], function(err, data){
				//if(err)
					//return callback(err);
				if(!err){
					result.push(data);

					//esperar que busqui tots el contactes per tornar el resultat
					//si es fa fora del for, s'executa abans i no retorna res
					if(i == project.members.length)
						callback(null, result);
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
		}
		else return callback(null, project.items_list);
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