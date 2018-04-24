var buildExtensions = {
  
    new: function () {
        Object.keys(Game.rooms)[0]
        var spawnTargets = Game.rooms[Object.keys(Game.rooms)[0]].find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
        var extensionTargets = Game.rooms[Object.keys(Game.rooms)[0]].find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION);}
        });
        var constructionTargets = Game.rooms[Object.keys(Game.rooms)[0]].find(FIND_CONSTRUCTION_SITES);
        if (constructionTargets.length == 0) {
            if (extensionTargets.length > 0) {
                var spawnx = extensionTargets[extensionTargets.length-1].pos.x + 1; 
                var spawny = extensionTargets[extensionTargets.length-1].pos.y;  
            } else {
                var spawnx = spawnTargets[0].pos.x - 2; 
                var spawny = spawnTargets[0].pos.y + 4;
            }
            var construct = Game.rooms[Object.keys(Game.rooms)[0]].createConstructionSite(spawnx, spawny, STRUCTURE_EXTENSION);
            if ( construct == 0 ) {
                console.log("[build] - construction site created");
            } else if ( construct == -14 ){
                //console.log("[build] - room level too low to build");
            } else if ( construct == -7 ) {
                console.log("[build] - structure cannot be placed there", spawnx, spawny, extensionTargets.length );  
                // if it can't be placed there maybe increment random numbers until it finds a spot
                var spawnx = extensionTargets[extensionTargets.length-1].pos.x; 
                var spawny = extensionTargets[extensionTargets.length-1].pos.y - 1;
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