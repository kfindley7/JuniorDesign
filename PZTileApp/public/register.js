/*
* William Hornsby
* Thur. 9/7
* */

$(function() {
    var $usernameInput = $('.js-username');
    var $passwordInput = $('[id=password]');
    var $confirmPassInput = $('[id=confirm-password]');
    var $secQuest1 = $('[id=question1]');
    var $secAnswer1 = $('[id=answer1]');
    var $secQuest2 = $('[id=question2]');
    var $secAnswer2 = $('[id=answer2]');

    var $registerButton = $('.js-register');
    var $backButton = $('[id=back-button]');

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

    $backButton.click(function(){
        var username = $usernameInput.val();
        var password = $passwordInput.val();
        var passConfirm = $confirmPassInput.val();
        var answer1 = $secAnswer1.val();
        var answer2 = $secAnswer2.val();
        if(username || password || passConfirm || answer1 || answer2) {
            var userConfirm = confirm("Are you sure you want to quit registration? Any unsaved changes will be lost.");
            if (userConfirm) {
                window.location = "index.html";
            }
        } else {
            window.location = "index.html";
        }
    });

    socket.on('register-successful', function(){
       window.location = 'index.html';
    });

});