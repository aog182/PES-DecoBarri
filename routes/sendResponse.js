sendRes = function(res, err, data, picture){
	if(err)
		res.status(err.code).send(err.message);
	else if(picture){
		res.contentType("image/png");
		res.status(200).send(picture);
	}
	else
		res.status(200).send(data);
}

module.exports.sendRes = sendRes;