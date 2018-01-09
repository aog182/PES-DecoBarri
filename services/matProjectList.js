var db = require('../database/db');
var MatProjectList = db.model('MatProjectList');
var mongoose = require('mongoose');

var errorMessage = require('./error');

function findMatProjectListByParameter(parameter, callback){
    var error;
    MatProjectList.find(parameter, function(err, matProjectList){
        if(err){
            error = new errorMessage('Internal Server Error',500);
            return callback(error);
        }
        if(matProjectList.length === 0){
            error = new errorMessage('Material Project Lists not found', 404);
            return callback(error);
        }
        return callback(null, matProjectList);
    });
}

function findAllMatProjectList(callback){
    findMatProjectListByParameter({}, function(err, matProjectList){
        return callback(err, matProjectList);
    });
}

function findMaterialsOfProjectWithID(id, callback){
    var error;
    if(!id){
        error = new errorMessage('Material Project List _id required', 400);
        return callback(error, null);
    }

    findMatProjectListByParameter({'_id': id}, function (err, matProjectList) {
        if(err)
            return callback(err, null);
        return callback(err, matProjectList[0]);
    });
}

function getUrgentNeedList(id, callback) {
    findMaterialsOfProjectWithID(id, function (err, project) {
        if (err)
            return callback(err, null);
        return callback(null, project.urgent_need_list);
    });
}

function getNeedList(id, callback) {
    findMaterialsOfProjectWithID(id, function (err, project) {
        if(err)
            return callback(err);
        return callback(null, project.need_list);
    });
}

function getInventari(id, callback) {
    findMaterialsOfProjectWithID(id, function (err, project) {
        if(err)
            return callback(err);
        return callback(null, project.inventari);
    });
}

function addMatProjectList(project_id, callback){
    var error;
    if(!project_id){
        error = new errorMessage('Material Project List _id required', 400);
        return callback(error, null);
    }

    var matProjectList = new MatProjectList({
        _id: mongoose.Types.ObjectId(),
        project_id: project_id
    });

    matProjectList.save(function(err){
        if(err){
            error = new errorMessage('Internal Server Error',500);
        }
        return callback(error, "" + matProjectList._id);
    });

}

function addMaterialNeedList(id, material_id, urgent, callback){
    var error;
    if(!id) {
        error = new errorMessage('Material Project List _id required', 400);
        return callback(error);
    }
    if(!material_id) {
        error = new errorMessage('material_id required', 401);
        return callback(error);
    }
    if(!urgent) {
        error = new errorMessage('urgent status required', 402);
        return callback(error);
    }

    findMaterialsOfProjectWithID(id, function (err, matProjectList) {
        var error;
        if (err) {
            return callback(err);
        }
        else {
            if (urgent === "True" || urgent === "true" || urgent === true)
                matProjectList.urgent_need_list.push(material_id);
            else
                matProjectList.need_list.push(material_id);

            matProjectList.save(function (err) {
                if (err) {
                    error = new errorMessage('Internal Server Error', 500);
                }
                return callback(error);
            });
        }
    });
}

function addMaterialInventari(id, material_id, callback){
    var error;
    if(!id) {
        //console.log(id);
        error = new errorMessage('Material Project List _id required', 400);
        return callback(error);
    }
    if(!material_id) {
        error = new errorMessage('material_id required', 401);
        return callback(error);
    }

    findMaterialsOfProjectWithID(id, function (err, matProjectList) {
        var error;
        if (err) {
            return callback(err);
        }

        matProjectList.inventari.push(material_id);

        matProjectList.save(function (err) {
            if (err) {
                error = new errorMessage('Internal Server Error', 500);
            }
            return callback(error);
        });
    });
}


function editMatProjectList(id, project_id, callback){
    var error;
    if(!id) {
        error = new errorMessage('Material Project List _id required', 400);
        return callback(error);
    }
    if(!project_id){
        error = new errorMessage('project_id required', 400);
        return callback(error);
    }

    findMaterialsOfProjectWithID(id, function (err, matProjectList) {
        if (err) {
            return callback(err);
        }
        matProjectList.project_id = project_id;
        matProjectList.save(function(err){
            if (err) {
                error = new errorMessage('Internal Server Error', 500);
            }
            return callback(error);
        });
    });
}

function deleteMatProjectList(id, callback){
    var error;
    if(!id) {
        error = new errorMessage('Material Project List _id required', 400);
        return callback(error, null, null);
    }

    findMaterialsOfProjectWithID(id, function(err, matProjectList){
        if(err) {
            if (err.code !== 404) //No fa falta esborrar el que no existeix
                return callback (null, null)
            else
                return callback(err, null);
        }

        matProjectList.remove(function(err){
            if(err){
                error = new errorMessage('Internal Server Error', 500);
            }
            return callback(error, matProjectList);
        });
    });
}


function deleteAllMaterialProjectLists(sure, callback){
    var error;
    if(sure != "true") {
        error = new errorMessage('You sure? You must say true', 400);
        return callback(error);
    }
    MatProjectList.remove(function(err){
        if (err) {
            error = new errorMessage('Internal Server Error', 500);
        }
        return callback(error);
    });
}

function deleteMaterialNeedList(id, material_id, urgent, callback){
    var error;
    if(!id) {
        error = new errorMessage('Material Project List _id required', 400);
        return callback(error, null);
    }
    if(!material_id) {
        error = new errorMessage('material_id required', 401);
        return callback(error, null);
    }
    /*
    if(!urgent) {
        error = new errorMessage('urgent status required', 402);
        return callback(error, null);
    }*/

    findMaterialsOfProjectWithID(id, function (err, matProjectList) {
        var error;
        if (err) {
            error = new errorMessage('Internal Server Error', 500);
            return callback(error);
        }
        if(matProjectList.length === 0){
            error = new errorMessage('Material Project List not found.', 404);
            return callback(error);
        }

        matProjectList.urgent_need_list.pull(material_id);
        matProjectList.need_list.pull(material_id);

        matProjectList.save(function (err) {
            if (err) {
                error = new errorMessage('Internal Server Error', 500);
            }
            return callback(error);
        });
    });
}

function deleteMaterialInventari(id, material_id, callback){
    var error;
    if(!id) {
        error = new errorMessage('Material Project List _id required', 400);
        return callback(error);
    }
    if(!material_id) {
        error = new errorMessage('material_id required', 401);
        return callback(error);
    }

    findMaterialsOfProjectWithID(id, function (err, matProjectList) {
        var error;
        if (err) {
            error = new errorMessage('Internal Server Error', 500);
            return callback(error);
        }
        if(matProjectList.length === 0){
            error = new errorMessage('Material Project List not found.', 404);
            return callback(error, null);
        }

        matProjectList.inventari.pull(material_id);

        matProjectList.save(function (err) {
            if (err) {
                error = new errorMessage('Internal Server Error', 500);
            }

            return callback(error);
        });
    });
}


module.exports.findAllMatProjectList = findAllMatProjectList;
module.exports.findMaterialsOfProjectWithID = findMaterialsOfProjectWithID;
module.exports.getUrgentNeedList = getUrgentNeedList;
module.exports.getNeedList = getNeedList;
module.exports.getInventari = getInventari;
module.exports.addMatProjectList = addMatProjectList;
module.exports.addMaterialNeedList = addMaterialNeedList;
module.exports.addMaterialInventari = addMaterialInventari;
module.exports.editMatProjectList = editMatProjectList;
module.exports.deleteMatProjectList = deleteMatProjectList;
module.exports.deleteAllMaterialProjectLists = deleteAllMaterialProjectLists;
module.exports.deleteMaterialNeedList = deleteMaterialNeedList;
module.exports.deleteMaterialInventari = deleteMaterialInventari;
