$(document).ready(function(){
    var socket=io();
    var canvas = document.getElementById('hexmap');

    var reserveOrMapping = "";

    var free, inMine, usedOthers;
    var addTileList = [];
    var removeTileList = [];

    var hexHeight,
        hexRadius,
        hexRectangleHeight,
        hexRectangleWidth,
        hexagonAngle = 0.523598776, // 30 degrees in radians
        sideLength = 36,
        boardWidth = 10,
        boardHeight = 10;

    var posList, startList;
    var tilesFailed = [];
    var gameText;
    var changes = false;

    hexHeight = Math.sin(hexagonAngle) * sideLength;
    hexRadius = Math.cos(hexagonAngle) * sideLength;
    hexRectangleHeight = sideLength + 2 * hexHeight;
    hexRectangleWidth = 2 * hexRadius;

    if (canvas.getContext){
        var ctx = canvas.getContext('2d');

        ctx.fillStyle = "#000000";
        ctx.strokeStyle = "#CCCCCC";
        ctx.lineWidth = 1;

        //prototype
        posList = [2,3,2];
        startList = [1,0,1];

        //earth
        // var posList = [5,11,15,17,21,23,25,27,29,31,31];
        // var startList = [18,13,10,8,7,5,4,3,2,1,0];

        drawBoard(ctx, posList, startList);
        $('#hexmap').hide();

        canvas.addEventListener("mousemove", function(eventInfo) {
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
            if(hexY >= 0 && hexY < posList.length) {
                if(hexX >= startList[hexY] && hexX < posList[hexY]+startList[hexY]) {
                    // drawHexagon(ctx, screenX, screenY, true,0,0, "#cccccc");
                    console.log("Hovering over ["+hexX+", "+hexY+"]");
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

            if(hexY >= 0 && hexY < posList.length) {
                if (hexX >= startList[hexY] && hexX < posList[hexY] + startList[hexY]) {

                    selectTile(screenX, screenY, hexX, hexY);
                    console.log("[",hexX,", ",hexY,"]");
                }
            }
        });
    }

    // function drawBoard(canvasContext, width, height) {
    //     var i,
    //         j;
    //
    //     for(i = 0; i < width; ++i) {
    //         for(j = 0; j < height; ++j) {
    //             drawHexagon(
    //                 canvasContext,
    //                 i * hexRectangleWidth + ((j % 2) * hexRadius),
    //                 j * (sideLength + hexHeight),
    //                 false, i, j
    //             );
    //         }
    //     }
    // }

    function selectTile(screenX, screenY, tileX, tileY) {
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
        if (addTileList.length === 0 && removeTileList.length === 0) {
            alert("No Changes to Save. Please select tiles to add/remove.")
        }
        if (addTileList.length > 0) {
            socket.emit('add tiles to game', addTileList, gameText);
        }
        if (removeTileList.length > 0) {
            socket.emit('remove tiles from game', removeTileList);
        }

        if (tilesFailed.length === 0) {
            alert("All tiles were added/removed successfully!");
        } else {
            alert("Some tiles failed to be removed/added: \n" + tilesFailed.toString());
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
        console.log("GAME TEXT",gameText);

        socket.emit('give all tiles',"Prototype",gameText);

        socket.on('Used Tiles', function (f, m, o) {
            free=f;
            inMine=m;
            usedOthers=o;
            console.log("OTHERS",usedOthers);

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
                                console.log("tileeeee", tile.mapping);
                                if (reserveOrMapping == 'mapping' && tile.mapping == "None") {
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
            // circle.r = 389;
            // circle.pos.y = canvas_height / 3;
            // ctx.clearRect(0,0, canvas_width, canvas_height);
            // fill_CircleWithHex(circle);
        } else if (mapLoc === "Mars") {
            // circle.r = 213;
            // circle.pos.y = canvas_height / 5;
            // ctx.clearRect(0,0, canvas_width, canvas_height);
            // fill_CircleWithHex(circle);
        } else if (mapLoc === "Moon") {
            // circle.r = 145;
            // circle.pos.y = canvas_height / 6;
            // ctx.clearRect(0,0, canvas_width, canvas_height);
            // fill_CircleWithHex(circle);
        } else if (mapLoc === "Prototype") {

        }
    });

    $('.js-back-button').click(function () {
        if ($('#hexmap').css('display') === 'none' && $('.map-side').css('display') === 'none'
            && $('.change-list').css('display') === 'none') {
            window.location = "home-page.html"
        } else {
            if (changes) {
                var userConfirm = confirm("Are you sure you want to go back? Any unsaved changes will be lost.");
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
        var mapping_canvas = document.getElementById('map-left-side');
        drawBoard(mapping_canvas.getContext('2d'), posList, startList);
    });
});

