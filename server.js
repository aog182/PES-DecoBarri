var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var expressJWT = require('express-jwt')

require('./config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors());

//app.use(expressJWT({secret:global.secret}).unless({path:['/user/login','/user/add']}));
 
app.set('port', (process.env.PORT || 5000));

require('./database/db');
require('./models/project');
require('./models/user');
require('./models/material');
require('./models/matGroupList');
require('./routes/user')(app);
require('./routes/project')(app);
require('./routes/material')(app);
require('./routes/matGroupList')(app);
 
app.get('/', function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
  	res.send('Hello World');
});


app.post('/a', function(req, res) {
	console.log(req.body.message);
	var response = "hola " + req.body.message.nombre;
	res.json(response);
});
 

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
