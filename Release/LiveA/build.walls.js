var buildWalls = {
    new: function(room) {
        let exits = Game.map.describeExits(room);
        for (let exit in exits) {
            //FIND_EXIT_TOP: 1,
            //FIND_EXIT_RIGHT: 3,
            //FIND_EXIT_BOTTOM: 5,
            //FIND_EXIT_LEFT: 7,
            console.log(exit, exits[exit], FIND_EXIT_RIGHT);
            if (exit == FIND_EXIT_RIGHT) {
                let x = 49;
                for (let y in _.range(0,50)) {
                    let terrain = Game.map.getTerrainAt(x, y, room.name);
                    if (terrain == 'plain') {
                        console.log('[build.walls] - Found exit', room.name, terrain, x, y);
                    } else {
                        console.log('[build.walls] - NOT AN EXIT', room.name, terrain, x, y);
                    }
                }
            }
        }
    }
};

module.exports = buildWalls;
