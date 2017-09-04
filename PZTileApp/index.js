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

    var MongoClient = require('mongodb').MongoClient;

    var uri = "mongodb://kfindley7:pztile17@cluster0-shard-00-00-na7zh.mongodb.net:27017,cluster0-shard-00-01-na7zh.mongodb.net:27017," +
        "cluster0-shard-00-02-na7zh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";

    socket.on('login check', function (username, password) {
        MongoClient.connect(uri, function(err, db) {
            //var obj = {username: "kfindley7", password: "pztile17", email: "kfindleygt@gmail.com"};
            //db.collection("Cluster0").insertOne(obj);
            var myCursor = db.collection("Cluster0").findOne(
                {username: username, password: password}).then(
                    function (data) {
                        validUser = data.username;
                        validPass = data.password;
                        socket.emit('login success');
                    }
            );
            db.close();
        });

    });

    socket.on('user logged in', function(username, password) {
        socket.username = username;
        socket.password = password;
        socket.emit('show home page');
    });

    socket.on('get list of games', function () {
        // query mongo db for games
        socket.emit('got games', ['ESCAPE FROM MARS', 'MINING FOR RESOURCES', 'ROCKET JUMP',
            'SCAVENGER HUNT', 'SIMON SAYS', 'SPACEFOOD SQUEEZE', 'SPACE INVADERS',
            'SPACE TRIVIA', 'WHACK-A-MOLE', 'GALAGA', 'PACMAN']);
    });
});