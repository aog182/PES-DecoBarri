var express = require('express')
var app = express()
var server = require('http').createServer(app)
var cors = require('cors')
var bodyParser = require('body-parser')
var expressJWT = require('express-jwt')



var path = require('path')

var busboy = require('connect-busboy')

require('./config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors());

app.use(busboy());



//app.use(expressJWT({secret:global.secret}).unless({path:['/user/login','/user/add']}));
 
/*
app.use(function(err, req, res, next){
	if(err){
		if(err.name == 'UnauthorizedError')
			return res.status(403).send('Forbidden')
	}
});

if(req.headers.authorization){
	//el header es de la forma-> name: authorization, value: Bearer token
	var token = req.headers.authorization.split(' ')[1];
	var decoded = jwt_decode(token);
	console.log(decoded._id);
}*/

app.set('port', (process.env.PORT || 5000));

require('./database/db');
require('./models/project');
require('./models/user');
require('./models/material');
require('./models/matProjectList');
require('./models/projects_tags');
require('./routes/user')(app);
require('./routes/project')(app);
require('./routes/material')(app);
require('./routes/matProjectList')(app);

require('./services/chat')(server);
 
app.get('/', function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
  	res.send('Hello World');
});


app.post('/a', function(req, res) {
	console.log(req.body.message);
	var response = "hola " + req.body.message.nombre;
	res.json(response);
});

app.get('/chat', function(req,res){
	res.sendFile(process.env.PWD + '/test-chat/index.html');
});

app.get('/main.js', function(req,res){
	res.sendFile(process.env.PWD + '/test-chat/main.js');
});

app.get('/style.css', function(req,res){
	res.sendFile(process.env.PWD + '/test-chat/style.css');
});

app.post('/jeje', function(req,res){
	console.log(req);
	console.log(req.body.image);
	res.send(req.body.image);
});


app.get('/upload', function(req, res){
	res.sendFile(path.resolve('../index.html'));
});

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
