const GameController = require('gamecontroller');
const JZZ = require('jzz');

const gc = new GameController('xbox360-guitar-xplorer');

gc.connect();

port = JZZ().or('Cannot start MIDI engine!')
.openMidiOut().or('Cannot open MIDI Out port!');

var latest;
var buttons = ["G","R","Y","B","O","N","NE","E","SE","S","SW","W","NW","Start","Select"];
//var notes = [60, 62, 65, 67, 69];
for (let i = 0; i < buttons.length; i++) {
    gc.on(buttons[i]+':press', function() {
        if (latest !== buttons[i]) {
            //port.send([0x90,notes[i],127]);
            latest = buttons[i];
            console.log(latest);
        }
    });
    
    gc.on(buttons[i]+':release', function() {
        if (latest !== "") {
            //port.send([0x90,notes[i],0]);
            latest = "";
            console.log(latest);
        }
    });
}


gc.on('WHAMMY:move', function(o) {
    console.log(o);
});

gc.on('all', function(o) {
    console.log(o);
});