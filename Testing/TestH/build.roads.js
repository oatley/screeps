Source.prototype.memory = undefined;
var buildRoads = {
    buildToSource: function () {
        
        // Static room object for now
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
        
        
        
        // Skip building roads if you are a noob without extensions
        if (room.controller.level <= 2 && extensionTargets <= 5) {
            return;
        }
        
        
        for ( var i in sources) {
            var sourceToUse = sources[i];
            var pathToSpawn = {};
            // Create the path memory variable
            if (!room.memory.sources) {
                if (!room.memory) room.memory = {};
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
            
            if(!room.memory.sources[sourceToUse.id].createdPath || false) {
                //console.log('create a new path here');
                for ( var i  in pathToSpawn ) {
                    var construct = room.createConstructionSite(pathToSpawn[i]['x'], pathToSpawn[i]['y'], STRUCTURE_ROAD);
                    if ( construct == OK ){
                        console.log("[build.roads] - construction site created");
                        room.memory.sources[sourceToUse.id].createdPath = true;
                    } else if (construct == ERR_RCL_NOT_ENOUGH) {
                        console.log("[build.roads] - ERR_RCL_NOT_ENOUGH" + construct.toString());
                    }else if (construct == ERR_INVALID_TARGET) {
                        //console.log("[build.roads] - ERR_INVALID_TARGET" + construct.toString());
                    } else {
                        console.log("[build.roads] - something went wrong" + construct.toString());
                    }
                }
            }
        }
    },
    buildToExtension: function () {
        //Object.keys(Game.rooms)[0]
        var room = Game.rooms[Object.keys(Game.rooms)[0]];
        var spawnTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
        var towerTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
        });
        var extensions = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION);}
        });
        
        // Create road around the extension
        let roadNum = [{x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: -1, y: -1}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];
        
        // Make the function accept arguments that let it build to other things
        for ( var i in extensions ) {
            var extensionToUse = extensions[i];
            //console.log(extensionToUse.id);
            var pathToSpawn = {};
            // Create the path memory variable
            if (!room.memory.extensions) {
                if (!room.memory) room.memory = {};
                room.memory.extensions = {};
                console.log('creating new memory for extensions');
            }
            //if (!room.memory.extensionTargets[extensionToUse.id]) {
            if (!room.memory.extensions[extensionToUse.id] ) {
                extensionToUse.memory = room.memory.extensions[extensionToUse.id] = {};
                extensionToUse.memory.createdPath = false;
                //pathToSpawn = PathFinder.search(spawnTargets[0].pos, extensionToUse.pos, {range: 2});
                pathToSpawn = room.findPath(spawnTargets[0].pos, extensionToUse.pos, {range: 1, ignoreCreeps: true, swampCost: 1});
                extensionToUse.memory.pathToSpawn = pathToSpawn;
                //console.log(spawnTargets[0].pos.x, spawnTargets[0].pos.y);
                //console.log(extensionToUse.pos.x, extensionToUse.pos.y);
                
                console.log('creating new memory for extension ids');
            } else {
                //console.log('didntwork');
                
            }
            
            //return;
            
            if(!room.memory.extensions[extensionToUse.id].createdPath) {
                //console.log('create a new path here');
                for ( var i  in pathToSpawn ) {
                    var construct = room.createConstructionSite(pathToSpawn[i]['x'], pathToSpawn[i]['y'], STRUCTURE_ROAD, {swampCost: 1});
                    if ( construct == OK ){
                        console.log("[build.roads] - construction site created");
                        room.memory.extensions[extensionToUse.id].createdPath = true;
                    } else if (construct == ERR_RCL_NOT_ENOUGH) {
                        console.log("[build.roads] - ERR_RCL_NOT_ENOUGH" + construct.toString());
                    }else if (construct == ERR_INVALID_TARGET) {
                        console.log("[build.roads] - ERR_INVALID_TARGET" + construct.toString());
                    } else {
                        console.log("[build.roads] - something went wrong" + construct.toString());
                    }
                }
                for (let r in roadNum) {
                    let roadX = extensionToUse.pos.x + roadNum[r].x;
                    let roadY = extensionToUse.pos.y + roadNum[r].y;
                    let roadConstruct = room.createConstructionSite(roadX, roadY, STRUCTURE_ROAD);
                    if (roadConstruct == OK) {
                        console.log('[build.extensions] - build road around each extension');
                    } else {
                        console.log('[build.extensions] - bAHHHHHHHHH');
                    }
                }
            }
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
};

module.exports = buildRoads;