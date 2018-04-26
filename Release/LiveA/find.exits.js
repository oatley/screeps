//FIND_EXIT_TOP: 1,
//FIND_EXIT_RIGHT: 3,
//FIND_EXIT_BOTTOM: 5,
//FIND_EXIT_LEFT: 7,
var findExits = {
    updateMemoryLocations: function(room, forceUpdate = false) {
        let exits = Game.map.describeExits(room.name);
        let x = 0;
        let y = 0;
        let terrain = '';
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

                    terrain = Game.map.getTerrainAt(x, y, room.name);
                    if (side == 5) {
                        console.log('[find.exits] - ', side, room.name, terrain, x, y);
                        console.log (0,49,Game.map.getTerrainAt(0, 49, 'W5N8'));
                        console.log (49,49,Game.map.getTerrainAt(49, 49, 'W5N8'));
                        terrain = Game.map.getTerrainAt(x, y, 'W5N8');
                        console.log(x,y,terrain);

                    }
                    if (terrain == 'plain') {
                        //console.log('[find.exits] - Found exit', side, room.name, terrain, x, y);
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
