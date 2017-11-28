var serviceUser = require('./user');

module.exports = function(server){
	var io = require('socket.io')(server)

	var users = new Map();

	var numUsers = 0;

	io.on('connection', function (socket) {
	  var addedUser = false;

	  // when the client emits 'new message', this listens and executes
	  socket.on('new message user', function (to, message) {
	    // we tell the client to execute 'new message'

	    var to_socketID = users.get(to);
	    if(to_socketID){
		    socket.broadcast.to(to_socketID).emit('new message user', socket.username, message);
		}
		//else?
	  });

	  socket.on('new message group', function(project, message){
	  	socket.to(project).emit('new message group',project, socket.username, message);
	  });

	  // when the client emits 'add user', this listens and executes
	  socket.on('add user', function (username) {
	    if (addedUser) return;

	    serviceUser.showMyProjects(username, function(err, projects){
	    	if(!err)	
	  			socket.join(projects);
	    });

	    // we store the username in the socket session for this client
	    socket.username = username;
	    ++numUsers;
	    users.set(username, socket.id);

	    addedUser = true;

	    socket.broadcast.emit('login', numUsers);
	    socket.broadcast.emit('user joined', socket.username, numUsers);
	  });

	  socket.on('typing', function (to) {
	    var to_socketID = users.get(to);
	    socket.broadcast.to(to_socketID).emit('typing', socket.username);
	  });

	  socket.on('stop typing', function (to) {
	    var to_socketID = users.get(to);
	    socket.broadcast.to(to_socketID).emit('stop typing', socket.username);
	  });

	  socket.on('disconnect', function () {
	    if (addedUser) {
	      --numUsers;

	      users.delete(socket.username);

	      socket.broadcast.emit('user left', socket.username,numUsers);
	    }
	  });
	});
}