/*
* Kaley Findley
* Tues. 9/5
* */

$(function() {
    var $usernameInput = $('.js-username');
    var $passwordInput = $('.js-password');
    var $logoutButton = $('.js-logout-button');

    var username;
    var password;

    var $loginButton = $('.js-login');
    var $listGames = $('.js-list-of-games');

    var socket = io();

    // check is login credentials are correct
    // send socket message 'login check' to index.js in order to query DB
    function loginAttempt() {
        username = $usernameInput.val();
        password = $passwordInput.val();

        if (username && password) {
            socket.emit('login check', username, password);
        } else {
            alert("Please enter your username and password.");
        }
    }

    // when a user clicks the login button, start login check functionality
    $loginButton.click(function() {
        loginAttempt();
    });

    $logoutButton.click(function() {
        var userConfirm = confirm("Are you sure you want to logout? Any unsaved changes will be lost.");
        if (userConfirm) {
            window.location = "index.html";
        }
    });


    socket.on('login unsuccessful', function() {
        // put some pop up here to alert user of login failure
        alert("Login Failure! Incorrect username or password. Please try again.");
    });

    // add games to home-page.html after querying the DB
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

    // receives show home page message from index.js and switches to that page
    socket.on('show home page', function () {
        console.log("HOME PAGE");
        window.location = 'home-page.html';
    });

    // this function is called directly through the html to ensure
    // home page is fully loaded before html is updated with games
    $.fn.getGames = function () {
        socket.emit('get list of games');
        socket.on('got games', function (games) {
            showGames(games);
        });
    };

});