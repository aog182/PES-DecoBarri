var db = require('../database/db');
var Project = db.model('Project');

var errorMessage = require('./error')

function findProjectByParameter(parameter, callback){
	Project.find(parameter, function(err, projects){
		if(err){
			var error = new errorMessage('Internal Server Error',500);
			return callback(error);
		}
		if(projects.length == 0){
			var error = new errorMessage('Projects not found', 404);
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

module.exports.findAllProjects = findAllProjects;
module.exports.findProjectByID = findProjectByID;
