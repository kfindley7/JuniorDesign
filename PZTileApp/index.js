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
    // socket message in home_page.js
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

    socket.on('clear all', function() {
        MongoClient.connect(uri, function (err, db) {
            db.collection("Cluster0").deleteMany({});
            db.close();
            console.log("DATABASE CLEARED!");
        });
    });

    socket.on('add game types', function() {
        MongoClient.connect(uri, function (err, db) {
            db.collection("Cluster0").insertMany([{gameType: "ESCAPE FROM MARS"}, {gameType: "ROCKET JUMP"},
                {gameType: "SPACE INVADERS"}, {gameType: "WHACK-A-MOLE"}, {gameType: "GALAGA"},
                {gameType: "SIMON SAYS"}, {gameType: "SPACEFOOD SQUEEZE"}, {gameType: "PACMAN"},
                {gameType: "SCAVENGER HUNT"}, {gameType: "SPACE TRIVIA"}]);
            db.close();
            console.log("GAME TYPES RE-ENTERED");
        });
    });

    socket.on('add tiles', function() {
        MongoClient.connect(uri, function (err, db) {
            // ---Right now this is just for adding the prototype---
            //
            // Commented out because the planet_id indexing system is different
            //
            // var siteList = [["Prototype", 7], ["Earth", 425], ["Moon", 55], ["Mars", 121], ["ISS", 117]];
            // var aList = ["a", "b", "c", "d"];
            // var tiles = [];
            // for (var i = 0; i < siteList.length; i++) {
            //     var tileNum = 1;
            //     for (var j = 0; j < siteList[i][1]; j++) {
            //         var tile = {tile_id: aList[i] + "00" + tileNum.toString(),
            //             planet: siteList[i][0], planet_id: tileNum, game: "FREE"};
            //         tiles.push(tile);
            //         tileNum++;
            //     }
            // }
            var tiles = [];
            var xcoords = [1,2,0,1,2,1,2];
            var ycoords = [0,0,1,1,1,2,2];


            for (var j = 0; j < 7; j++) {
                var tileNum = (1000*xcoords[j]+ycoords[j]);
                var tile = {
                    tile_id: "a" + tileNum.toString(),
                    planet: "Prototype", planet_id: tileNum, game: "FREE"
                };
                tiles.push(tile);
                tileNum++;
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
        })
    });

    socket.on('add user manually', function () {
        MongoClient.connect(uri, function (err, db) {
            db.collection("Cluster0").insertOne({username: "admin", password: "pztiles17",
                question1: "Favorites", answer1: "yellow jackets", question2: "Work", answer2: "publix"
            });
            db.close();
        })
    });

    socket.on('show user', function() {
        MongoClient.connect(uri, function (err, db) {
            db.collection("Cluster0").findOne({username: "admin", password: "pztiles17",
                question1: "Favorites", answer1: "yellow jackets", question2: "Work", answer2: "publix"
            }).then(function (user) {
                db.close();
                socket.emit('user', user);
            })
        })
    })


    // Functionality for adding tiles to a game.
    // Changes the "game" field of all tiles to the "activityName" given.
    // Also sends back a list of tiles that couldn't be changed if necessary.

    // To use this, call socket.emit('add tiles to game', tiles) where tiles
    // is an array of tiles with all fields specified plus the activityName
    // of the activity to add the tiles to. To check if all tiles were added
    // successfully, call socket.on('all tiles added successfully', function() {...});.
    // To check if there were any failures or to get the list of tiles that failed to
    // be added, call socket.on('some tiles failed addition', function(failedTiles) {...});.
    socket.on('add tiles to game', function (tiles, activityName) {
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
                        }
                    }
                );
                db.collection("Cluster0").updateOne(
                    {
                        planet: item.planet,
                        planet_id: item.planet_id
                    },
                    {
                        $set: {
                            game: activityName
                        }
                    }
                );
            });
            db.close();
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
                        game: item.game,
                        planet: item.planet,
                        planet_id: item.planet_id
                    }
                ).then(
                    function(data) {
                        if (data.game !== item.game) {
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
                        }
                    }
                );
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
            });
            db.close();
            if (flag === 0) {
                socket.emit('all tiles removed successfully');
            } else {
                socket.emit('some tiles failed removal', failedTiles);
            }
        });
    });

    // Functionality to retrieve all tiles in a planet and return them
    // all within 3 different arrays. Specifically, free is the array with
    // tiles not used for any games, inMine is the array with tiles used
    // for the activity of interest, and usedOthers is the array with all
    // tiles being used for an activity that isn't the activity of interst.
    // Searches for tiles in use and returns what they're being used for.

    // To use this, call socket.emit('give all tiles', planet, activityName)
    // here planet is the name of the planet wanting to be searched.
    // Three arrays of all tiles will be returned to the caller. To receive
    // the arrays of used tiles, call
    // socket.on('Used Tiles', function(free, inMine, usedOthers){...});.
    socket.on('give all tiles', function (planet, activityName) {
        MongoClient.connect(uri, function(err, db) {
            db.collection("Cluster0").find(
                {
                    planet: planet
                },
                {
                    tile_id: true,
                    planet: true,
                    planet_id: true,
                    game: true
                }
            ).toArray(function(err, results) {
                var usedOthers = [];
                var inMine = [];
                var free = [];
                results.forEach(function (item) {
                    if (item.game === "FREE") {
                        free.push(item);
                    } else if (item.game === activityName) {
                        inMine.push(item);
                    } else {
                        usedOthers.push(item);
                    }
                });
                socket.emit('Used Tiles', free, inMine, usedOthers);
            });
            db.close();
        })
    });
});