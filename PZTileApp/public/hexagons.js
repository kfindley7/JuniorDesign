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

        drawBoard2(ctx, posList, startList);
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

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var oldBoard = false;

            if(oldBoard){
                drawBoard(ctx, boardWidth, boardHeight);
            } else {
                drawBoard2(ctx, posList, startList);
            }

            // Check if the mouse's coords are on the board
            if(oldBoard){
                if(hexY >= 0 && hexY < boardHeight) {
                    if(hexX >= 0 && hexX < boardWidth) {
                        ctx.fillStyle = "#000000";
                        drawHexagon(ctx, screenX, screenY, true);
                    }
                }
            } else {
                if(hexY >= 0 && hexY < posList.length) {
                    if(hexX >= startList[hexY] && hexX < posList[hexY]+startList[hexY]) {
                        ctx.fillStyle = "#000000";
                        drawHexagon(ctx, screenX, screenY, true);
                    }
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
                    ctx.fillStyle = "#FF0000";
                    drawHexagon(ctx, screenX, screenY, true);
                    console.log("[",hexX,", ",hexY,"]");
                }
            }
        });
    }

    function drawBoard(canvasContext, width, height) {
        var i,
            j;

        for(i = 0; i < width; ++i) {
            for(j = 0; j < height; ++j) {
                drawHexagon(
                    canvasContext,
                    i * hexRectangleWidth + ((j % 2) * hexRadius),
                    j * (sideLength + hexHeight),
                    false, i, j
                );
            }
        }
    }

    function drawBoard2(canvasContext, posList, startList) {

        for(var j = 0; j < posList.length; j++) {
            for(var i = startList[j]; i < posList[j]+startList[j]; i++) {
                drawHexagon(
                    canvasContext,
                    i * hexRectangleWidth + ((j % 2) * hexRadius),
                    j * (sideLength + hexHeight),
                    false, i, j
                );
            }
        }
    }

    function drawHexagon(canvasContext, x, y, fill, i, j) {
        var fill = fill || false;

        canvasContext.beginPath();
        canvasContext.moveTo(x + hexRadius, y);
        canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight);
        canvasContext.lineTo(x + hexRectangleWidth, y + hexHeight + sideLength);
        canvasContext.lineTo(x + hexRadius, y + hexRectangleHeight);
        canvasContext.lineTo(x, y + sideLength + hexHeight);
        canvasContext.lineTo(x, y + hexHeight);
        canvasContext.closePath();

        if(fill) {
            canvasContext.fill();
        } else {
            canvasContext.fillText(""+i+","+j, x+hexRectangleWidth/2-5, y+hexRadius+5);
            canvasContext.stroke();
        }
    }
});

