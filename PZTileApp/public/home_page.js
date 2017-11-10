/*
* Kaley Findley
* Tues. 9/5
* */

$(function() {
    var $logoutButton = $('#logout-button');

    var $listGames = $('.js-list-of-games');

    var socket = io();

    $logoutButton.click(function() {
        var userConfirm = confirm("Are you sure you want to logout? Any unsaved changes will be lost.");
        if (userConfirm) {
            window.location = "index.html";
        }
    });

    // add games to home-page.html after querying the DB
    function showGames(aList) {
        for (var i = 0; i < aList.length; i++) {
            $listGames.append("<button class=\"accordion\" onclick='$(window).openCloseAccordionMenu(event)'>" +
                "      <img class=\"image\" src=\"android-arrow-dropright.png\" >\n" +
                "      <p class=\"text-1\">Edit Game</p>\n" +
                "<div class='game-text'><p class=\"text text-2\">" + aList[i].activityName + "</p></div>" +
                "<div class='game-text'><p class=\"text text-3\">" + aList[i].activity + "</p></div>\n" +
                "    </button> <div class=\"panel\">\n" +
                "  <button class=\"reserve\" onclick='$(window).gamePageChoice(event)'>Edit Tile Reservations</button>\n" +
                "  <button class=\"mapping\" onclick='$(window).gamePageChoice(event)'>Edit Tile Mappings</button>\n" +
                "</div>");
        }
    }

    // open and closes the accordion menu for each activity choice
    $.fn.openCloseAccordionMenu = function (event) {
        event.currentTarget.classList.toggle("active");
        var panel = event.currentTarget.nextElementSibling;
        if (panel.style.maxHeight){
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    };

    // when accordion is empty, Edit Tile Reservations and Edit Tile Mappings is shown. When user
    // clicks on one, the corresponding class name is added to the page url so the game name and
    // type of edit is clear to user. Shows as title in next page and the reserveOrMapping var is
    // used in the next page to determine which map-view to show.
    $.fn.gamePageChoice = function (event) {
        var reserveOrMapping = event.currentTarget.className;
        var gameText = event.target.parentNode.previousElementSibling.childNodes[5].innerText;
        console.log(gameText);
        window.location.replace("game-page.html?para=" + gameText + " - " + reserveOrMapping)
    };

    // user clicks Visualization button, go to corresponding page - page is not completed yet
    $('#visual-button').click(function () {
        window.location.replace("visualization.html");
    });


    // this function is called directly through the html to ensure
    // home page is fully loaded before html is updated with games
    $.fn.getGames = function () {
        socket.emit('get activities');
    };

    // when successfully receiving the currently running activities from the database
    // call showGames(games) to dynamically add them to home-page.html
    socket.on('activity list', function (games) {
        showGames(games);
    });
});