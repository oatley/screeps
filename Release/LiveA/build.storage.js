
let buildStorage = {

    new: function(room) {
        //let room = Game.rooms[Object.keys(Game.rooms)[0]];
        let spawnTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
        let storageTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE);}
        });

        if (room.controller.level < 4 || storageTargets.length > 0) {
            return;
        }

        // Find a valid spot for the storage
        let storageDirList = ['TOPRIGHT', 'BOTTOMRIGHT', 'BOTTOMLEFT', 'TOPLEFT'];
        let distanceFromSpawn = 3;
        let storageDirPos = {x: 0, y: 0};

        for (let i in storageDirList) {
            storageDir = storageDirList[i];
            if (storageDir == 'TOPRIGHT') {
                storageDirPos = {x: distanceFromSpawn, y: -distanceFromSpawn};
            } else if (storageDir == 'BOTTOMRIGHT') {
                storagePos = {x: distanceFromSpawn, y: distanceFromSpawn};
            } else if (storageDir == 'BOTTOMLEFT') {
                storagePos = {x: -distanceFromSpawn, y: distanceFromSpawn};
            } else if (storageDir == 'TOPLEFT') {
                storagePos = {x: -distanceFromSpawn, y: -distanceFromSpawn};
            }
            spawnX = spawnTargets[0].pos.x + storageDirPos.x;
            spawnY = spawnTargets[0].pos.y + storageDirPos.y;
            storageConstruct = room.createConstructionSite(spawnX, spawnY, STRUCTURE_STORAGE);
            if ( storageConstruct == OK ) {
                console.log('[build.storage] - construction site created');
                return;
            } else if ( storageConstruct == ERR_RCL_NOT_ENOUGH ){
                //console.log('[build.storageensions] - room level too low to build');
            } else if ( storageConstruct == ERR_INVALID_TARGET ) {
                console.log('[build.storage] - structure cannot be placed there', spawnX, spawnY );
            } else {
                console.log('[build.storage] - something went wrong');
            }
        }
    }
};

module.exports = buildStorage;
