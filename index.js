'use strict';

var _ = require('lodash');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var PORT = process.env.PORT || 3000;

app.get('/', function(req, res){
	res.sendfile('public/index.html');
});

var rooms = ['global'];
var clients = {};
var num_users = 0;

io.on('connection', function(socket){
	console.log('a user connected');

	clients[socket.id] = 'user_no_'+num_users++;
	console.log(clients);

	var ctx = 'global';
	socket.join(ctx);

	socket.emit('msg', 'Welcome!');
	socket.emit('cmd', 'command');

	socket.on('msg', msgReceive);
	socket.on('cmd', cmdReceive);

	socket.on('disconnect', function(){
		console.log('deleting client: ' + socket.id);
		delete clients[socket.id];
		console.log('user disconnected');
	});
});


var cmdReceive = function(cmd){
	console.log('command received: ' + cmd);
	var ctx = 'global';
	io.to(ctx).emit('cmd', cmd);
};

var msgReceive = function(msg){
	console.log('message received: ' + msg);
	var ctx = 'global';
	io.to(ctx).emit('msg', msg);
};


app.use(express.static(__dirname + '/public'));

http.listen(PORT, function(){
	console.log('listening on port: '+PORT);
});
