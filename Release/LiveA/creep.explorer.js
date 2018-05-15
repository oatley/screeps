var gatherEnergy = require('gather.energy');
let creepHarvester = require('creep.harvester');
let creepBuilder = require('creep.builder');

var creepExplorer = {

    explore: function (creep) {
        // If explorer is not in the right room then go there
        let room = creep.memory.roomToExplore;
        if (creep.room.name != room) {
            creep.say('explore');
            var position = new RoomPosition(25, 25, room); // might need to find a better path
            creep.moveTo(position, {visualizePathStyle: {stroke: '#ffffff'}});
            return;
        }
        // Inside the room it should be in

        //console.log(Game.rooms[room].controller.owner.username == 'oatley', Game.rooms[room].controller.owner.username);
        if ((Game.rooms[room].controller.owner) && (Game.rooms[room].controller.owner.username) &&  (Game.rooms[room].controller.owner.username == 'oatley')) { // Static username because why the hell not? Fight me!
            //console.log('explorer you own this room');
            // check if spawn exists and build it if it doesn't
            if (creep.carry.energy < creep.carryCapacity) {
                //console.log('explorer is harvesting');
                //creepHarvester.work(creep);
                //gatherEnergy.gather(creep);
                creepBuilder.work(creep);
            } else {
                // Build a spawn
                let spawnTargets = Game.rooms[room].find(FIND_STRUCTURES, {
                            filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
                });
                let constructionTargets = Game.rooms[room].find(FIND_CONSTRUCTION_SITES);
                let sources = Game.rooms[room].find(FIND_SOURCES);
                let distance = 10;
                let spawnx = sources[0].pos.x;
                let spawny = sources[0].pos.y;
                let x;
                let y;
                while (spawnTargets.length == 0 && constructionTargets.length == 0 && distance > 2) { // create a spawn
                    constructionTargets = Game.rooms[room].find(FIND_CONSTRUCTION_SITES);
                    x = spawnx + distance;
                    y = spawny;
                    if (Game.rooms[room].createConstructionSite(x, y, STRUCTURE_SPAWN) == 0) break;
                    x = spawnx - distance;
                    y = spawny;
                    if (Game.rooms[room].createConstructionSite(x, y, STRUCTURE_SPAWN) == 0) break;
                    x = spawnx;
                    y = spawny + distance;
                    if (Game.rooms[room].createConstructionSite(x, y, STRUCTURE_SPAWN) == 0) break;
                    x = spawnx;
                    y = spawny - distance;
                    if (Game.rooms[room].createConstructionSite(x, y, STRUCTURE_SPAWN) == 0) break;
                    distance -=1;
                }
                creepBuilder.work(creep);
            }


        } else { // Not the owner of the room
            let tryClaim = creep.claimController(Game.rooms[room].controller);
            console.log(Game.rooms[room].controller);
            if (tryClaim == ERR_GCL_NOT_ENOUGH) { // Global Control level not high enough
                // Maybe harvest something
                //gatherEnergy.gather(creep);
                console.log('[creep.explorer] - bro why are you here you are low level');
            } else if (tryClaim == ERR_NOT_IN_RANGE) {
                console.log('[creep.explorer] - moving');
                creep.moveTo(Game.rooms[room].controller);
            } else if (tryClaim == 0) {
                console.log('[creep.explorer] - explorer just claimed room: ' + room);
            } else {
                console.log('[creep.explorer] - something went wrong with explorer', tryClaim);
            }
        }
    }

};

module.exports = creepExplorer;
