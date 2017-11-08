/*
* William Hornsby
* Sat. 10/14
* */

$(function() {
    var $usernameInput = $('.js-username');
    var $passwordInput = $('.js-password');
    var $registerButton = $('[id=register-button]');
    var $forgotPasswordButton = $('[id=forgot-password]');

    var username;
    var password;

    var $loginButton = $('.js-login');

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

    $registerButton.click(function(){
       window.location = 'Register.html'
    });

    $forgotPasswordButton.click(function(){
       window.location = 'recover-password.html'
    });

    $("#password").keyup(function(event){
        if(event.keyCode == 13){
            $("#login").click();
        }
    });

    socket.on('login unsuccessful', function() {
        // put some pop up here to alert user of login failure
        alert("Login Failure! Incorrect username or password. Please try again.");
    });

    // receives show home page message from index.js and switches to that page
    socket.on('show home page', function () {
        console.log("HOME PAGE");
        window.location = 'home-page.html';
    });

});