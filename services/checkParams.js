check = function(res, params, params_name){
	for(var i = 0; i < params.length; ++i){
		if(!params[i]){
			return errorMessage(params_name[i] + ' required', 400);
		}
	}
}

module.exports.check = check;