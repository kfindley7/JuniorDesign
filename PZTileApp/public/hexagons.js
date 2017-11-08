$(document).ready(function(){
    var socket=io();
    var canvas = document.getElementById('hexmap');
    var canvasMapping = document.getElementById('map-left-side');

    var reserveOrMapping = "";

    var free, inMine, usedOthers;
    var addTileList = [];
    var removeTileList = [];
    var changeList = [];

    var hexHeight,
        hexRadius,
        hexRectangleHeight,
        hexRectangleWidth,
        hexagonAngle = 0.523598776, // 30 degrees in radians
        sideLength = 36;

    var posList, startList;
    var tilesFailed = [];
    var gameText;
    var changes = false;

    hexHeight = Math.sin(hexagonAngle) * sideLength;
    hexRadius = Math.cos(hexagonAngle) * sideLength;
    hexRectangleHeight = sideLength + 2 * hexHeight;
    hexRectangleWidth = 2 * hexRadius;

    if (canvas.getContext && canvasMapping.getContext){

        setupListenersForCanvas(canvas);
        setupListenersForCanvas(canvasMapping);
        var ctx = canvas.getContext('2d');
        var ctxMap = canvasMapping.getContext('2d');

        ctx.fillStyle = "#000000";
        ctx.strokeStyle = "#CCCCCC";
        ctx.lineWidth = 1;

        ctxMap.fillStyle = "#000000";
        ctxMap.strokeStyle = "#CCCCCC";
        ctxMap.lineWidth = 1;

        //prototype
        posList = [2,3,2];
        startList = [1,0,1];

        //earth
        // var posList = [5,11,15,17,21,23,25,27,29,31,31];
        // var startList = [18,13,10,8,7,5,4,3,2,1,0];

        // drawBoard(ctx, posList, startList);
        // $('#hexmap').hide();

    }

    function setupListenersForCanvas(canvas) {
        canvas.addEventListener("mousemove", function (eventInfo) {
            var x,
                y,
                hexX,
                hexY,
                screenX,
                screenY;

            x = eventInfo.offsetX || eventInfo.layerX;
            y = eventInfo.offsetY || eventInfo.layerY;


            hexY = Math.floor(y / (hexHeight + sideLength));
            hexX = Math.floor((x - (hexY % 2) * hexRadius) / hexRectangleWidth);

            screenX = hexX * hexRectangleWidth + ((hexY % 2) * hexRadius);
            screenY = hexY * (hexHeight + sideLength);

            //ctx.clearRect(0, 0, canvas.width, canvas.height);

            //drawBoard(ctx, posList, startList);


            // Check if the mouse's coords are on the board
            if (hexY >= 0 && hexY < posList.length) {
                if (hexX >= startList[hexY] && hexX < posList[hexY] + startList[hexY]) {
                    // drawHexagon(ctx, screenX, screenY, true,0,0, "#cccccc");
                    console.log("Hovering over [" + hexX + ", " + hexY + "]");
                }
            }

        });

        canvas.addEventListener("click", function (eventInfo) {
            var x,
                y,
                hexX,
                hexY,
                screenX,
                screenY;

            x = eventInfo.offsetX || eventInfo.layerX;
            y = eventInfo.offsetY || eventInfo.layerY;


            hexY = Math.floor(y / (hexHeight + sideLength));
            hexX = Math.floor((x - (hexY % 2) * hexRadius) / hexRectangleWidth);

            screenX = hexX * hexRectangleWidth + ((hexY % 2) * hexRadius);
            screenY = hexY * (hexHeight + sideLength);

            // var posList = [2,3,2];
            // var startList = [1,0,1];

            if (hexY >= 0 && hexY < posList.length) {
                if (hexX >= startList[hexY] && hexX < posList[hexY] + startList[hexY]) {
                    if (reserveOrMapping == 'reserve') {
                        selectTileForReserve(screenX, screenY, hexX, hexY);
                    } else if  (reserveOrMapping == 'mapping') {
                        selectTileForMapping(screenX, screenY, hexX, hexY);
                    }
                    console.log("[", hexX, ", ", hexY, "]");
                }
            }
        });
    }

    function selectTileForMapping(screenX, screenY, tileX, tileY) {
        console.log("SELECTED A TILE", tileX, tileY);
        var color, found = false;
        var unavailable = true;

        if (!found) {
            for (i = 0; i < inMine.length; i++) {
                var tile = inMine[i];
                var indexInChangeList = changeList.indexOf(tile.planet + "-" + tile.planet_id);
                if (tile.planet_id == (1000 * tileX + tileY) && indexInChangeList === -1) {
                    if (tile.mapping === "None") {
                        color = "#0000FF";
                    } else {
                        color = "#FF0000";
                    }
                    unavailable = false;
                    found = true;
                    changes = true;
                    changeList.push(tile.planet + "-" + tile.planet_id);
                    break;
                }
            }
        }

        if (!unavailable && found) {
            console.log(changeList);
            drawHexagon(ctx, screenX, screenY, true, 0, 0, color);
            addTileToChangeListColumn(tile);
        }
    }

    function addTileToChangeListColumn(tile) {
        var $tileDiv = $("<div>", {id: tile.planet + "-" + tile.planet_id, class: "tile-div"});
        $tileDiv.append("<p class='tile-text'>" + tile.planet + "-" + tile.planet_id + "</p>");
        var $functionDropdown = $("<select>", {class: 'function-select-menu'});
        // socket.emit('get activity functions');
        var functionList = ["Test1", "Test2", "Test3", "Test4", "Test5"];
        for (var i = 0; i < functionList.length; i++) {
            $functionDropdown.append("<option class='tile-function-menu' value="
                + functionList[i] + "> " + functionList[i] + "</option>")
        }
        $tileDiv.append($functionDropdown);
        $tileDiv.append("<button class='delete-tile-x' onclick='$(window).deleteTileFromChanges(event)'>&times;</button>");

        $('.change-list').append($tileDiv);
    }

    $.fn.deleteTileFromChanges = function(event) {
        var tile = event.path[1].id;
        $('#' + tile).remove();
        var tileIdLoc = tile.split("-");
        console.log(tile, tileIdLoc);
        for (i = 0; i < changeList.length; i++) {
            var tempTile = changeList[i].split("-");
            if (tempTile[0] == tileIdLoc[0]
                && tempTile[1] == tileIdLoc[1]) {
                changeList.splice(i, 1);
                break;
            }
        }

        changes = changeList.length !== 0;

        drawBoard(ctxMap, startList, posList);
        console.log("CHANGE LIST AFTER REMOVE", changeList);

    };

    function selectTileForReserve(screenX, screenY, tileX, tileY) {
        var color, found = false;
        var unavailable = false;

        if (!found) {
            for (x = 0; x < free.length; x++) {
                tile = free[x];
                var indexInAdded = addTileList.indexOf(tile);
                if (tile.planet_id === (1000 * tileX + tileY) && indexInAdded === -1) {
                    color = "#88f281";
                    found = true;
                    addTileList.push(tile);
                    break;
                } else if (tile.planet_id === (1000 * tileX + tileY) && indexInAdded !== -1) {
                    found = true;
                    color = "#FFFFFF";
                    addTileList.splice(indexInAdded, 1);
                    break;
                }
            }
        }

        if (!found) {
            for (x = 0; x < inMine.length; x++) {
                tile = inMine[x];
                var indexInRemoved = removeTileList.indexOf(tile);
                if (tile.planet_id === (1000 * tileX + tileY) && indexInRemoved === -1) {
                    color = "#FF0000";
                    found = true;
                    removeTileList.push(tile);
                    break;
                } else if (tile.planet_id === (1000 * tileX + tileY) && indexInRemoved !== -1) {
                    found = true;
                    color = "#0000FF";
                    removeTileList.splice(indexInRemoved, 1);
                    break;
                }
            }
        }

        if (!found) {
            for (x = 0; x < usedOthers.length; x++) {
                tile = usedOthers[x];
                if (tile.planet_id === (1000 * tileX + tileY)) {
                    color = "#FF0000";
                    found = true;
                    unavailable = true;
                }
            }
        }

        if (addTileList.length > 0 && removeTileList.length > 0) {
            changes = true;
        } else if (addTileList.length > 0) {
            changes = true;
        } else {
            changes = removeTileList.length > 0;
        }

        if (!unavailable) {
            drawHexagon(ctx, screenX, screenY, true, 0, 0, color);
        }

    }

    $('.bottom-span-button').click(function() {
        if (reserveOrMapping == 'reserve') {

            if (addTileList.length === 0 && removeTileList.length === 0) {
                alert("No Changes to Save. Please select tiles to add/remove.")
            }
            if (addTileList.length > 0) {
                socket.emit('add tiles to game', addTileList, gameText);
            }
            if (removeTileList.length > 0) {
                socket.emit('remove tiles from game', removeTileList);
            }
            if (changes) {
                if (tilesFailed.length === 0) {
                    alert("All tiles were added/removed successfully!");
                } else {
                    alert("Some tiles failed to be removed/added: \n" + tilesFailed.toString());
                }
            }
        } else if (reserveOrMapping == 'mapping') {
            if (changeList.length === 0) {
                alert("No Changes to Save. Select tiles to make changes to mappings.");
            } else {
                // socket.emit('update tile mappings', changeList);
                console.log("ATTEMPTING TO SAVE. Functionality not completed yet. Nothing should change.")
            }
        }
    });

    socket.on('all tiles added successfully', function () {
        addTileList = [];
        drawBoard(ctx, posList, startList);
    });

    socket.on('some tiles failed addition', function (failedTiles) {
        addTileList = [];
        tilesFailed.push(failedTiles);
    });

    socket.on('all tiles removed successfully', function() {
        removeTileList = [];
        drawBoard(ctx, posList, startList);
    });
    socket.on('some tiles failed removal', function (failedTiles) {
        removeTileList = [];
        tilesFailed.push(failedTiles);
    });

    function drawBoard(canvasContext, posList, startList) {
        var queryString = decodeURIComponent(window.location.search);
        queryString = queryString.substring(1);
        gameText = queryString.split("=")[1];
        // console.log("GAME TEXT",gameText);

        socket.emit('give all tiles',"Prototype",gameText);

        socket.on('Used Tiles', function (f, m, o) {
            free=f;
            inMine=m;
            usedOthers=o;
            // console.log("OTHERS",usedOthers);

            for(var j = 0; j < posList.length; j++) {
                for(var i = startList[j]; i < posList[j]+startList[j]; i++) {

                    var color, found = false, fill=false;

                    for(x=0; x<free.length; x++){
                        tile = free[x];
                        if(tile.planet_id===(1000*i+j)){
                            color = "#FFFFFF";
                            found = true;
                            fill=true;
                        }
                    }
                    if(!found){
                        for(x=0; x<inMine.length; x++){
                            tile = inMine[x];
                            if(tile.planet_id===(1000*i+j)){
                                if (reserveOrMapping == 'mapping' && tile.mapping == "None"
                                    && changeList.indexOf(tile.planet + "-" + tile.planet_id) == -1) {
                                    color = "#949093"
                                } else {
                                    color = "#0000FF";
                                }

                                found = true;
                                fill=true;
                            }
                        }
                    }
                    if(!found){
                        for(x=0; x<usedOthers.length; x++){
                            tile = usedOthers[x];
                            if(tile.planet_id===(1000*i+j)){
                                color = "#000000";
                                found = true;
                                fill=true;
                            }
                        }
                    }

                    drawHexagon(
                        canvasContext,
                        i * hexRectangleWidth + ((j % 2) * hexRadius),
                        j * (sideLength + hexHeight),
                        fill, i, j, color
                    );

                }
            }
        });

    }

    function drawHexagon(canvasContext, x, y, fill, i, j, fillColor) {
        var fill = fill || false;

        canvasContext.strokeStyle = "#000000";
        canvasContext.beginPath();
        canvasContext.moveTo(x + hexRadius, y);
        canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight);
        canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight + sideLength);
        canvasContext.lineTo(x + hexRadius, y + hexRectangleHeight);
        canvasContext.lineTo(x, y + sideLength + hexHeight);
        canvasContext.lineTo(x, y + hexHeight);
        canvasContext.closePath();

        if(fill) {
            canvasContext.fillStyle = fillColor;
            canvasContext.fill();
            canvasContext.stroke();
        } else {
            canvasContext.fillText(""+i+","+j+" ("+(1000*i+j)+")", x+hexRectangleWidth/2-20, y+hexRadius);
            canvasContext.stroke();
        }
    }

    $('.choose-loc').click(function () {
        mapLoc = $('[id=location]').val();
        if (mapLoc === "Earth") {

        } else if (mapLoc === "Mars") {

        } else if (mapLoc === "Moon") {

        } else if (mapLoc === "Prototype") {

        }
    });

    $('#back-button').click(function () {
        if ($('#hexmap').css('display') === 'none' && $('.map-side').css('display') === 'none'
            && $('.change-list').css('display') === 'none') {
            window.location = "home-page.html"
        } else {
            if (changes) {
                var userConfirm = confirm("Are you sure you want to go back? Any unsaved changes may be lost.");
                if (userConfirm) {
                    $('.js-game1').show();
                    $('#hexmap').hide();
                    $('[id=location]').hide();
                    $('.choose-loc').hide();
                    $('.bottom-span-button').hide();
                    $('[id=legend]').hide();
                    $('.map-side').hide();
                    $('.change-list').hide();
                }
                changes = false;
            } else {
                $('.js-game1').show();
                $('#hexmap').hide();
                $('[id=location]').hide();
                $('.choose-loc').hide();
                $('.bottom-span-button').hide();
                $('[id=legend]').hide();
                $('.map-side').hide();
                $('.change-list').hide();
            }
        }
    });

    $('[id=reserve]').click(function() {
        reserveOrMapping = 'reserve';
        $('.js-game1').hide();
        $('#hexmap').show();
        $('[id=location]').show();
        $('.choose-loc').show();
        $('.bottom-span-button').show();
        $('[id=legend]').show();
        canvas = document.getElementById('hexmap');
        ctx = canvas.getContext('2d');
        drawBoard(ctx, posList, startList);
    });

    $('#mapping').click(function () {
        reserveOrMapping = 'mapping';
        $('.js-game1').hide();
        $('.map-side').show();
        $('.change-list').show();
        $('#hexmap').hide();
        $('#map-left-side').show();
        $('#mapping-legend').show();
        $('#location2').show();
        $('#loc-button').show();
        $('.bottom-span-button').show();
        canvas = document.getElementById('map-left-side');
        ctx = canvas.getContext('2d');
        drawBoard(ctx, posList, startList);
    });

});

