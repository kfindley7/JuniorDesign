$(function () {

    socket = io();
    $clearAll = $('.clear-database');
    $addGameTypes = $('.game-types');
    $addTiles = $('.add-tiles');
    $tilesDiv = $('.tiles');

    $clearAll.click(function () {
        var confirmClear = confirm("Are you sure you want to clear database? Cannot be undone.");
        if (confirmClear) {
            socket.emit('clear all');
            $addGameTypes.prop('disabled', false);
            $addTiles.prop('disabled', false);
            socket.emit('get tiles');
        }
    });

    $addGameTypes.click(function () {
        socket.emit('add game types');
        $addGameTypes.prop('disabled', true);
        alert("Game Types Added!");
    });

    $addTiles.click(function () {
        socket.emit('add tiles');
        $addTiles.prop('disabled', true);
        alert("Tiles Added!");
        socket.emit('get tiles');
    });

    socket.on('tile list', function (tiles) {
        showTiles(tiles);
    });

    $.fn.getTiles = function () {
        socket.emit('get tiles');
    };

    function showTiles(numTiles) {
        $tilesDiv.append("<div><p>There are " + numTiles.toString() + " tiles across 4 locations!</p></div>");
    }

});