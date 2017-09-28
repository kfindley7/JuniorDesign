(function(){
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

        var posList = [2,3,2];
        var startList = [1,0,1];

        drawBoard2(ctx, posList, startList);

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

            var posList = [2,3,2];
            var startList = [1,0,1];

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

})();