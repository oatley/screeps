//FIND_EXIT_TOP: 1,
//FIND_EXIT_RIGHT: 3,
//FIND_EXIT_BOTTOM: 5,
//FIND_EXIT_LEFT: 7,
var findExits = {
    updateMemoryLocations: function(room, forceUpdate = false) {
        let exits = Game.map.describeExits(room.name);
        let x = 0;
        let y = 0;
        let exitToUse = {};

        if (forceUpdate) {
            room.memory.exits = {};
        }

        for (let side in exits) {
            if (!room.memory.exits) {
                if (!room.memory) room.memory = {};
                room.memory.exits = {};
                console.log('[find.exits] - creating new memory for exits');
            }
            if (!room.memory.exits[side]) {
                exitToUse.memory = room.memory.exits[side] = {};
                exitToUse.memory.positions = [];
                exitToUse.memory.storedExits = false;
                console.log('[find.exits] - creating new memory for exit');
            } else {
                exitToUse.memory = room.memory.exits[side];
            }

            if (!room.memory.exits[side].storedExits) {
                console.log('side is:', side);
                for (let pos in _.range(0,50)) {
                    x = pos;    // Will get overwritten depending on side
                    y = pos;    // Will get overwritten depending on side
                    if (side == FIND_EXIT_TOP) {
                        y = 0;
                    } else if (side == FIND_EXIT_RIGHT) {
                        x = 49;
                    } else if (side == FIND_EXIT_BOTTOM) {
                        y = 49;
                    } else if (side == FIND_EXIT_LEFT) {
                        x = 0;
                    }

                    let roomPos = new RoomPosition(x, y, room.name);
                    let terrain = Game.map.getTerrainAt(roomPos);
                    if (terrain == 'plain') {
                        //console.log('[find.exits] - Found exit', side, room.name, terrain, x, y);
                        room.memory.exits[side].positions.push(roomPos);
                    }
                }
                room.memory.exits[side].storedExits = true;
            }
        }
    }
};

module.exports = findExits;
