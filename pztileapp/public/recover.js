/*
* William Hornsby
* Fri. 9/8
* */

$(function() {
    var $usernameInput = $('[id=username]')
    var $recoverButton = $('[id=recover-button]');

    var $questionDiv = $('[id=security-questions]');
    var $secQuest1 = $('[id=question1]');
    var $secAnswer1 = $('[id=answer1]');
    var $secQuest2 = $('[id=question2]');
    var $secAnswer2 = $('[id=answer2]');

    var $submitButton = $('.js-register');
    var $backButton = $('[id=back-button]');

    var socket = io();

    $recoverButton.click(function () {
        socket.emit('recover-check-user', $usernameInput.val());
    });

    socket.on('recover-no-user', function () {
        window.alert("That user does not exist");
    });

    socket.on('recover-user-exists', function(){
        // window.location = 'security-questions.html';
        // $questionDiv.style.display = "block";
        $($questionDiv).show();
        socket.emit('get-security-questions', $usernameInput.val());
    });

    $backButton.click(function(){
        window.location = "index.html";
    });



    socket.on('load-security-questions', function(secQ1, secQ2){

        console.log(secQ1);
        console.log(secQ2);
        // $secQuest1.innerText = secQ1;
        $secQuest1.text(secQ1);
        $secQuest2.text(secQ2);
    });

});