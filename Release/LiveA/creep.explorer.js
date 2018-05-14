var gatherEnergy = require('gather.energy');

var creepExplorer = {

    explore: function (creep, room) {
        // If explorer is not in the right room then go there
        if (creep.room.name != room.name) {
            var position = new RoomPosition(25, 25, room);
            creep.moveTo(position, {visualizePathStyle: {stroke: '#ffffff'}});
            return;
        }
        // Inside the room it should be in
        if (Game.rooms[room].controller.owner == 'oatley') { // Static username because why the hell not? Fight me!
            console.log('explorer you own this room');
            // check if spawn exists and build it if it doesn't
        } else { // Not the owner of the room
            var tryClaim = creep.claimController(Game.rooms[room].find(STRUCTURE_CONTROLLER));
            if (tryClaim == ERR_GCL_NOT_ENOUGH) { // Global Control level not high enough
                // Maybe harvest something
                //gatherEnergy.gather(creep);
                console.log('bro why are you here you are low level');
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
