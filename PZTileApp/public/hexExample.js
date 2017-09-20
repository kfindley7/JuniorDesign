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
var listOfPos = [];

function drawHexagonAt(po_ctr_hex, pn_circle, pn_sector) {
    var cur;
    var pos = {x: po_ctr_hex.x, y: po_ctr_hex.y};

    // console.log(listOfPos.find(pos));
    // if (listOfPos.findIndex(pos) < 0) {

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
        listOfPos.push(pos);
        // console.log(listOfPos);
    // }
} // drawHexagonAt

function fill_CircleWithHex(circle){
    drawCircle(circle);
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
            // for (var i=0; i < 6; i++) {
                // j-loops -- next honeycomb
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
            // } // i-loop -- meta-honeycomb
        } // if -- Iteration 1 vs. n > 1

        // radacc update
        iter++;
        radacc2 = ((2*iter + 1) * delta) * ((2*iter + 1) * delta) + hexagon.r * hexagon.r / 4;
    } // while -- komplette Shells

    var proceed;
    do {
        cur.x = ctr.x;
        cur.y = ctr.y - iter * 2 * delta;
        proceed = false;

        // for (var i=0; i < 6; i++) {
            // j-loops -- next honeycomb
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
        // } // i-loop -- meta-honeycomb
        iter++;
    } while (proceed && (iter < 15));

} // fill_CircleWithHex


function drawCircle(circle){
    ctx.beginPath();
    ctx.arc(circle.pos.x, circle.pos.y, circle.r, 0, 2 * Math.PI);
    ctx.stroke();
}


$(function() {
    $("#slider").slider({
        max: 500,
        min:0,
        value:250,
        create: function(event, ui) {
            $("#value").html($(this).slider('value'));
        },
        change: function(event, ui) {
            $("#value").html(ui.value);
        },
        slide: function(event, ui){
            $("#value").html(ui.value);
            circle.r = ui.value;
            ctx.clearRect(0,0, canvas_width, canvas_height);
            fill_CircleWithHex(circle);
        }
    });
});

$(document).ready(function () {
    c_el = document.getElementById("myCanvas");
    ctx = c_el.getContext("2d");

    canvas_width = c_el.clientWidth;
    canvas_height = c_el.clientHeight;

    circle = {
        r: 250, /// radius
        pos: {
            x: (canvas_width / 2),
            y: (canvas_height / 2)
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
});