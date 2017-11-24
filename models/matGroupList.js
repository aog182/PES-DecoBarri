var mongoose = require('mongoose');

var MatProjectList = new mongoose.Schema({
	project_id : {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
	//llista materials que el pojecte necessita urgentment
	urgent_need_list : [{type: mongoose.Schema.Types.ObjectId, ref: 'Material'}], 
	//llista materials que el pojecte necessita
	need_list : [{type: mongoose.Schema.Types.ObjectId, ref: 'Material'}], 
	//llista materials que el projecte té
	inventari : [{type: mongoose.Schema.Types.ObjectId, ref: 'Material'}] 
});

module.exports = mongoose.model('MatProjectList', MatProjectList);

