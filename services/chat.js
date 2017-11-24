module.exports = function(server){
	var io = require('socket.io')(server)

	var users = new Map();

	var numUsers = 0;

	io.on('connection', function (socket) {
	  var addedUser = false;

	  // when the client emits 'new message', this listens and executes
	  socket.on('new message', function (data) {
	    // we tell the client to execute 'new message'

	    var to_socketID = users.get(data.to);
	    if(to_socketID){
		    socket.broadcast.to(to_socketID).emit('new message', {
		      from: socket.username,
		      message: data.message
		    });
		}
	  });

	  // when the client emits 'add user', this listens and executes
	  socket.on('add user', function (username) {
	    if (addedUser) return;

	    // we store the username in the socket session for this client
	    socket.username = username;
	    ++numUsers;
	    users.set(username, socket.id);

	    addedUser = true;

	    socket.broadcast.emit('login', {
	      numUsers: numUsers
	    });
	    socket.broadcast.emit('user joined', {
	      from: socket.username,
	      numUsers: numUsers
	    });
	  });

	  socket.on('typing', function (data) {
	    var to_socketID = users.get(data.to);
	    socket.broadcast.to(to_socketID).emit('typing', {
	      from: socket.username
	    });
	  });

	  socket.on('stop typing', function (data) {
	    var to_socketID = users.get(data.to);
	    socket.broadcast.to(to_socketID).emit('stop typing', {
	      from: socket.username
	    });
	  });

	  // when the user disconnects.. perform this
	  socket.on('disconnect', function () {
	    if (addedUser) {
	      --numUsers;

	      users.delete(socket.username);

	      socket.broadcast.emit('user left', {
	        from: socket.username,
	        numUsers: numUsers
	      });
	    }
	  });
	});
}