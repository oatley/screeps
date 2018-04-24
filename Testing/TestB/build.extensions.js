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
        if (constructionTargets.length == 0 && extensionTargets == 0) {
            var spawnx = spawnTargets[0].pos.x - 2; 
            var spawny = spawnTargets[0].pos.y + 4;
            Game.rooms[Object.keys(Game.rooms)[0]].createConstructionSite(spawnx, spawny, STRUCTURE_EXTENSION);
            console.log("creating construction site");
        }
    }  
};

module.exports = buildExtensions;