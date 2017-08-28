<!--Kaley Findley-->
<!--Mon. 8/28-->


var listOfGames = ['ESCAPE FROM MARS', 'MINING FOR RESOURCES', 'ROCKET JUMP',
    'SCAVENGER HUNT', 'SIMON SAYS', 'SPACEFOOD SQUEEZE', 'SPACE INVADERS',
    'SPACE TRIVIA', 'WHACK-A-MOLE', 'GALAGA', 'PACMAN'];

function showGames() {
    var container = document.getElementById('listGames');
    var start = 2;
    var img = 1;
    for (var i = 0; i < listOfGames.length; i++) {
        container.innerHTML += "<div class=\"element js-game1\"><p style=\"padding-left: 0.5%\" class=\"text text-"+ start +"\">" + listOfGames[i] + "</p>\n" +
            "      <p class=\"text text-"+ (start + 1) +"\"><span>Edit Game</span></p>\n" +
            "      <img class=\"image image-1\" src=\"android-arrow-dropright.png\">\n" +
            "    </div>";
        start += 2;
        img++;
    }
}