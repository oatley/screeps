var buildTowers = {
    new: function (room) {
        //let room = Game.rooms[Object.keys(Game.rooms)[0]];
        var spawnTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
        var towerTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
        });
        var extensionTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION);}
        });
        var constructionTargets = room.find(FIND_CONSTRUCTION_SITES);

        // Do not try and build if you are at max number for the level
        if (room.controller.level == 2 && towerTargets.length >= 1) {
            return;
        } else if(room.controller.level == 3 && towerTargets.length >= 1) {
            return;
        } else if(room.controller.level == 4 && towerTargets.length >= 1) {
            return;
        } else if(room.controller.level == 5 && towerTargets.length >= 2) {
            return;
        } else if(room.controller.level == 6 && towerTargets.length >= 2) {
            return;
        } else if(room.controller.level == 7 && towerTargets.length >= 3) {
            return;
        } else if(room.controller.level == 8 && towerTargets.length >= 6) {
            return;
        } else {
            //console.log('[build.towers] - trying to build towers');
        }



        if (constructionTargets.length == 0) {
            if (towerTargets.length > 0) {
                var spawnx = spawnTargets[0].pos.x - 10;
                var spawny = spawnTargets[0].pos.y;
                console.log(spawnx, spawny);
            } else {
                var spawnx = spawnTargets[0].pos.x + 10;
                var spawny = spawnTargets[0].pos.y;
                console.log(spawnx, spawny);
            }
            var construct = room.createConstructionSite(spawnx, spawny, STRUCTURE_TOWER);
            console.log(spawnx, spawny);
            if ( construct == 0 ) {
                console.log("[build] - construction site created");
                console.log(spawnx, spawny);
            } else if ( construct == -14 ) {
                //console.log("[build] - room level too low to build");
            } else if ( construct == -7 ) {
                console.log("[build] - structure cannot be placed there", spawnx, spawny, towerTargets.length );
                // if it can't be placed there maybe increment random numbers until it finds a spot
                var spawnx = spawnx - 1;
                var spawny = spawny - 1;
                var construct = room.createConstructionSite(spawnx, spawny, STRUCTURE_TOWER);
                if ( construct == 0 ){
                    console.log("[build] - construction site created");
                } else {
                    console.log("[build] - something went wrong" + construct.toString());
                }
            } else {
                console.log("[build] - something went wrong" + construct.toString());
            }
        }
    }
};

module.exports = buildTowers;
