sendRes = function(res, err, data){
	if(err)
		res.status(err.code).send(err.message);
	else
		res.status(200).send(data);
}

module.exports.sendRes = sendRes;