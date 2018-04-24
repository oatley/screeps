var buildExtensions = {
  
    new: function () {
        var room = Game.rooms[Object.keys(Game.rooms)[0]];
        var spawnTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
        var extensionTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION);}
        });
        var roadTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_ROAD);}
        });
        var constructionTargets = room.find(FIND_CONSTRUCTION_SITES);
        if (constructionTargets.length == 0) {
            if (extensionTargets.length > 0){
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
            }
        }
    }
};

module.exports = buildExtensions;