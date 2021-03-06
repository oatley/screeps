Source.prototype.memory = undefined;
var buildRoads = {
    new: function () {
        //Object.keys(Game.rooms)[0]
        var room = Game.rooms[Object.keys(Game.rooms)[0]];
        var spawnTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
        var towerTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
        });
        var extensionTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION);}
        });
        var sources = room.find(FIND_SOURCES);
        //var sourceToUse = sources[0];
        
        
        //return;
        
        // findPath(fromPos, toPos, [opts]) might be the way to do this, I don't know how to ignore creeps with patherfinder search
        
        for ( var i in sources) {
            var sourceToUse = sources[i];
            var pathToSpawn = {};
            // Create the path memory variable
            if (!Memory.rooms) {
                room.memory.sources = {};
                console.log('creating new memory for sources');
            }
            //if (!room.memory.sources[sourceToUse.id]) {
            if (!room.memory.sources[sourceToUse.id] ) {
                sourceToUse.memory = room.memory.sources[sourceToUse.id] = {};
                sourceToUse.memory.createdPath = false;
                //pathToSpawn = PathFinder.search(spawnTargets[0].pos, sourceToUse.pos, {range: 2});
                pathToSpawn = room.findPath(spawnTargets[0].pos, sourceToUse.pos, {range: 1, ignoreCreeps: true});
                sourceToUse.memory.pathToSpawn = pathToSpawn;
                //console.log(spawnTargets[0].pos.x, spawnTargets[0].pos.y);
                //console.log(sourceToUse.pos.x, sourceToUse.pos.y);
                
                console.log('creating new memory for source ids');
            } else {
                //console.log('didntwork');
                
            }
            
            //return;
            
            if(!room.memory.sources[sourceToUse.id].createdPath) {
                //console.log('create a new path here');
                for ( var i  in pathToSpawn ) {
                    var construct = room.createConstructionSite(pathToSpawn[i]['x'], pathToSpawn[i]['y'], STRUCTURE_ROAD);
                    if ( construct == OK ){
                        console.log("[build.roads] - construction site created");
                        room.memory.sources[sourceToUse.id].createdPath = true;
                    } else if (construct == ERR_RCL_NOT_ENOUGH) {
                        console.log("[build.roads] - ERR_RCL_NOT_ENOUGH" + construct.toString());
                    }else if (construct == ERR_INVALID_TARGET) {
                        console.log("[build.roads] - ERR_INVALID_TARGET" + construct.toString());
                    } else {
                        console.log("[build.roads] - something went wrong" + construct.toString());
                    }
                }
            }
        }
    }
};

module.exports = buildRoads;