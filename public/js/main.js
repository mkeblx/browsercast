'use strict';

var socket = io();

var $cmd = $('#cmd');
var $msg = $('#msg');

var commands = {
	'list': {
		description: 'list users',
		action: function(data){
			var $el = $('<div>').text(data.value);
			$('#cmds').prepend($el);
		}
	},
	'color': {
		description: 'change background color',
		action: function(data){
			console.log(data);
			$('body').css('background-color', data.value);
		}
	}
};

function postCmd() {
	var val = $cmd.val().trim();
	if (val != '') {
		sendCmd(val);
		$cmd.val('');
	}
	return false;
}
function sendCmd(cmd) {
	console.log('sending command: ' + cmd);
	socket.emit('cmd', cmd);
}
function receiveCmd(cmd) {
	var cmdName = _.isString(cmd) ? cmd : cmd.name;
	console.log('received command: ' + cmdName);

	if (_.isString(cmd)) {
		var $el = $('<div>').text(cmd);
		$('#cmds').prepend($el);
	} else {
		if (_.contains(_.keys(commands), cmdName)) {
			var _cmd = commands[cmdName];
			_cmd.action(cmd.data);
		} else {
			console.log('unknown command');
		}
	}
}

function postMsg(){
	var val = $msg.val().trim();
	if (val != '') {
		sendMsg(val);
		$msg.val('');
	}

	return false;
}
function sendMsg(msg) {
	console.log('sending message: ' + msg);
	socket.emit('msg', msg);
}
function receiveMsg(msg) {
	console.log('received message: ' + msg);
	var $el = $('<div>').text(msg);
	$('#msgs').prepend($el);
}


function joinRoom(name) {
	var hash = window.location.hash.substr(1);
	if (hash == '') {
		hash = 'room'+Math.round(Math.random()*1000);
		window.location.hash = hash;
	}

	socket.emit('joinRoom', hash);
}


function init() {
	joinRoom();

	$('#cmd-form').submit(postCmd);
	socket.on('cmd', receiveCmd);

	$('#msg-form').submit(postMsg);
	socket.on('msg', receiveMsg);

	// custom commands
	$('#container').on('click', '.cmd', function(ev){
		var $this = $(this);

		var cmd = $this.data('value');
		var cmdObj = {
			name: cmd,
			data: {
				value: null
			}
		};

		if (cmd == 'color') {
			cmdObj.data.value = $('#color-param').val();
		}

		sendCmd(cmdObj);
	});
}

init();
