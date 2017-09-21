$(function () {

    socket = io();
    $clearAll = $('.clear-database');
    $addGameTypes = $('.game-types');
    $addTiles = $('.add-tiles');
    $addUser = $('.add-user');
    $statusDiv = $('.status-div');

    $clearAll.click(function () {
        var confirmClear = confirm("Are you sure you want to clear database? Cannot be undone.");
        if (confirmClear) {
            socket.emit('clear all');
            $statusDiv.append("<div><p>Database Cleared! Refresh if needed.</p></div>");
            $addGameTypes.prop('disabled', false);
            $addTiles.prop('disabled', false);
            $addUser.prop('disabled', false);
            socket.emit('show user');
            socket.emit('get tiles');
        }
    });

    $addGameTypes.click(function () {
        socket.emit('add game types');
        $addGameTypes.prop('disabled', true);
        $statusDiv.append("<div><p>Game Types Added!</p></div>");
    });

    $addUser.click(function () {
        socket.emit('add user manually');
        $addUser.prop('disabled', true);
        $statusDiv.append("<div><p>User Added! May not show up. If so add tiles first then refresh.</p></div>");
        socket.emit('show user');
    });

    $addTiles.click(function () {
        socket.emit('add tiles');
        $addTiles.prop('disabled', true);
        $statusDiv.append("<div><p>Tiles added! if none show up refresh.</p></div>");
        socket.emit('get tiles');
    });

    socket.on('tile list', function (tiles) {
        showTiles(tiles);
    });

    $.fn.getTiles = function () {
        socket.emit('get tiles');
    };

    $.fn.getUser = function () {
        socket.emit('show user');
    };

    socket.on('user', function (user) {
        showUserCredentials(user);
    });

    function showUserCredentials(user) {
        if (user) {
            $statusDiv.append("<div><p>Here are your user credentials: | Username: " + user.username + " | Password: " + user.password +
                " | Sec Q1: " + user.question1 + " | SQ1 Ans: " + user.answer1 +
                " | Sec Q2: " + user.answer2 + " | SQ2 Ans: " + user.answer2 + "</p></div>");
        } else {
            $statusDiv.append("<div><p>No admin user in DB.</p></div>")
        }
    }

    function showTiles(numTiles) {
        $statusDiv.append("<div><p>There are " + numTiles.toString() + " tiles across 4 locations!</p></div>");
    }

});