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
            // Exit positions
            let x = 0;
            let y = 0;
            // Move wall 2 positions away from edge of map
            let wallX = 0;
            let wallY = 0;
            // Determine edges of wall
            let startX = 0;
            let startY = 0;
            let endX = 0;
            let endY = 0;
            // Add these to increase wall edge size
            let startEdge = {};
            let endEdge = {};
            // Close the start and end edges, move wall back to edge
            let closeEdge = {};
            let closeStartX = 0;
            let closeStartY = 0;
            let closeEndX = 0;
            let closeEndY = 0;
            // Construct
            let construct = -10;

            console.log(side);
            if (side == FIND_EXIT_TOP) {
                wallX = 0;
                wallY = 2;
                startEdge = [{x: -1, y: 0}, {x: -2, y: 0}];
                endEdge = [{x: 1, y: 0}, {x: 2, y: 0}];
                closeEdge = [{x: 0, y: -1}, {x: 0, y: -2}];
            } else if (side == FIND_EXIT_RIGHT) {
                wallX = -2;
                wallY = 0;
                startEdge = [{x: 0, y: -1}, {x: 0, y: -2}];
                endEdge = [{x: 0, y: 1}, {x: 0, y: 2}];
                closeEdge = [{x: 1, y: 0}, {x: 2, y: 0}];
                continue;
            } else if (side == FIND_EXIT_BOTTOM) {
                wallX = 0;
                wallY = -2;
                startEdge = [{x: -1, y: 0}, {x: -2, y: 0}];
                endEdge = [{x: 1, y: 0}, {x: 2, y: 0}];
                closeEdge = [{x: 0, y: 1}, {x: 0, y: 2}];
                continue;
            } else if (side == FIND_EXIT_LEFT) {
                wallX = 2;
                wallY = 0;
                startEdge = [{x: 0, y: -1}, {x: 0, y: -2}];
                endEdge = [{x: 0, y: 1}, {x: 0, y: 2}];
                closeEdge = [{x: -1, y: 0}, {x: -2, y: 0}];
                continue;
            }
            // Line across all exits
            for (let i in room.memory.exits[side].positions) {
                let roomPos = room.memory.exits[side].positions[i];
                x = roomPos.x + wallX;
                y = roomPos.y + wallY;

                //console.log(Math.round((room.memory.exits[side].positions.length + 1) / 2), (Number(i) + 1))
                if ((Number(i) + 1) == Math.round((room.memory.exits[side].positions.length + 1) / 2)) { // Find centre of index, build rampart here instead of wall
                    console.log('[build.walls] - Found middle building rampart', x, y, i);
                    //construct = room.createConstructionSite(x, y, STRUCTURE_RAMPART);
                    if ( construct == OK ) {
                        console.log('[build.walls] - construction site created for rampart');
                    }
                } else { // build walls
                    console.log('[build.walls] - build wall', roomPos.roomName, x, y, i);
                    //construct = room.createConstructionSite(x, y, STRUCTURE_WALL);
                    if ( construct == OK ) {
                        console.log('[build.walls] - construction site created for walls');
                    }
                }
            }
            // Extra 2 on each side
            for (let modStartPos in startEdge) {
                for (let modEndPos in endEdge) {
                    startX = room.memory.exits[side].positions[0].x + wallX + startEdge[modStartPos].x;
                    startY = room.memory.exits[side].positions[0].y + wallY + startEdge[modStartPos].y;
                    endX = room.memory.exits[side].positions[room.memory.exits[side].positions.length-1].x + wallX + endEdge[modEndPos].x;
                    endY = room.memory.exits[side].positions[room.memory.exits[side].positions.length-1].y + wallY + endEdge[modEndPos].y;
                    //console.log(startX, startY, endX, endY);
                    //construct = room.createConstructionSite(startX, startY, STRUCTURE_WALL);
                    console.log('[build.walls] - Found middle building extra walls', startX, startY);
                    if ( construct == OK ) {
                        console.log('[build.walls] - construction site created for extra walls');
                    }
                    //construct = room.createConstructionSite(endX, endY, STRUCTURE_WALL);
                    console.log('[build.walls] - Found middle building extra walls', endX, endY);
                    if ( construct == OK ) {
                        console.log('[build.walls] - construction site created for extra walls');
                    }
                    for (let modCloseEdge in closeEdge) {
                        closeStartX = startX + closeEdge[modCloseEdge].x;
                        closeStartY = startY + closeEdge[modCloseEdge].y;
                        closeEndX = endX + closeEdge[modCloseEdge].x;
                        closeEndY = endY + closeEdge[modCloseEdge].y;
                        //    console.log(startX, startY, endX, endY);
                        //construct = room.createConstructionSite(startX, startY, STRUCTURE_WALL);
                        console.log('[build.walls] - Found middle building edge walls', closeStartX, closeStartY);
                        if ( construct == OK ) {
                            console.log('[build.walls] - construction site created for edge walls');
                        }
                        //construct = room.createConstructionSite(endX, endY, STRUCTURE_WALL);
                        console.log('[build.walls] - Found middle building edge walls', closeEndX, closeEndY);
                        if ( construct == OK ) {
                            console.log('[build.walls] - construction site created for edge walls');
                        }
                    }
                }
            }
        }


    }
};

module.exports = buildWalls;
