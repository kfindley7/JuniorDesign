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
            $listGames.append("<button class=\"accordion\" onclick='$(window).getGameFromGameDiv(event)'>" +
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

    $.fn.getGameFromGameDiv = function (event) {
        // var acc = document.getElementsByClassName("accordion");
        // var i;
        // console.log(acc);
        // for (i = 0; i < acc.length; i++) {
        //     acc[i].onclick = function() {
                event.currentTarget.classList.toggle("active");
                var panel = event.currentTarget.nextElementSibling;
                if (panel.style.maxHeight){
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            // }
        // }
        // window.location.replace("game-page.html?para=" + event.target.childNodes[5].innerText);
    };

    $.fn.gamePageChoice = function (event) {
        var reserveOrMapping = event.currentTarget.className;
        console.log(reserveOrMapping);
        var gameText = event.target.parentNode.previousElementSibling.childNodes[5].innerText;
        console.log(gameText);
        window.location.replace("game-page.html?para=" + gameText + " - " + reserveOrMapping)
    };

    $.fn.getGameSelectedFromChildHtml = function (event) {
        var acc = document.getElementsByClassName("accordion");
        var i;
        console.log(acc);
        for (i = 0; i < acc.length; i++) {
            acc[i].onclick = function() {
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                console.log(panel);
                if (panel.style.maxHeight){
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            }
        }
        // window.location.replace("game-page.html?para=" + event.target.offsetParent.childNodes[5].innerText);
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