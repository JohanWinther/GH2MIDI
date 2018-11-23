var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
const GameController = require('gamecontroller');
const JZZ = require('jzz');

server.listen(3000);

// Index
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Static files
app.use(express.static(__dirname + '/public'));


io.on('connection', function (socket) {
    // When the client connects, they are sent a message
    socket.emit('message', 'You are connected!');
    // The other clients are told that someone new has arrived
    
    // As soon as the username is received, it's stored as a session variable
    /*socket.on('little_newbie', function(username) {
        socket.username = username;
    });*/

    // When a "message" is received (click on the button), it's logged in the console
    socket.on('message', function (message) {
        // The username of the person who clicked is retrieved from the session variables
        console.log(`${socket.username} is speaking to me! They\'re saying: ${message}`);
    }); 
});


// Load guitar
const gc = new GameController('xbox360-guitar-xplorer');
gc.connect();


port = JZZ().or('Cannot start MIDI engine!')
.openMidiOut(0).or('Cannot open MIDI Out port!').program(0, 34);

// Setup button listeners
var buttons = ["G","R","Y","B","O","N","NE","E","SE","S","SW","W","NW","Start","Select"];
var currentlyPressedFrets = [0, 0, 0, 0, 0];
var octaveShift = -12;
var notes = [40+octaveShift, 45+octaveShift, 47+octaveShift, 50+octaveShift, 52+octaveShift];

for (let i = 0; i < buttons.length; i++) {
    let type = i < 5 ? 'fret' : (i < 13 ? 'dpad' : 'menu');
    gc.on(buttons[i]+':press', function() {
        if (type === 'fret') {
            currentlyPressedFrets[i] = 1;
        }
        if (type === 'dpad' && (buttons[i] === 'N' || buttons[i] === 'S')) {
            for (let f = 0; f < currentlyPressedFrets.length; f++) {
                port.send([0x90,notes[f],0])
                .send([0x90,notes[f],Math.round(127-Math.random()*30)*currentlyPressedFrets[f]]);
            }
        }
        io.emit('controller-input', {
            "type": type,
            "id": buttons[i],
            "data": 1,
        });
    });
    
    gc.on(buttons[i]+':release', function() {
        if (type === 'fret') {
            currentlyPressedFrets[i] = 0;
            port.send([0x90, notes[i], 0]);
        }

        io.emit('controller-input', {
            "type": type,
            "id": buttons[i],
            "data": 0,
        });
    });
}

gc.on('WHAMMY:move', function(e) {
    io.emit('controller-input', {
        "type": "axis",
        "id": 'WHAMMY',
        "data": {"x":e.x/255, "y":e.y/255},
    });
});

gc.on('GUITAR:move', function(e) {
    io.emit('controller-input', {
        "type": "axis",
        "id": 'GUITAR',
        "data": {"x":e.x/255, "y":e.y/255},
    });
});
/*
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
    port.close();
    process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));*/