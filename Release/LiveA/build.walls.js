var buildWalls = {
    new: function(room) {
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
            if (side == FIND_EXIT_TOP) {
                let wallX = 0;
                let wallY = 2;
            } else if (side == FIND_EXIT_RIGHT) {
                let wallX = -2;
                let wallY = 0;
            } else if (side == FIND_EXIT_BOTTOM) {
                let wallX = 0;
                let wallY = -2;
            } else if (side == FIND_EXIT_LEFT) {
                let wallX = 2;
                let wallY = 0;
            }
            // Line across all exits
            for (let roomPos in room.memory.exits[side].positions) {
                x = roomPos.x + wallX;
                y = roomPos.y + wallY;
                console.log(roomPos.roomName, x, y);
            }
        }


    }
};

module.exports = buildWalls;
