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
    var $secQuest2 = $('[id=question2]');
    var $secAnswer2 = $('[id=answer2]');

    var socket = io();

    function registerAttempt() {
        var username = $usernameInput.val();
        var password = $passwordInput.val();
        var confirm = $confirmPassInput.val();
        var question1 = $secQuest1.val();
        var answer1 = $secAnswer1.val();
        var question2 = $secQuest2.val();
        var answer2 = $secAnswer2.val();

        if(username && password && confirm && answer1 && answer2){

            if(password === confirm){
                socket.emit('register', username, password, question1, answer1, question2, answer2);
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