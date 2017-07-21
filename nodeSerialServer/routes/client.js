/*
  webSocket client
  context: P5.js
  A webSocket client that draws a ball on the screen
  that's moved around with data from the server. The server
  is sending data received serially from an Arduino.
  The server is sending:
    x, y, buttonValue\n
    created 10 June 2015
    by Tom Igoe
*/

var socket = io();		      // socket.io instance. Connects back to the server
var serialData;           // readings from the server


var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../', 'views', 'home.html'));
});

// function setup() {
//     createCanvas(400, 300);   // set up the canvas
//     x = width/2;              // set X and Y in the middle of the screen
//     y = width/2;
// }
//
// function draw() {
//     background(255);          // make the screen white
//     var fillColor = 127;      // set the fill color to black
//     noStroke();
//     if (button == 1) {        // if the button is not pressed
//         fillColor = color(0x44, 0x33, 0xAF);  // blue fill color
//     }
//     fill(fillColor);          // set the fill color
//     ellipse(x, y, 30, 30);    // draw the ellipse
// }

function readData(data) {
    serialData = data;           // button is the third value
}

// when new data comes in the websocket, read it:
socket.on('message', readData);

router.get('/data', function(req,res){
    res.send(serialData);
});

module.exports = router;
