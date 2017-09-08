/*
Kaley Findley
Tues. 9/5
*/

var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(8080);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket) {

    var MongoClient = require('mongodb').MongoClient;
    var uri = "mongodb://kfindley7:pztile17@cluster0-shard-00-00-na7zh.mongodb.net:27017,cluster0-shard-00-01-na7zh.mongodb.net:27017," +
        "cluster0-shard-00-02-na7zh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";

    // Query DB to check if user has entered correct credentials
    // send socket message accordingly - to each corresponding
    // socket message in main.js
    socket.on('login check', function (username, password) {
        MongoClient.connect(uri, function(err, db) {
            db.collection("Cluster0").findOne(
                {username: username, password: password}).then(
                    function (data) {
                        if (data) {
                            validUser = data.username;
                            validPass = data.password;
                            socket.emit('login success'); //cant this just be a 'user logged in' call?
                        } else {
                            socket.emit('login unsuccessful');
                        }
                    }
            );
            db.close();
        });
    });

    // user has successfully logged in and socket sends message to
    // show the home page now.
    socket.on('user logged in', function(username, password) {
        socket.username = username;
        socket.password = password;
        socket.emit('show home page');
    });

    // Query DB for the currently running games
    socket.on('get list of games', function () {
        MongoClient.connect(uri, function(err, db) {
            // commented out adding games to database manually: leave commented out unless
            // you want to add or delete games for testing purposes.

            // var aList = ['ESCAPE FROM MARS', 'MINING FOR RESOURCES', 'ROCKET JUMP',
            //     'SCAVENGER HUNT', 'SIMON SAYS', 'SPACEFOOD SQUEEZE', 'SPACE INVADERS',
            //     'SPACE TRIVIA', 'WHACK-A-MOLE', 'GALAGA', 'PACMAN'];
            //
            // for (var i = 0; i < aList.length; i++) {
            //     db.collection("Cluster0").insertOne({game: aList[i]});
            // }

            db.collection("Cluster0").distinct("game")
                .then(function(data) {
                    console.log("documents", data);
                    socket.emit('got games', data);
            });

            db.close();
        });
    });

    socket.on('register', function(username, password, secQ1, secA1, secQ2, secA2){
        MongoClient.connect(uri, function(err, db) {
            db.collection("Cluster0").findOne(
                {username: username}).then(
                    function (data) {
                        if (data) {
                           socket.emit('user already exists');
                           console.log(data);
                        } else {
                            db.collection("Cluster0").insertOne(
                                {
                                    username: username,
                                    password: password,
                                    question1: secQ1,
                                    answer1: secA1,
                                    question2: secQ2,
                                    answer2: secA2
                                }
                            );
                            socket.emit("register-successful");
                        }
                    }
            );

        });
    });
});