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
        //return;
        // Control extension direction to place relative to spawn
        let extDir = '';
        let extDirList = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
        let noBuild = false;
        let distanceFromSpawn = 3;
        
        
        // Create a pattern using these arrays objects (eg. this is an X)
        //let extNum = [{x: 0, y: 0}, {x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: -1, y: -1}];
        let extNum = [{x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: -1, y: -1}];
        
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
            }
        }
        
            
            
                
                
                
                
                
                
                
        //if (constructionTargets.length == 0) {        
            /*if (extensionTargets.length > 0){   
                if ( extensionTargets.length >= 10) {
                    var modY = Math.floor(extensionTargets.length/10);
                    var mod = extensionTargets.length % 10;
                    console.log(mod, modY);
                    if ( mod == 0) {
                        var spawnx = extensionTargets[0].pos.x; 
                        var spawny = extensionTargets[0].pos.y - modY;
                    } else { 
                        var spawnx = extensionTargets[extensionTargets.length-1].pos.x + 1; 
                        var spawny = extensionTargets[extensionTargets.length-1].pos.y;      
                    }
                } else {
                    var spawnx = extensionTargets[extensionTargets.length-1].pos.x + 1; 
                    var spawny = extensionTargets[extensionTargets.length-1].pos.y;  
                }
            } else {
                var spawnx = spawnTargets[0].pos.x - 2; 
                var spawny = spawnTargets[0].pos.y + 4;
            }
            var construct = Game.rooms[Object.keys(Game.rooms)[0]].createConstructionSite(spawnx, spawny, STRUCTURE_EXTENSION);
            if ( construct == 0 ) {
                console.log("[build] - construction site created");
            } else if ( construct == -14 ){
                console.log("[build] - room level too low to build");
            } else if ( construct == -7 ) {
                console.log("[build] - structure cannot be placed there", spawnx, spawny, extensionTargets.length );
                for (var e in roadTargets) {
                    if (roadTargets[e].pos.x == spawnx && roadTargets[e].pos.y == spawny) {
                        var attemptToDestroy = roadTargets[e].destroy();
                        if ( attemptToDestroy == 0 ){
                            console.log('[build.extensions] - destroyed road')
                        }
                    }
                        
                }
                var construct = Game.rooms[Object.keys(Game.rooms)[0]].createConstructionSite(spawnx, spawny, STRUCTURE_EXTENSION);
                if ( construct == 0 ){
                    console.log("[build] - construction site created");
                } else {
                    console.log("[build] - something went wrong" + construct.toString());
                }
            } else {
                console.log("[build] - something went wrong" + construct.toString());
            }*/
        //}
    }
};

module.exports = buildExtensions;