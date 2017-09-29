$(function () {
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
        }
        // ctx.rotate(90);
    });

    $('.js-back-button').click(function () {
        var map = $('[id=hexmap]');
        if (map[0].style.visibility === "hidden") {
            window.location = "home-page.html"
        } else {
            $('.js-game1').show();
            map[0].style.visibility = "hidden";
            $('[id=location]').hide();
            $('.choose-loc').hide();
        }
    });

    $('[id=reserve]').click(function() {
        $('.js-game1').hide();
        var map = $('[id=hexmap]');
        map[0].style.visibility = "visible";
        $('[id=location]').show();
        $('.choose-loc').show();
    })
});

$(document).ready(function(){
    var socket=io();
    var canvas = document.getElementById('hexmap');

    var hexHeight,
        hexRadius,
        hexRectangleHeight,
        hexRectangleWidth,
        hexagonAngle = 0.523598776, // 30 degrees in radians
        sideLength = 36,
        boardWidth = 10,
        boardHeight = 10;

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
        var posList = [2,3,2];
        var startList = [1,0,1];

        //earth
        // var posList = [5,11,15,17,21,23,25,27,29,31,31];
        // var startList = [18,13,10,8,7,5,4,3,2,1,0];

        drawBoard(ctx, posList, startList);
        canvas.style.visibility = "hidden";

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
                    drawHexagon(ctx, screenX, screenY, true, 0, 0, "#FF0000");
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

    function drawBoard(canvasContext, posList, startList) {
        var queryString = decodeURIComponent(window.location.search);
        queryString = queryString.substring(1);
        var gameText = queryString.split("=")[1];

        socket.emit('give all tiles',"Prototype",gameText);

        var free, inMine, usedOthers;
        socket.on('Used Tiles', function (f, m, o) {
            free=f;
            inMine=m;
            usedOthers=o;

            for(var j = 0; j < posList.length; j++) {
                for(var i = startList[j]; i < posList[j]+startList[j]; i++) {

                    var color, found = false, fill=false;

                    for(x=0; x<free.length; x++){
                        tile = free[x];
                        // console.log("---FREE---")
                        // console.log(tile)
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
                                color = "#0000FF";
                                found = true;
                                fill=true;
                            }
                        }
                    }
                    if(!found){
                        for(x=0; x<inMine.length; x++){
                            tile = inMine[x];
                            if(tile.planet_id===(1000*i+j)){
                                color = "#FF0000";
                                found = true;
                                fill=true;
                            }
                        }
                    }

                    if(color === "#FFFFFF") {
                        drawHexagon(
                            canvasContext,
                            i * hexRectangleWidth + ((j % 2) * hexRadius),
                            j * (sideLength + hexHeight),
                            fill, i, j, color
                        );
                    } else {
                        drawHexagon(
                            canvasContext,
                            i * hexRectangleWidth + ((j % 2) * hexRadius),
                            j * (sideLength + hexHeight),
                            fill, i, j, color
                        );
                    }

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
});

