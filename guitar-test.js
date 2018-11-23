const GameController = require('gamecontroller');
const JZZ = require('jzz');

const gc = new GameController('xbox360XplorerGuitar');

gc.connect();

port = JZZ().or('Cannot start MIDI engine!')
.openMidiOut().or('Cannot open MIDI Out port!');

var buttons = ["G","R","Y","B","O","Up","Down"];
var notes = [60, 62, 65, 67, 69];
for (let i = 0; i < notes.length; i++) {
    gc.on(buttons[i]+':press', function() {
        port.send([0x90,notes[i],127]);
        console.log(buttons[i]+" Pressed");
    });
    
    gc.on(buttons[i]+':release', function() {
        port.send([0x90,notes[i],0]);
        console.log(buttons[i]+" Released");
    });
}


gc.on('WHAMMY:move', function(o) {
    console.log(o);
});