/*
Kaley Findley
Mon. 8/28


Commented out the serial port functionality so you don't need the actual Arduino
to run the app itself. This functionality will soon go away once Matt gives us access.
*/

var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(8080);

// start the server:
// var server = app.listen(8080);
// start the listeners for GET requests:

app.use(express.static(path.join(__dirname, 'public')));
// app.use('/',express.static('public'));   // set a static file directory
// app.get('/device/:channel', getSensorReading);	// GET handler for /device


io.on('connection', function(socket) {

    socket.on('user logged in', function(username, password) {
        socket.username = username;
        socket.password = password;
        console.log("LOGGED IN");
        socket.broadcast.emit('show home page');
    });

    socket.on('get list of games', function () {
        // query mongo db for games
        console.log("GAMESSSSSSSs");
        socket.broadcast.emit('got games', ['ESCAPE FROM MARS', 'MINING FOR RESOURCES', 'ROCKET JUMP',
            'SCAVENGER HUNT', 'SIMON SAYS', 'SPACEFOOD SQUEEZE', 'SPACE INVADERS',
            'SPACE TRIVIA', 'WHACK-A-MOLE', 'GALAGA', 'PACMAN']);
    });
});