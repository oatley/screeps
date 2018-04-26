var buildWalls = {
    new: function(room) {
        var towerTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
        });
        // Find exits before building walls
        if (!room.memory.exits) {
            console.log('[build.walls] - need to find exits before building walls');
            return;
        }
        // Do not try and build walls if you are unable to defend yourself anyway
        if (room.controller.level < 3 || towerTargets.length < 1) {
            return;
        }

        for (let side in room.memory.exits) {
            let x = 0;
            let y = 0;
            let wallX = 0;
            let wallY = 0;
            console.log(side);
            if (side == FIND_EXIT_TOP) {
                wallX = 0;
                wallY = 2;
            } else if (side == FIND_EXIT_RIGHT) {
                wallX = -2;
                wallY = 0;
            } else if (side == FIND_EXIT_BOTTOM) {
                wallX = 0;
                wallY = -2;
            } else if (side == FIND_EXIT_LEFT) {
                wallX = 2;
                wallY = 0;
            }
            // Line across all exits
            for (let i in room.memory.exits[side].positions) {
                let roomPos = room.memory.exits[side].positions[i];
                x = roomPos.x + wallX;
                y = roomPos.y + wallY;
                console.log(roomPos.roomName, x, y);
            }
        }


    }
};

module.exports = buildWalls;
