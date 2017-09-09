/*
* William Hornsby
* Fri. 9/8
* */

$(function() {
    var $usernameInput = $('[id=username]');
    var $recoverButton = $('[id=recover-button]');

    var $questionDiv = $('[id=security-questions]');
    var $secQuest1 = $('[id=question1]');
    var $secAnswer1 = $('[id=answer1]');
    var $secQuest2 = $('[id=question2]');
    var $secAnswer2 = $('[id=answer2]');

    var $submitButton = $('[id=submit-button]');
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
        document.getElementById("username").disabled = true;
        socket.emit('get-security-questions', $usernameInput.val());
    });

    $backButton.click(function(){
        window.location = "index.html";
    });


    socket.on('load-security-questions', function(question1Type, question2Type){

        console.log(question1Type);
        console.log(question2Type);
        // $secQuest1.innerText = question1Type;

        $secQuest1.text(typeToQuestion(question1Type,1));
        $secQuest2.text(typeToQuestion(question2Type,2));
    });

    function typeToQuestion(qType, qNum){
        if(qNum == 1){
            if (qType === "Childhood"){
                return "What was your childhood nickname?";
            } else if (qType === "Family"){
                return "In what city or town did your mother and father meet?";
            } else if (qType === "Favorites"){
                return "What is your favorite sports team?";
            } else if (qType === "Education"){
                return "What school did you attend for sixth grade?";
            } else if (qType === "Work"){
                return "In what town was your first job?";
            }
        } else if(qNum == 2){
            if (qType === "Childhood"){
                return "What is the name of your favorite childhood friend?";
            } else if (qType === "Family"){
                return "What is the middle name of your oldest child?";
            } else if (qType === "Favorites"){
                return "What is your favorite movie?";
            } else if (qType === "Education"){
                return "What was the last name of your third grade teacher?";
            } else if (qType === "Work"){
                return "What was the name of the company where you had your first job?";
            }
        }
    }

    $submitButton.click(function () {
        var ans1 = $secAnswer1.val();
        var ans2 = $secAnswer2.val();
        if(ans1&&ans2){
            socket.emit('validate-security-answers', $usernameInput.val(), ans1, ans2);
        } else{
            window.alert("Please answer both questions.")
        }
    });

    socket.on('correct-security-answers', function () {
        window.alert("THIS WILL GO TO A CHANGE PASSWORD PAGE");
    });

    socket.on('wrong-security-answers', function () {
        window.alert("At least one of your answers is incorrect. Please try again")
    });

});