$(function () {

    socket = io();
    $clearAll = $('.clear-database');
    $addGameTypes = $('.game-types');

    $clearAll.click(function () {
        var confirmClear = confirm("Are you sure you want to clear database? Cannot be undone.");
        if (confirmClear) {
            socket.emit('clear all');
            $addGameTypes.prop('disabled', false);
        }
    });

    $addGameTypes.click(function () {
        socket.emit('add game types');
        $addGameTypes.prop('disabled', true);
    });



});