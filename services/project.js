var db = require('../database/db');
var Project = db.model('Project');
var mongoose = require('mongoose');
var stringSimilarity = require('string-similarity');
var serviceMatProjectList = require('../services/matProjectList');

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

function addProject(name, theme, description, city, address,  lat, lng, callback){
	var project = new Project({
		_id: mongoose.Types.ObjectId(),
		name: name,
		theme: theme,
		description: description,
		city: city,
		address: address, 
		lat: lat,
		lng: lng,
        material_id: null
	});

	project.save(function(err){
		if(err){
			var error = new errorMessage('Internal Server Error',500);
			return callback(error);
		}

        serviceMatProjectList.addMatProjectList(project._id,function(err, material_id) {
            if (err) {
                var error = new errorMessage('Internal Server Error',500);
                return callback(error, null);
            }
            else {
                project.material_id = material_id;
                project.save();
                callback(null, project._id);
            }
        });
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

        project.remove(function(err){
			if(err){
				serviceMatProjectList.addMatProjectList(material.project_id, null);
                //El callback d'error, si hi fos es crida des de DINS d'addMatProjectList
			}
			return callback(null, 'Project deleted');
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
		if(index !== -1){
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
		if(index === -1){
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