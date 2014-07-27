'use strict';

var socket = io();

var $cmd = $('#cmd');
var $msg = $('#msg');


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
	console.log('received command: ' + cmd);
	var $el = $('<div>').text(cmd);
	$('#cmds').prepend($el);
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


function init() {
	$('#cmd-form').submit(postCmd);
	socket.on('cmd', receiveCmd);

	$('#msg-form').submit(postMsg);
	socket.on('msg', receiveMsg);
}

init();
