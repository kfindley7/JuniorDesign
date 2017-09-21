/*
Kaley Findley
Tues. 9/5
Modified by John Berry September 8, 2017.
    * added socket.on('create activity', ...)
    * added socket.on('get activities', ...)
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
                            db.close();
                            socket.emit('show home page');
                        } else {
                            db.close();
                            socket.emit('login unsuccessful');
                        }
                    }
            );
        });
    });


    // Query DB for the currently running games
    socket.on('get list of games', function () {
        MongoClient.connect(uri, function(err, db) {
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
                            db.close();
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
                            db.close();
                            socket.emit("register-successful");
                        }
                    }
            );
        });
    });

    socket.on('recover-check-user', function (username) {
        MongoClient.connect(uri, function (err, db) {
            db.collection("Cluster0").findOne(
                {username: username}).then(
                function (data) {
                    if (data) {
                        socket.emit('recover-user-exists');
                    } else {
                        socket.emit('recover-no-user');
                    }
                }
            );
            db.close();
        })
    });

    socket.on('get-security-questions', function (username) {
        MongoClient.connect(uri, function (err, db) {
            db.collection("Cluster0").findOne(
                {username: username}).then(
                function (data) {
                    if (data) {
                        var question1 = data.question1;
                        var question2 = data.question2;
                        socket.emit('load-security-questions', question1, question2);
                    }
                }
            );
            db.close();
        });
    });
    // Functionality for creating the games.
    // First checks to see if the activity and activity name combination already exist
    // If the combination does exist, then the creation fails and the user is notified.
    // Else store the combination in the database and alert the user to successful creation.
    socket.on('create activity', function (activity, activityName) {
        MongoClient.connect(uri, function(err, db) {
            db.collection("Cluster0").findOne(
                {
                    activity: activity,
                    activityName: activityName
                }
                ).then( function(data) {
                        if (data)  {
                            db.close();socket.emit('activity creation failed');
                            console.log(data);
                        } else {
                            db.collection("Cluster0").insertOne(
                                {
                                    activity: activity,
                                    activityName: activityName
                                }
                            );
                            db.close();
                            socket.emit('activity created');
                        }
                    });
            });

    });


    // Sends a list of current activities to the client.
    socket.on('get activities', function () {
        MongoClient.connect(uri, function(err,db) {
            db.collection("Cluster0").find({}, {_id: false, activity: true, activityName: true})
                .toArray(function(err, results){
                    var data = [];
                    results.forEach(function (item) {
                        if (Object.keys(item).length > 0) {
                            data.push(item);
                        }
                    });
                    db.close();
                    socket.emit('activity list', data);
            });
        })
    });

    socket.on('validate-security-answers', function (username, ans1, ans2) {
        MongoClient.connect(uri, function (err, db) {
            db.collection("Cluster0").findOne(
                {username: username}).then(
                function (data) {
                    if (data) {
                        if(ans1===data.answer1 && ans2===data.answer2){
                            socket.emit('correct-security-answers');
                        } else {
                            socket.emit('wrong-security-answers');
                        }
                    }
                });
            db.close();
        })
    });

    socket.on('update password', function (password, username) {
        MongoClient.connect(uri, function (err, db) {
            db.collection("Cluster0").updateOne(
                {username: username},
                {
                    $set: {password: password}
                }
            );
            db.close();
        })
    });

    socket.on('clear all', function() {
        MongoClient.connect(uri, function (err, db) {
            db.collection("Cluster0").deleteMany({});
            db.close();
            console.log("DATABASE CLEARED!");
        });
    });

    socket.on('add game types', function() {
        MongoClient.connect(uri, function (err, db) {
            db.collection("Cluster0").insertMany([{game: "ESCAPE FROM MARS"}, {game: "ROCKET JUMP"},
                {game: "SPACE INVADERS"}, {game: "WHACK-A-MOLE"}, {game: "GALAGA"},
                {game: "SIMON SAYS"}, {game: "SPACEFOOD SQUEEZE"}, {game: "PACMAN"},
                {game: "SCAVENGER HUNT"}, {game: "SPACE TRIVIA"}]);
            db.close();
            console.log("GAME TYPES RE-ENTERED");
        });
    });

    socket.on('add tiles', function() {
        MongoClient.connect(uri, function (err, db) {
            var siteList = [["Earth", 425], ["Moon", 55], ["Mars", 121], ["ISS", 117]];
            var aList = ["a", "b", "c", "d"];
            var tiles = [];
            for (var i = 0; i < siteList.length; i++) {
                var tileNum = 1;
                for (var j = 0; j < siteList[i][1]; j++) {
                    var tile = {tile_id: aList[i] + "00" + tileNum.toString(),
                        planet: siteList[i][0], planet_id: tileNum, game: "FREE"};
                    tiles.push(tile);
                    tileNum++;
                }
            }
            db.collection("Cluster0").insertMany(tiles);
            db.close();
        });
    });

    socket.on('get tiles', function () {
        MongoClient.connect(uri, function (err, db) {
            var tile_id = db.collection("Cluster0").distinct("tile_id").then(function(data) {
                console.log(data);
                socket.emit('tile list', data.length);
            });

            var planets = db.collection("Cluster0").distinct("planet")
                .then(function (planets) {
                    console.log(planets);
                });
            db.close();
        })
    })

});