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
            $listGames.append("<div class=\"element js-game1\" onclick='$(window).getGameFromGameDiv(event)'>" +
                "      <img class=\"image\" src=\"android-arrow-dropright.png\" onclick='$(window).getGameSelectedFromChildHtml(event)'>\n" +
                "      <p class=\"text-1\" onclick='$(window).getGameSelectedFromChildHtml(event)'>Edit Game</p>\n" +
                "<div class='game-text' onclick='$(window).getGameSelectedFromChildHtml(event)'><p class=\"text text-2\">" + aList[i].activityName + "</p></div>" +
                "<div class='game-text' onclick='$(window).getGameSelectedFromChildHtml(event)'><p class=\"text text-3\">" + aList[i].activity + "</p></div>\n" +
                "    </div>");
        }
    }

    $.fn.getGameFromGameDiv = function (event) {
        window.location.replace("game-page.html?para=" + event.target.childNodes[5].innerText);
    };

    $.fn.getGameSelectedFromChildHtml = function (event) {
        window.location.replace("game-page.html?para=" + event.target.offsetParent.childNodes[5].innerText);
        event.stopPropagation();
    };


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