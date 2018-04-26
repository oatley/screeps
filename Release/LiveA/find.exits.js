//FIND_EXIT_TOP: 1,
//FIND_EXIT_RIGHT: 3,
//FIND_EXIT_BOTTOM: 5,
//FIND_EXIT_LEFT: 7,
var findExits = {
    updateMemoryLocations: function(room) {
        let exits = Game.map.describeExits(room.name);
        let x = 0;
        let y = 0;
        let terrain = '';
        let exitToUse = {};
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
                    terrain = Game.map.getTerrainAt(x, y, room.name);
                    if (terrain == 'plain') {
                        console.log('[build.walls] - Found exit', room.name, terrain, x, y);
                        let position = new RoomPosition(x,y,room.name);
                        room.memory.exits[side].positions.push(position);
                    }
                }
                room.memory.exits[side].storedExits = true;
            }
        }
    }
};

module.exports = findExits;
