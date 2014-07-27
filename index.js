'use strict';

var _ = require('lodash');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var colors = require('colors');

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

// custom commands
var commands = {
	'list' : {
		desc: 'list active users', 
		action: function(req){
				var data = {};
				data.str = '['+_.keys(clients).join(',')+']';
				data.value = data.str;
				return data;
			}
		},
	'color': {
		desc: 'change color',
		action: function(req){
			var data = {};
			var color = req.value;
			data.value = color;
			data.str = data.value;
			return data;
		}
	}
};

var cmdReceive = function(cmd){
	var cmdName = _.isString(cmd) ? cmd : cmd.name;
	console.log('command received: '.yellow + cmdName);
	var ctx = 'global';

	if (_.isString(cmd)) {
		io.to(ctx).emit('cmd', cmd);
	} else {
		if (_.contains(_.keys(commands), cmdName)) {
			var _cmd = commands[cmdName];
			console.log('predefined command: '.yellow + cmdName + ': ' + _cmd.desc);

			console.log(cmd);
			var cmdObj = {
				name: cmd.name,
				data: _cmd.action(cmd.data)
			};

			io.to(ctx).emit('cmd', cmdObj);
		}
	}
};

var msgReceive = function(msg){
	console.log('message received: '.cyan + msg);
	var ctx = 'global';
	io.to(ctx).emit('msg', msg);
};


app.use(express.static(__dirname + '/public'));

http.listen(PORT, function(){
	console.log('listening on port: '+PORT);
});
