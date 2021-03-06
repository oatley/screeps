var buildExtensions = {
  
    new: function () {
        let room = Game.rooms[Object.keys(Game.rooms)[0]];
        let spawnTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
        let extensionTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION);}
        });
        let roadTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_ROAD);}
        });
        let constructionTargets = room.find(FIND_CONSTRUCTION_SITES);
        
        // Control extension direction to place relative to spawn
        let extDir = '';
        let extDirList = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
        let noBuild = false;
        let distanceFromSpawn = 3;
        
        // Create a pattern using these arrays objects (eg. this is an X)
        let extNum = [{x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: -1, y: -1}];
        
        // Create road around the extension
        let roadNum = [{x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: -1, y: -1}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];
        
        // New construction pos
        let extPos = {x: 0, y: 0};
        
        
        // Relative to spawn pos
        let spawnX = 0;
        let spawnY = 0;
        
        // Construct 
        let extConstruct = 0;
        let destroyRoad = 0
        
        for (let i in extDirList) {
            extDir = extDirList[i];
            if (extDir == 'UP') {
                extPos = {x: 0, y: -distanceFromSpawn};
            } else if (extDir == 'RIGHT') {
                extPos = {x: distanceFromSpawn, y: 0};
            } else if (extDir == 'DOWN') {
                extPos = {x: 0, y: distanceFromSpawn};
            } else if (extDir == 'LEFT') {
                extPos = {x: -distanceFromSpawn, y: 0};
            }
            
            for (let e in extNum) {
                spawnX = spawnTargets[0].pos.x + extPos.x + extNum[e].x;
                spawnY = spawnTargets[0].pos.y + extPos.y + extNum[e].y;
                //console.log(spawnY, spawnX);
                extConstruct = room.createConstructionSite(spawnX, spawnY, STRUCTURE_EXTENSION);
                if ( extConstruct == OK ) {
                    console.log('[build.extensions] - construction site created');
                } else if ( extConstruct == ERR_RCL_NOT_ENOUGH ){
                    //console.log('[build.extensions] - room level too low to build');
                } else if ( extConstruct == ERR_INVALID_TARGET ) {
                    console.log('[build.extensions] - structure cannot be placed there', spawnX, spawnY, extensionTargets.length );
                    for (var v in roadTargets) {
                        if (roadTargets[v].pos.x == spawnX && roadTargets[v].pos.y == spawnY) {
                            destroyRoad = roadTargets[e].destroy();
                            if ( destroyRoad == OK ){
                                console.log('[build.extensions] - destroyed road')
                            }
                        }
                    }
                    extConstruct = room.createConstructionSite(spawnX, spawnY, STRUCTURE_EXTENSION);
                    if ( extConstruct == OK ){
                        console.log('[build.extensions] - construction site created');
                    } else {
                        console.log('[build.extensions] - something went wrong destroying roads' + extConstruct.toString());
                    }
                } else {
                    console.log('[build.extensions] - something went wrong' + extConstruct.toString());
                }
                /*if (extConstruct == OK) {
                    for (let r in roadNum) {
                        let roadX = spawnX + roadNum[r].x;
                        let roadY = spawnY + roadNum[r].y;
                        if (room.createConstructionSite(roadX, roadY, STRUCTURE_ROAD)) {
                            console.log('[build.extensions] - build road around each extension');
                        }
                    }
                }*/
                
                
            }
        }
    }
};

module.exports = buildExtensions;