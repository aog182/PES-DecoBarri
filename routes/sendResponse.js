sendRes = function(res, err, data, file){
	if(err)
		res.status(err.code).send(err.message);
	else if(file)
		res.sendFile(file);
	else
		res.status(200).send(data);
}

module.exports.sendRes = sendRes;