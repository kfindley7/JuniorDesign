/*
* William Hornsby
* Fri. 9/8
* */

$(function() {
    var $usernameInput = $('[id=username]')
    var $registerButton = $('[id=recover-button]');

    var socket = io();

    $registerButton.click(function () {
        socket.emit('recover-check-user', $usernameInput.val());
    });

    socket.on('recover-no-user', function () {
        window.alert("That user does not exist");
    });

    socket.on('recover-user-exists', function(){
        window.location = 'security-questions.html';
        socket.emit('get-security-questions');
    });

    $backButton.click(function(){
        window.location = "index.html";
    });

});