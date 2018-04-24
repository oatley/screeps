var gatherEnergy = require('gather.energy');

var creepExplorer = {
    
    explore: function (creep, room) {
        var position = new RoomPosition(25, 25, room);
        creep.moveTo(position, {visualizePathStyle: {stroke: '#ffffff'}});
        if (Game.rooms[room] != null) {
            //console.log ('you in a roooooooom bro');
            //Game.rooms[room].claim
            var tryClaim = creep.claimController(Game.rooms[room].find(STRUCTURE_CONTROLLER));
            if (tryClaim == ERR_GCL_NOT_ENOUGH) { // Global Control level not high enough
                // Maybe harvest something
                gatherEnergy.gather(creep);
            } else if (tryClaim == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.rooms[room].find(STRUCTURE_CONTROLLER));
            } else if (tryCLaim == 0) {
                console.log('explorer just claimed room: ' + room);
            } else {
                console.log('something went wrong with explorer');
            }
        }
    }
    
};

module.exports = creepExplorer;