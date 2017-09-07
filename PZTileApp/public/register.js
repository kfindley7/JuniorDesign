/*
* Kaley Findley
* Tues. 9/5
* */

$(function() {
    var $usernameInput = $('.js-username');
    var $passwordInput = $('[id=password]');
    var $confirmPassInput = $('[id=confirm-password]');

    var $registerButton = $('.js-register');
    var $secQuest1 = $('[id=question1]');
    var $secAnswer1 = $('[id=answer1]');

    var socket = io();

    function registerAttempt() {
        var username = $usernameInput.val();
        var password = $passwordInput.val();
        var confirm = $confirmPassInput.val();

        if(username && password && confirm){

            if(password === confirm){
                var question1 = $secQuest1.val();
                var answer1 = $secAnswer1.val();
                socket.emit('register', username, password, question1, answer1);
            } else{
                window.alert("Passwords do not match");
            }
        } else {
            window.alert("Please enter all values");
        }
    }

    socket.on('user already exists', function () {
        window.alert("That user already exists")
    })

    $registerButton.click(function(){
        registerAttempt();
    });

    socket.on('register-successful', function(){
       window.location = 'index.html';
    });

});