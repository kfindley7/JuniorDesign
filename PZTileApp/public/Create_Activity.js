// Methods and Variables for the Create Activity Page
// By: John Berry September 8, 2017


$(function() {
    // Crate_Activity_Page variables
    var $activityInput = $('[id=gameSelect]');
    var $activityNameInput = $('.js-activity-name');
    var $saveNewActivityButton = $('.bottom-span-button');
    var $logoutButton = $('#logout-button');
    var $backButton = $('#back-button');
    var $visualButton = $('#visual-button');
    var $homeButton = $('#home-button');

    var activity;
    var activityName;

    var socket = io();

    // Called directly through the html page to make sure that
    // the list is fully up to date.
    $.fn.getGames = function () {
        socket.emit('get list of games');
        socket.on('got games', function (games) {
            showGames(games);
        });
    };

    // Add games to the selections to be made on Create_Activity.html.
    function showGames(aList) {
        for (var i = 0; i < aList.length; i++) {
            var option = document.createElement("option");
            option.value = aList[i];
            option.text = aList[i];
            $activityInput.append(option);
        }
    }

    // Logout button functionality
    $logoutButton.click(function() {
        var userConfirm = confirm("Are you sure you want to logout? Any unsaved changes will be lost.");
        if (userConfirm) {
            window.location = "index.html";
        }
    });

    // Back button functionality
    $backButton.click(function(){
        var activity = $activityInput.val();
        var activityName = $activityNameInput.val();
        if(activity || activityName) {
            var userConfirm = confirm("Are you sure you want to quit activity creation? Any unsaved changes will be lost.");
            if (userConfirm) {
                window.location = "home-page.html";
            }
        } else {
            window.location = "home-page.html";
        }
    });

    // When user clicks save new activity, create and save it to the database.
    $saveNewActivityButton.click(function () {
        createActivity();
    });

    $visualButton.click(function () {
        var userConfirm = confirm("Are you sure you want to quit activity creation? Any unsaved changes will be lost.");
        if (userConfirm) {
            window.location = "visualization.html";
        }
    });

    $homeButton.click(function () {
        var userConfirm = confirm("Are you sure you want to quit activity creation? Any unsaved changes will be lost.");
        if (userConfirm) {
            window.location = "home-page.html";
        }
    });

    // Creates an activity and sends it to store in the mongoDB
    function createActivity() {
        activity = $activityInput.val();
        activityName = $activityNameInput.val();
        if (activity && activityName) {
            socket.emit('create activity', activity, activityName);
        } else if (!activity) {
            alert("No activity selected, make sure that you have selected an activity.");
        } else if (!activityName) {
            alert(" No name specified, Make sure that you have named your new activity.");
        }
    }

    // Scenario when the activity and name combination are accepted. Automatically go to reserve
    // page to immediately add tiles to the game
    socket.on('activity created', function() {
        alert("Your activity has been created successfully.");
        window.location = "game-page.html?para=" + activityName + " - " + "reserve" ;
    });

    // Scenario when the activity and name combination already exist.
    socket.on('activity creation failed', function() {
        alert("This activity and name combination already exist. Please try a different name.");
    })
});