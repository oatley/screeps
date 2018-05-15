let buildTowers = {
    new: function (room) {
        //let room = Game.rooms[Object.keys(Game.rooms)[0]];
        let spawnTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
        let towerTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
        });
        let extensionTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION);}
        });
        let constructionTargets = room.find(FIND_CONSTRUCTION_SITES);

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

        let spawnx = 0;
        let spawny = 0;
        let construct = null;
        if (constructionTargets.length == 0) {
            if (towerTargets.length > 0) {
                spawnx = spawnTargets[0].pos.x - 10;
                spawny = spawnTargets[0].pos.y;
                console.log(spawnx, spawny);
            } else {
                spawnx = spawnTargets[0].pos.x + 10;
                spawny = spawnTargets[0].pos.y;
                console.log(spawnx, spawny);
            }
            construct = room.createConstructionSite(spawnx, spawny, STRUCTURE_TOWER);
            console.log(spawnx, spawny);
            if ( construct == 0 ) {
                console.log("[build] - construction site created");
                console.log(spawnx, spawny);
            } else if ( construct == -14 ) {
                //console.log("[build] - room level too low to build");
            } else if ( construct == -7 ) {
                console.log("[build] - structure cannot be placed there", spawnx, spawny, towerTargets.length );
                // if it can't be placed there maybe increment random numbers until it finds a spot
                spawnx = spawnx - 1;
                spawny = spawny - 1;
                construct = room.createConstructionSite(spawnx, spawny, STRUCTURE_TOWER);
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
