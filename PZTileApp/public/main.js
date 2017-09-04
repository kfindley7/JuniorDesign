$(function() {
    var $usernameInput = $('.js-username');
    var $passwordInput = $('.js-password');

    var username;
    var password;
    var currentGames;

    var $loginButton = $('.js-login');
    var $listGames = $('.js-list-of-games');

    var socket = io();

    function loginAttempt() {
        username = $usernameInput.val();
        password = $passwordInput.val();

        //query mongodb
        console.log("USERNAME ", username);

        socket.emit('login check', username, password);

        if (username && password) {
            // $homePage.show();
            // $loginPage.off('click');
            console.log("HI");
            socket.emit('login check', username, password);
            // $(window).location = 'home-page.html';
            // socket.emit('get list of games');
        }
    }

    $loginButton.click(function() {
        loginAttempt();
    });

    socket.on('login success', function () {
        socket.emit('user logged in', username, password);
    });

    // var listOfGames = ['ESCAPE FROM MARS', 'MINING FOR RESOURCES', 'ROCKET JUMP',
    //     'SCAVENGER HUNT', 'SIMON SAYS', 'SPACEFOOD SQUEEZE', 'SPACE INVADERS',
    //     'SPACE TRIVIA', 'WHACK-A-MOLE', 'GALAGA', 'PACMAN'];

    function showGames(aList) {
        var start = 2;
        var img = 1;
        for (var i = 0; i < aList.length; i++) {
            $listGames.append("<div class=\"element js-game1\"><p style=\"padding-left: 0.5%\" class=\"text text-" + start + "\">" + aList[i] + "</p>\n" +
                "      <p class=\"text text-" + (start + 1) + "\"><span>Edit Game</span></p>\n" +
                "      <img class=\"image image-1\" src=\"android-arrow-dropright.png\">\n" +
                "    </div>");
            start += 2;
            img++;
        }
    }

    socket.on('show home page', function () {
        console.log("HOME PAGE");
        window.location = 'home-page.html';
        // socket.emit('get list of games');
    });

    $.fn.getGames = function () {
        socket.emit('get list of games');
        socket.on('got games', function (games) {
            showGames(games);
        });
    };

});

// var MongoClient = require('mongodb').MongoClient;
//
// var uri = "mongodb://kfindley7:pztile17@cluster0-shard-00-00-na7zh.mongodb.net:27017,cluster0-shard-00-01-na7zh.mongodb.net:27017," +
//     "cluster0-shard-00-02-na7zh.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
// // MongoClient.connect(uri, function(err, db) {
// //     //var obj = {username: "kfindley7", password: "pztile17", email: "kfindleygt@gmail.com"};
// //     //db.collection("Cluster0").insertOne(obj);
// //     db.collection("Cluster0").findOne("kfindley7");
// //     db.close();
// // });
// // console.log("Connection Successful!!");
//
//
// function loginCheck() {
//     var usernameInput = document.getElementById("username");
//     var userPassword = document.getElementById("password");
//     MongoClient.connect(uri, function(err, db) {
//         var validUsers = db.find({ $and: [{"username": usernameInput, "password": userPassword}]},
//             {"username": 1, "password": 1, "email": 0});
//         if (validUsers) {
//             console.log(validUsers.username);
//         }
//         db.close();
//     })
// }



