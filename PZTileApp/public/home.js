<!--Kaley Findley-->
<!--Mon. 8/28-->

$(function () {

    var socket = io();

    var $listGames = $('.js-list-of-games');

    var listOfGames = ['ESCAPE FROM MARS', 'MINING FOR RESOURCES', 'ROCKET JUMP',
        'SCAVENGER HUNT', 'SIMON SAYS', 'SPACEFOOD SQUEEZE', 'SPACE INVADERS',
        'SPACE TRIVIA', 'WHACK-A-MOLE', 'GALAGA', 'PACMAN'];

    function showGames() {
        // var container = document.getElementById('listGames');
        var start = 2;
        var img = 1;
        for (var i = 0; i < listOfGames.length; i++) {
            $listGames.innerHTML += "<div class=\"element js-game1\"><p style=\"padding-left: 0.5%\" class=\"text text-"+ start +"\">" + listOfGames[i] + "</p>\n" +
                "      <p class=\"text text-"+ (start + 1) +"\"><span>Edit Game</span></p>\n" +
                "      <img class=\"image image-1\" src=\"android-arrow-dropright.png\">\n" +
                "    </div>";
            start += 2;
            img++;
        }
    }

    socket.on('user logged in', function () {
        console.log("HOME PAGE");
        window.location = 'home-page.html';
        socket.send('get list of games');
    });

    socket.on('got games', function () {
        showGames();
    })
});
