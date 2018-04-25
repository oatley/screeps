Source.prototype.memory = undefined;
var buildRoads = {
    buildToSource: function (forceRebuild = false) {

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

        // Create road around the tower
        //let roadNum = [{x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: -1, y: -1}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];
        let roadNum = [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];


        // Skip building roads if you are a noob without extensions
        if (room.controller.level <= 2 && extensionTargets <= 5) {
            return;
        }


        for (var i in sources) {
            var sourceToUse = sources[i];
            var pathToSpawn = {};
            // Create the path memory variable
            if (!room.memory.sources) {
                if (!room.memory) room.memory = {};
                room.memory.sources = {};
                console.log('[build.roads.sources] - creating new memory for sources');
            }
            //if (!room.memory.sources[sourceToUse.id]) {
            if (!room.memory.sources[sourceToUse.id]) {
                sourceToUse.memory = room.memory.sources[sourceToUse.id] = {};
                sourceToUse.memory.createdPath = false;
                //pathToSpawn = PathFinder.search(spawnTargets[0].pos, sourceToUse.pos, {range: 2});
                pathToSpawn = room.findPath(spawnTargets[0].pos, sourceToUse.pos, {range: 1, ignoreCreeps: true, ignoreRoads: true});
                sourceToUse.memory.pathToSpawn = pathToSpawn;
                //console.log(spawnTargets[0].pos.x, spawnTargets[0].pos.y);
                //console.log(sourceToUse.pos.x, sourceToUse.pos.y);

                console.log('[build.roads.sources] - creating new memory for source ids');
            } else {
                sourceToUse.memory = room.memory.sources[sourceToUse.id];
                pathToSpawn = sourceToUse.memory.pathToSpawn;
            }

            //return;

            if(!room.memory.sources[sourceToUse.id].createdPath || forceRebuild) {
                console.log('[build.roads.sources] - create a new path here');

                if (forceRebuild) {
                    room.memory.sources[sourceToUse.id].createdPath = true;
                }

                for ( var i  in pathToSpawn ) {
                    var construct = room.createConstructionSite(pathToSpawn[i]['x'], pathToSpawn[i]['y'], STRUCTURE_ROAD);
                    if ( construct == OK ){
                        console.log("[build.roads.sources] - construction site created");
                        room.memory.sources[sourceToUse.id].createdPath = true;
                    } else if (construct == ERR_RCL_NOT_ENOUGH) {
                        console.log("[build.roads.sources] - ERR_RCL_NOT_ENOUGH" + construct.toString());
                    }else if (construct == ERR_INVALID_TARGET) {
                        //console.log("[build.roads] - ERR_INVALID_TARGET" + construct.toString());
                    } else {
                        console.log("[build.roads.sources] - something went wrong" + construct.toString());
                    }
                }
                for (let r in roadNum) {
                    let roadX = sourceToUse.pos.x + roadNum[r].x;
                    let roadY = sourceToUse.pos.y + roadNum[r].y;
                    let roadConstruct = room.createConstructionSite(roadX, roadY, STRUCTURE_ROAD);
                    if (roadConstruct == OK) {
                        console.log('[build.roads.sources] - build road around each extension');
                    } else {
                        //console.log("[build.roads.sources] - no space to build surrounding road" + roadConstruct.toString());
                    }
                }
            }
        }
    },
    buildToExtension: function (forceRebuild = false) {
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
        var roads = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_ROAD);}
        });

        // Create road around the extension
        //let roadNum = [{x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: -1, y: -1}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];
        let roadNum = [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];

        // Make the function accept arguments that let it build to other things
        for ( var i in extensions ) {
            var extensionToUse = extensions[i];
            var pathToSpawn = {};
            // Create the path memory variable
            if (!room.memory.extensions) {
                if (!room.memory) room.memory = {};
                room.memory.extensions = {};
                console.log('[build.roads.extensions] - creating new memory for extensions');
            }
            if (!room.memory.extensions[extensionToUse.id]) {
                extensionToUse.memory = room.memory.extensions[extensionToUse.id] = {};
                extensionToUse.memory.createdPath = false;
                pathToSpawn = room.findPath(spawnTargets[0].pos, extensionToUse.pos, {range: 1, ignoreCreeps: true, swampCost: 1, ignoreRoads: true});
                extensionToUse.memory.pathToSpawn = pathToSpawn;

                console.log('[build.roads.extensions] - creating new memory for extension ids');
            } else {
                //console.log('didntwork');
                extensionToUse.memory = room.memory.extensions[extensionToUse.id]
                pathToSpawn = extensionToUse.memory.pathToSpawn;
            }

            if(!room.memory.extensions[extensionToUse.id].createdPath || forceRebuild) {
                //console.log('create a new path here');
                if (forceRebuild) {
                    room.memory.extensions[extensionToUse.id].createdPath = true;
                }

                for ( var i  in pathToSpawn ) {
                    var construct = room.createConstructionSite(pathToSpawn[i]['x'], pathToSpawn[i]['y'], STRUCTURE_ROAD, {swampCost: 1});
                    if ( construct == OK ){
                        console.log('[build.roads.extensions] - construction site created');
                        room.memory.extensions[extensionToUse.id].createdPath = true;
                    } else if (construct == ERR_RCL_NOT_ENOUGH) {
                        console.log('[build.roads.extensions] - ERR_RCL_NOT_ENOUGH' + construct.toString());
                    } else if (construct == ERR_INVALID_TARGET) {
                        console.log('[build.roads.extensions] - ERR_INVALID_TARGET' + construct.toString());
                        room.memory.extensions[extensionToUse.id].createdPath = true;
                    } else {
                        console.log('[build.roads.extensions] - something went wrong' + construct.toString());
                    }
                }
                for (let r in roadNum) {
                    let roadX = extensionToUse.pos.x + roadNum[r].x;
                    let roadY = extensionToUse.pos.y + roadNum[r].y;
                    let roadConstruct = room.createConstructionSite(roadX, roadY, STRUCTURE_ROAD);
                    if (roadConstruct == OK) {
                        console.log('[build.roads.extensions] - build road around each extension');
                    } else {
                        //console.log('[build.extensions] - bAHHHHHHHHH');
                        //console.log("[build.roads.extensions] - no space to build surrounding road" + roadConstruct.toString());
                    }
                }
            }
        }
    }, // buildToExtension
    buildToTower: function (forceRebuild = false) {
        //Object.keys(Game.rooms)[0]
        var room = Game.rooms[Object.keys(Game.rooms)[0]];
        var spawnTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
        var towers = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
        });

        var sources = room.find(FIND_SOURCES);

        // Create road around the tower
        let roadNum = [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];

        // Make the function accept arguments that let it build to other things
        for ( var i in towers ) {
            var towerToUse = towers[i];
            //console.log(towerToUse.id);
            var pathToSpawn = {};
            // Create the path memory variable
            if (!room.memory.towers) {
                if (!room.memory) room.memory = {};
                room.memory.towers = {};
                console.log('[build.roads.towers] - creating new memory for towers');
            }
            //if (!room.memory.towerTargets[towerToUse.id]) {
            if (!room.memory.towers[towerToUse.id] ) {
                towerToUse.memory = room.memory.towers[towerToUse.id] = {};
                towerToUse.memory.createdPath = false;
                //pathToSpawn = PathFinder.search(spawnTargets[0].pos, towerToUse.pos, {range: 2});
                pathToSpawn = room.findPath(spawnTargets[0].pos, towerToUse.pos, {range: 1, ignoreCreeps: true, swampCost: 1, ignoreRoads: true});
                towerToUse.memory.pathToSpawn = pathToSpawn;
                console.log('[build.roads.towers] - creating new memory for tower ids');
            } else {
                //console.log('didntwork');
                towerToUse.memory = room.memory.towers[towerToUse.id]
                pathToSpawn = towerToUse.memory.pathToSpawn;
            }
            if(!room.memory.towers[towerToUse.id].createdPath || forceRebuild) {
                for ( var i  in pathToSpawn ) {
                    var construct = room.createConstructionSite(pathToSpawn[i]['x'], pathToSpawn[i]['y'], STRUCTURE_ROAD, {swampCost: 1});
                    if ( construct == OK ){
                        console.log('[build.roads.towers] - construction site created');
                        room.memory.towers[towerToUse.id].createdPath = true;
                    } else if (construct == ERR_RCL_NOT_ENOUGH) {
                        console.log('[build.roads.towers] - ERR_RCL_NOT_ENOUGH' + construct.toString());
                    } else if (construct == ERR_INVALID_TARGET) {
                        console.log('[build.roads.towers] - ERR_INVALID_TARGET' + construct.toString());
                    } else {
                        console.log('[build.roads.towers] - something went wrong' + construct.toString());
                    }
                }
                for (let r in roadNum) {
                    let roadX = towerToUse.pos.x + roadNum[r].x;
                    let roadY = towerToUse.pos.y + roadNum[r].y;
                    let roadConstruct = room.createConstructionSite(roadX, roadY, STRUCTURE_ROAD);
                    if (roadConstruct == OK) {
                        console.log('[build.roads.towers] - build road around each tower');
                    } else {
                        //console.log('[build.towers] - bAHHHHHHHHH');
                        console.log("[build.roads.towers] - no space to build surrounding road" + roadConstruct.toString());
                    }
                }
                for (let s in sources) {
                    let sourceToUse = sources[s];
                    let pathToSource = {};
                    pathToSource = room.findPath(sourceToUse.pos, towerToUse.pos, {range: 2, ignoreCreeps: true, swampCost: 1, ignoreRoads: true});
                    for (r in pathToSource) {
                        let roadConstruct = room.createConstructionSite(pathToSource[i]['x'], pathToSource[i]['y'], STRUCTURE_ROAD);
                        if (roadConstruct == OK) {
                            console.log('[build.roads.towers] - construction site tower -> sources');
                        } else {
                            //console.log('[build.towers] - bAHHHHHHHHH');
                            console.log('[build.roads.towers] -  failed to build tower -> sources', roadConstruct);
                        }
                    }
                }
            }
        }
    }, //buildToTower
    buildToRoomController: function (forceRebuild = false) {
        //Object.keys(Game.rooms)[0]
        var room = Game.rooms[Object.keys(Game.rooms)[0]];
        var spawnTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
        var towers = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
        });

        var sources = room.find(FIND_SOURCES);

        // Create road around the tower
        let roadNum = [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];

        // Make the function accept arguments that let it build to other things
        for ( var i in towers ) {
            var towerToUse = towers[i];
            //console.log(towerToUse.id);
            var pathToSpawn = {};
            // Create the path memory variable
            if (!room.memory.towers) {
                if (!room.memory) room.memory = {};
                room.memory.towers = {};
                console.log('[build.roads.towers] - creating new memory for towers');
            }
            //if (!room.memory.towerTargets[towerToUse.id]) {
            if (!room.memory.towers[towerToUse.id] ) {
                towerToUse.memory = room.memory.towers[towerToUse.id] = {};
                towerToUse.memory.createdPath = false;
                //pathToSpawn = PathFinder.search(spawnTargets[0].pos, towerToUse.pos, {range: 2});
                pathToSpawn = room.findPath(spawnTargets[0].pos, towerToUse.pos, {range: 1, ignoreCreeps: true, swampCost: 1, ignoreRoads: true});
                towerToUse.memory.pathToSpawn = pathToSpawn;
                console.log('[build.roads.towers] - creating new memory for tower ids');
            } else {
                //console.log('didntwork');
                towerToUse.memory = room.memory.towers[towerToUse.id]
                pathToSpawn = towerToUse.memory.pathToSpawn;
            }
            if(!room.memory.towers[towerToUse.id].createdPath || forceRebuild) {
                for ( var i  in pathToSpawn ) {
                    var construct = room.createConstructionSite(pathToSpawn[i]['x'], pathToSpawn[i]['y'], STRUCTURE_ROAD, {swampCost: 1});
                    if ( construct == OK ){
                        console.log('[build.roads.towers] - construction site created');
                        room.memory.towers[towerToUse.id].createdPath = true;
                    } else if (construct == ERR_RCL_NOT_ENOUGH) {
                        console.log('[build.roads.towers] - ERR_RCL_NOT_ENOUGH' + construct.toString());
                    } else if (construct == ERR_INVALID_TARGET) {
                        console.log('[build.roads.towers] - ERR_INVALID_TARGET' + construct.toString());
                    } else {
                        console.log('[build.roads.towers] - something went wrong' + construct.toString());
                    }
                }
                for (let r in roadNum) {
                    let roadX = towerToUse.pos.x + roadNum[r].x;
                    let roadY = towerToUse.pos.y + roadNum[r].y;
                    let roadConstruct = room.createConstructionSite(roadX, roadY, STRUCTURE_ROAD);
                    if (roadConstruct == OK) {
                        console.log('[build.roads.towers] - build road around each tower');
                    } else {
                        //console.log('[build.towers] - bAHHHHHHHHH');
                        console.log("[build.roads.towers] - no space to build surrounding road" + roadConstruct.toString());
                    }
                }
                for (let s in sources) {
                    let sourceToUse = sources[s];
                    let pathToSource = {};
                    pathToSource = room.findPath(sourceToUse.pos, towerToUse.pos, {range: 2, ignoreCreeps: true, swampCost: 1, ignoreRoads: true});
                    for (r in pathToSource) {
                        let roadConstruct = room.createConstructionSite(pathToSource[i]['x'], pathToSource[i]['y'], STRUCTURE_ROAD);
                        if (roadConstruct == OK) {
                            console.log('[build.roads.towers] - construction site tower -> sources');
                        } else {
                            //console.log('[build.towers] - bAHHHHHHHHH');
                            console.log('[build.roads.towers] -  failed to build tower -> sources', roadConstruct);
                        }
                    }
                }
            }
        }
    } //buildToRoomController
};

module.exports = buildRoads;
