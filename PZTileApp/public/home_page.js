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
            $listGames.append("<div class=\"element js-game1\">" +
                "      <img class=\"image\" src=\"android-arrow-dropright.png\">\n" +
                "      <p class=\"text-1\">Edit Game</p>\n" +
                "<div class='game-text'><p class=\"text text-2\">" + aList[i].activityName + "</p></div>" +
                "<div class='game-text'><p class=\"text text-3\">" + aList[i].activity + "</p></div>\n" +
                "    </div>");
        }
    }

    $listGames.click(function(item) {
        console.log(item.target.childNodes[0].innerHTML);
        window.location = "game-page.html?para=" + item.target.childNodes[0].innerHTML;
    });

    $('#visual-button').click(function () {
        var userConfirm = confirm("Are you sure you want to leave this page? Any unsaved changes will be lost.");
        if (userConfirm) {
            window.location = "visualization.html";
        }

    });


    // this function is called directly through the html to ensure
    // home page is fully loaded before html is updated with games
    $.fn.getGames = function () {
        socket.emit('get activities');
    };

    socket.on('activity list', function (games) {
        showGames(games);
    });
});