/*
* William Hornsby
* Thur. 9/7
* */

$(function() {
    var $secQuest1 = $('[id=question1]');
    var $secAnswer1 = $('[id=answer1]');
    var $secQuest2 = $('[id=question2]');
    var $secAnswer2 = $('[id=answer2]');

    var $submitButton = $('.js-register');
    var $backButton = $('[id=back-button]');

    var socket = io();


    socket.on('load-security-questions', function(secQ1, secQ2){
        $secQuest1.value = secQ1;
        $secQuest2.value = secQ2;
    });


    $backButton.click(function(){
        window.location = "index.html";
    });

});