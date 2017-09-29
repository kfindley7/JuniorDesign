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
            db.collection("Cluster0").distinct("gameType")
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

    // Functionality for adding tiles to a game.
    // Changes the "game" field of all tiles to the "activityName" given.
    // Also sends back a list of tiles that couldn't be changed if necessary.

    // To use this, call socket.emit('add tiles to game', tiles) where tiles
    // is an array of tiles with all fields specified plus the activityName
    // of the activity to add the tiles to. To check if all tiles were added
    // successfully, call socket.on('all tiles added successfully', function() {...});.
    // To check if there were any failures or to get the list of tiles that failed to
    // be added, call socket.on('some tiles failed addition', function(failedTiles) {...});.
    socket.on('add tiles to game', function (tiles) {
        var flag = 0;
        var failedTiles = [];
        MongoClient.connect(uri, function (err, db) {
            tiles.forEach(function (item) {
                db.collection("Cluster0").findOne(
                    {
                        planet: item.planet,
                        planet_id: item.planet_id
                    }
                ).then(
                    function(data) {
                        if (data.game !== "FREE") {
                            db.close();
                            failedTiles.push(
                                {
                                    planet: item.planet,
                                    planet_id: item.planet_id,
                                    game: item.game,
                                    tile_id: item.tile_id
                                }
                            );
                            flag++;
                        } else {
                            db.collection("Cluster0").updateOne(
                                {
                                    planet: item.planet,
                                    planet_id: item.planet_id
                                },
                                {
                                    $set: {
                                        game: item.activityName
                                    }
                                }
                            );
                        }
                        db.close();
                    }
                );
            });
            if (flag === 0) {
                socket.emit('all tiles added successfully');
            } else {
                socket.emit('some tiles failed addition', failedTiles);
            }
        });
    });

    // Functionality for removing tiles from a game.
    // Changes the "game" field of a tile to "FREE".
    // Also sends back a list of tiles that couldn't be changed if necessary.

    // To use this, call socket.emit('remove tiles from game', tiles) where tiles
    // is an array of tiles with all fields specified plus the activityName
    // of the activity to add the tiles to. To check if all tiles were removed
    // successfully, call socket.on('all tiles removed successfully', function() {...});.
    // To check if there were any failures or to get the list of tiles that failed to
    // be removed, call socket.on('some tiles failed removal', function(failedTiles) {...});.
    socket.on('remove tiles from game', function (tiles) {
        var flag = 0;
        var failedTiles = [];
        MongoClient.connect(uri, function (err, db) {
            tiles.forEach(function (item) {
                db.collection("Cluster0").findOne(
                    {
                        game: item.activityName,
                        planet: item.planet,
                        planet_id: item.planet_id
                    }
                ).then(
                    function(data) {
                        if (data.game !== item.acivityName) {
                            db.close();
                            failedTiles.push(
                                {
                                    planet: item.planet,
                                    planet_id: item.planet_id,
                                    game: item.game,
                                    tile_id: item.tile_id
                                }
                            );
                            flag++;
                        } else {
                            db.collection("Cluster0").updateOne(
                                {
                                    planet: item.planet,
                                    planet_id: item.planet_id
                                },
                                {
                                    $set: {
                                        game: "FREE"
                                    }
                                }
                            );
                        }
                        db.close();
                    }
                );
            });
            if (flag === 0) {
                socket.emit('all tiles removed successfully');
            } else {
                socket.emit('some tiles failed removal', failedTiles);
            }
        });
    });

    // Functionality to retrieve used tiles and the activity they're used for
    // Searches for tiles in use and returns what they're being used for.

    // To use this, call socket.emit('give used tiles', planet) where planet
    // is the name of the planet wanting to be searched.
    // An array of used tiles will be returned to the caller. To receive
    // the array of used tiles, call socket.on('Used Tiles', function(data){...})
    socket.on('give used tiles', function (planet) {
        MongoClient.connect(uri, function(err, db) {
            db.collection("Cluster0").find(
                {
                    planet: planet
                },
                {
                    tile_id: false,
                    planet: false,
                    planet_id: true,
                    game: true
                }
            ).toArray(function(err, results) {
                var data = [];
                results.forEach(function (item) {
                    if (item.game !== "FREE") {
                        data.push(item);
                    }
                });
                db.close();
                socket.emit('Used Tiles', data);
            })
        })
    });
});