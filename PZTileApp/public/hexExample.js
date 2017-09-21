var c_el;
var ctx;
var canvas_width;
var canvas_height;
var circle;
var hexagon;
var hex_w;
var hex_h;
var hex_s;
var delta;
var numHex = 0;

function drawHexagonAt(po_ctr_hex, pn_circle, pn_sector) {
    var cur;
    cur = {x: po_ctr_hex.x - 0.5 * hexagon.r, y: po_ctr_hex.y - delta};

    ctx.beginPath();
    ctx.moveTo(cur.x, cur.y);
    cur.x = cur.x + hexagon.r;
    ctx.lineTo(cur.x, cur.y);
    cur.x = cur.x + hexagon.r / 2;
    cur.y = cur.y + delta;
    ctx.lineTo(cur.x, cur.y);
    cur.x = cur.x - hexagon.r / 2;
    cur.y = cur.y + delta;
    ctx.lineTo(cur.x, cur.y);
    cur.x = cur.x - hexagon.r;
    ctx.lineTo(cur.x, cur.y);
    cur.x = cur.x - hexagon.r / 2;
    cur.y = cur.y - delta;
    ctx.lineTo(cur.x, cur.y);
    cur.x = cur.x + hexagon.r / 2;
    cur.y = cur.y - delta;
    ctx.lineTo(cur.x, cur.y);
    ctx.closePath();
    ctx.stroke();

    cur.x = cur.x + hexagon.r / 2;
    cur.y = cur.y + delta;
    numHex++;
    ctx.fillText(numHex, cur.x - 6, cur.y + 4);
} // drawHexagonAt

function fill_CircleWithHex(circle){
    // drawCircle(circle);
    var radacc2;
    var iter = 0;
    var sector = 0;
    var ctr = {x: circle.pos.x, y: circle.pos.y};
    var cur = {x: 0, y: 0};
    numHex = 0;

    delta = Math.floor(Math.sqrt(3) * 0.5 * hexagon.r);
    radacc2 = hexagon.r * hexagon.r;
    while ((radacc2 < circle.r * circle.r)) {
        cur.x = ctr.x;
        cur.y = ctr.y - iter * 2 * delta;

        if (iter === 0) {
            drawHexagonAt(cur, 0, 0);
        } else {
            sector = 0;
            for (var j=0; j < iter; j++) {
                cur.x = cur.x + 1.5 * hexagon.r;
                cur.y = cur.y + delta;
                drawHexagonAt(cur, iter, sector++);
            }
            for (var j=0; j < iter; j++) {
                cur.y = cur.y + 2 * delta;
                drawHexagonAt(cur, iter, sector++);
            }
            for (var j=0; j < iter; j++) {
                cur.x = cur.x - 1.5 * hexagon.r;
                cur.y = cur.y + delta;
                drawHexagonAt(cur, iter, sector++);
            }
            for (var j=0; j < iter; j++) {
                cur.x = cur.x - 1.5 * hexagon.r;
                cur.y = cur.y - delta;
                drawHexagonAt(cur, iter, sector++);
            }
            for (var j=0; j < iter; j++) {
                cur.y = cur.y - 2 * delta;
                drawHexagonAt(cur, iter, sector++);
            }
            for (var j=0; j < iter; j++) {
                cur.x = cur.x + 1.5 * hexagon.r;
                cur.y = cur.y - delta;
                drawHexagonAt(cur, iter, sector++);
            }
        }

        iter++;
        radacc2 = ((2*iter + 1) * delta) * ((2*iter + 1) * delta) + hexagon.r * hexagon.r / 4;
    }

    var proceed;
    do {
        cur.x = ctr.x;
        cur.y = ctr.y - iter * 2 * delta;
        proceed = false;
        sector = 0;
        for (var j=0; j < iter; j++) {
            cur.x = cur.x + 1.5 * hexagon.r;
            cur.y = cur.y + delta;
            sector++;
            if (Math.sqrt ((cur.x - ctr.x) * (cur.x - ctr.x) + (cur.y - ctr.y) * (cur.y - ctr.y)) + hexagon.r < circle.r) {
                drawHexagonAt(cur, iter, sector);
                proceed = true;
            }
        }
        for (var j=0; j < iter; j++) {
            cur.y = cur.y + 2 * delta;
            sector++;
            if (Math.sqrt ((cur.x - ctr.x) * (cur.x - ctr.x) + (cur.y - ctr.y) * (cur.y - ctr.y)) + hexagon.r < circle.r) {
                drawHexagonAt(cur, iter, sector);
                proceed = true;
            }
        }
        for (var j=0; j < iter; j++) {
            cur.x = cur.x - 1.5 * hexagon.r;
            cur.y = cur.y + delta;
            sector++;
            if (Math.sqrt ((cur.x - ctr.x) * (cur.x - ctr.x) + (cur.y - ctr.y) * (cur.y - ctr.y)) + hexagon.r < circle.r) {
                drawHexagonAt(cur, iter, sector);
                proceed = true;
            }
        }
        for (var j=0; j < iter; j++) {
            cur.x = cur.x - 1.5 * hexagon.r;
            cur.y = cur.y - delta;
            sector++;
            if (Math.sqrt ((cur.x - ctr.x) * (cur.x - ctr.x) + (cur.y - ctr.y) * (cur.y - ctr.y)) + hexagon.r < circle.r) {
                drawHexagonAt(cur, iter, sector);
                proceed = true;
            }
        }
        for (var j=0; j < iter; j++) {
            cur.y = cur.y - 2 * delta;
            sector++;
            if (Math.sqrt ((cur.x - ctr.x) * (cur.x - ctr.x) + (cur.y - ctr.y) * (cur.y - ctr.y)) + hexagon.r < circle.r) {
                drawHexagonAt(cur, iter, sector);
                proceed = true;
            }
        }
        for (var j=0; j < iter; j++) {
            cur.x = cur.x + 1.5 * hexagon.r;
            cur.y = cur.y - delta;
            sector++;
            if (Math.sqrt ((cur.x - ctr.x) * (cur.x - ctr.x) + (cur.y - ctr.y) * (cur.y - ctr.y)) + hexagon.r < circle.r) {
                drawHexagonAt(cur, iter, sector);
                proceed = true;
            }
        }
        iter++;
    } while (proceed && (iter < 15));

} // fill_CircleWithHex


// function drawCircle(circle){
//     ctx.beginPath();
//     ctx.arc(circle.pos.x, circle.pos.y, circle.r, 0, 2 * Math.PI);
//     ctx.stroke();
// }


$(function () {
   $('.choose-loc').click(function () {
       var location = $('[id=location]').val();
       if (location === "Earth") {
           circle.r = 389;
           circle.pos.y = canvas_height / 3;
           ctx.clearRect(0,0, canvas_width, canvas_height);
           fill_CircleWithHex(circle);
       } else if (location === "Mars") {
           circle.r = 213;
           circle.pos.y = canvas_height / 5;
           ctx.clearRect(0,0, canvas_width, canvas_height);
           fill_CircleWithHex(circle);
       } else if (location === "Moon") {
           circle.r = 145;
           circle.pos.y = canvas_height / 6;
           ctx.clearRect(0,0, canvas_width, canvas_height);
           fill_CircleWithHex(circle);
       }
   });

   $('.js-back-button').click(function () {
       $('.js-game1').show();
       $('[id=myCanvas]').hide();
       $('[id=location]').hide();
       $('.choose-loc').hide();
   });

    $('.js-game1').click(function() {
        $('.js-game1').hide();
        $('[id=myCanvas]').show();
        $('[id=location]').show();
        $('.choose-loc').show();
    })
});

$(document).ready(function () {
    c_el = document.getElementById("myCanvas");
    ctx = c_el.getContext("2d");

    canvas_width = c_el.clientWidth;
    canvas_height = c_el.clientHeight;

    circle = {
        r: 389, // radius
        pos: {
            x: (canvas_width / 3),
            y: (canvas_height / 3)
        }
    };

    hexagon = {
        r: 20,
        pos:{
            x: 0,
            y: 0
        }
    };

    hex_w = hexagon.r * 2;
    hex_h = Math.floor(Math.sqrt(3) * hexagon.r);
    hex_s = (3 / 2) * hexagon.r;

    fill_CircleWithHex(circle);
    c_el.hidden = true;
});