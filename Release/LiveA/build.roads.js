Source.prototype.memory = undefined;
let buildRoads = {
    buildToSource: function (room, forceRebuild = false) {

        // Static room object for now
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
        let sources = room.find(FIND_SOURCES);

        // Create road around the tower
        //let roadNum = [{x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: -1, y: -1}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];
        let roadNum = [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];


        // Skip building roads if you are a noob without extensions
        if (room.controller.level <= 2 && extensionTargets <= 5) {
            return;
        }

        if (forceRebuild) {
            room.memory.sources = {};
        }

        for (let i in sources) {
            let sourceToUse = sources[i];
            let pathToSpawn = {};
            // Create the path memory letiable
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

            if(!room.memory.sources[sourceToUse.id].createdPath) {
                console.log('[build.roads.sources] - create a new path here');

                if (forceRebuild) {
                    room.memory.sources[sourceToUse.id].createdPath = true;
                }

                for ( let i  in pathToSpawn ) {
                    let construct = room.createConstructionSite(pathToSpawn[i]['x'], pathToSpawn[i]['y'], STRUCTURE_ROAD);
                    if ( construct == OK ){
                        console.log("[build.roads.sources] - construction site created");
                        room.memory.sources[sourceToUse.id].createdPath = true;
                    } else if (construct == ERR_RCL_NOT_ENOUGH) {
                        console.log("[build.roads.sources] - ERR_RCL_NOT_ENOUGH" + construct.toString());
                    }else if (construct == ERR_INVALID_TARGET) {
                        //console.log("[build.roads] - ERR_INVALID_TARGET" + construct.toString());
                        room.memory.sources[sourceToUse.id].createdPath = true;
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
    buildToExtension: function (room, forceRebuild = false) {
        //Object.keys(Game.rooms)[0]
        //let room = Game.rooms[Object.keys(Game.rooms)[0]];
        let spawnTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
        let towerTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
        });
        let extensions = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION);}
        });
        let roads = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_ROAD);}
        });

        // Create road around the extension
        //let roadNum = [{x: 1, y: 1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: -1, y: -1}, {x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];
        let roadNum = [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];

        if (forceRebuild) {
            room.memory.extensions = {};
        }

        // Make the function accept arguments that let it build to other things
        for ( let i in extensions ) {
            let extensionToUse = extensions[i];
            let pathToSpawn = {};
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

            if(!room.memory.extensions[extensionToUse.id].createdPath) {
                //console.log('create a new path here');
                if (forceRebuild) {
                    room.memory.extensions[extensionToUse.id].createdPath = true;
                }

                for ( let i  in pathToSpawn ) {
                    let construct = room.createConstructionSite(pathToSpawn[i]['x'], pathToSpawn[i]['y'], STRUCTURE_ROAD, {swampCost: 1});
                    if ( construct == OK ){
                        console.log('[build.roads.extensions] - construction site created');
                        room.memory.extensions[extensionToUse.id].createdPath = true;
                    } else if (construct == ERR_RCL_NOT_ENOUGH) {
                        console.log('[build.roads.extensions] - ERR_RCL_NOT_ENOUGH' + construct.toString());
                    } else if (construct == ERR_INVALID_TARGET) {
                        //console.log('[build.roads.extensions] - ERR_INVALID_TARGET' + construct.toString());
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
    buildToTower: function (room, forceRebuild = false) {
        //Object.keys(Game.rooms)[0]
        //let room = Game.rooms[Object.keys(Game.rooms)[0]];
        let spawnTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
        let towers = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
        });

        let sources = room.find(FIND_SOURCES);

        // Create road around the tower
        let roadNum = [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];

        if (forceRebuild) {
            room.memory.towers = {};
        }

        // Make the function accept arguments that let it build to other things
        for ( let i in towers ) {
            let towerToUse = towers[i];
            //console.log(towerToUse.id);
            let pathToSpawn = {};
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
            if(!room.memory.towers[towerToUse.id].createdPath) {

                if (forceRebuild) {
                    room.memory.towers[towerToUse.id].createdPath = true;
                }

                for ( let i  in pathToSpawn ) {
                    let construct = room.createConstructionSite(pathToSpawn[i]['x'], pathToSpawn[i]['y'], STRUCTURE_ROAD, {swampCost: 1});
                    if ( construct == OK ){
                        console.log('[build.roads.towers] - construction site created');
                        room.memory.towers[towerToUse.id].createdPath = true;
                    } else if (construct == ERR_RCL_NOT_ENOUGH) {
                        console.log('[build.roads.towers] - ERR_RCL_NOT_ENOUGH' + construct.toString());
                    } else if (construct == ERR_INVALID_TARGET) {
                        //console.log('[build.roads.towers] - ERR_INVALID_TARGET' + construct.toString());
                        room.memory.towers[towerToUse.id].createdPath = true;
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
    buildToRoomController: function (room, forceRebuild = false) {
        //Object.keys(Game.rooms)[0]
        //let room = Game.rooms[Object.keys(Game.rooms)[0]];
        let roomController = room.controller;
        let spawnTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
        let roomControllers = [roomController];
        let sources = room.find(FIND_SOURCES);

        // Create road around the roomController
        let roadNum = [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];

        if (forceRebuild) {
            room.memory.roomControllers = {};
        }

        // Make the function accept arguments that let it build to other things
        for ( let i in roomControllers ) {
            let roomControllerToUse = roomControllers[i];
            //console.log(roomControllerToUse.id);
            let pathToSpawn = {};
            // Create the path memory variable
            if (!room.memory.roomControllers) {
                if (!room.memory) room.memory = {};
                room.memory.roomControllers = {};
                console.log('[build.roads.roomControllers] - creating new memory for roomControllers');
            }
            //if (!room.memory.roomControllerTargets[roomControllerToUse.id]) {
            if (!room.memory.roomControllers[roomControllerToUse.id] ) {
                roomControllerToUse.memory = room.memory.roomControllers[roomControllerToUse.id] = {};
                roomControllerToUse.memory.createdPath = false;
                //pathToSpawn = PathFinder.search(spawnTargets[0].pos, roomControllerToUse.pos, {range: 2});
                pathToSpawn = room.findPath(spawnTargets[0].pos, roomControllerToUse.pos, {range: 1, ignoreCreeps: true, swampCost: 1, ignoreRoads: true});
                roomControllerToUse.memory.pathToSpawn = pathToSpawn;
                console.log('[build.roads.roomControllers] - creating new memory for roomController ids');
            } else {
                //console.log('didntwork');
                roomControllerToUse.memory = room.memory.roomControllers[roomControllerToUse.id]
                pathToSpawn = roomControllerToUse.memory.pathToSpawn;
            }
            if(!room.memory.roomControllers[roomControllerToUse.id].createdPath) {

                if (forceRebuild) {
                    room.memory.roomControllers[roomControllerToUse.id].createdPath = true;
                }

                for ( let i  in pathToSpawn ) {
                    let construct = room.createConstructionSite(pathToSpawn[i]['x'], pathToSpawn[i]['y'], STRUCTURE_ROAD, {swampCost: 1});
                    if ( construct == OK ){
                        console.log('[build.roads.roomControllers] - construction site created');
                        room.memory.roomControllers[roomControllerToUse.id].createdPath = true;
                    } else if (construct == ERR_RCL_NOT_ENOUGH) {
                        console.log('[build.roads.roomControllers] - ERR_RCL_NOT_ENOUGH' + construct.toString());
                    } else if (construct == ERR_INVALID_TARGET) {
                        //console.log('[build.roads.roomControllers] - ERR_INVALID_TARGET' + construct.toString());
                        room.memory.roomControllers[roomControllerToUse.id].createdPath = true;
                    } else {
                        console.log('[build.roads.roomControllers] - something went wrong' + construct.toString());
                    }
                }
                for (let r in roadNum) {
                    let roadX = roomControllerToUse.pos.x + roadNum[r].x;
                    let roadY = roomControllerToUse.pos.y + roadNum[r].y;
                    let roadConstruct = room.createConstructionSite(roadX, roadY, STRUCTURE_ROAD);
                    if (roadConstruct == OK) {
                        console.log('[build.roads.roomControllers] - build road around each roomController');
                    } else {
                        //console.log('[build.roomControllers] - bAHHHHHHHHH');
                        console.log("[build.roads.roomControllers] - no space to build surrounding road" + roadConstruct.toString());
                    }
                }
                for (let s in sources) {
                    let sourceToUse = sources[s];
                    let pathToSource = {};
                    pathToSource = room.findPath(sourceToUse.pos, roomControllerToUse.pos, {range: 2, ignoreCreeps: true, swampCost: 1, ignoreRoads: true});
                    for (r in pathToSource) {
                        let roadConstruct = room.createConstructionSite(pathToSource[i]['x'], pathToSource[i]['y'], STRUCTURE_ROAD);
                        if (roadConstruct == OK) {
                            console.log('[build.roads.roomControllers] - construction site roomController -> sources');
                        } else {
                            //console.log('[build.roomControllers] - bAHHHHHHHHH');
                            console.log('[build.roads.roomControllers] -  failed to build roomController -> sources', roadConstruct);
                        }
                    }
                }
            }
        }
    }, //buildToRoomController
    buildToRamparts: function (room, forceRebuild = false) {
        //Object.keys(Game.rooms)[0]
        //let room = Game.rooms[Object.keys(Game.rooms)[0]];
        //let roomController = room.controller;
        let spawnTargets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN)}
        });
        //let ramparts = [rampart];
        let ramparts = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_RAMPART)}
        });
        // Create road around the rampart
        let roadNum = [{x: 0, y: 1}, {x: 1, y: 0}, {x: 0, y: -1}, {x: -1, y: 0}];

        if (forceRebuild) {
            room.memory.ramparts = {};
        }

        // Make the function accept arguments that let it build to other things
        for ( let i in ramparts ) {
            let rampartToUse = ramparts[i];
            //console.log(rampartToUse.id);
            let pathToSpawn = {};
            // Create the path memory variable
            if (!room.memory.ramparts) {
                if (!room.memory) room.memory = {};
                room.memory.ramparts = {};
                console.log('[build.roads.ramparts] - creating new memory for ramparts');
            }
            //if (!room.memory.rampartTargets[rampartToUse.id]) {
            if (!room.memory.ramparts[rampartToUse.id] ) {
                rampartToUse.memory = room.memory.ramparts[rampartToUse.id] = {};
                rampartToUse.memory.createdPath = false;
                //pathToSpawn = PathFinder.search(spawnTargets[0].pos, rampartToUse.pos, {range: 2});
                pathToSpawn = room.findPath(spawnTargets[0].pos, rampartToUse.pos, {range: 1, ignoreCreeps: true, swampCost: 1, ignoreRoads: true});
                rampartToUse.memory.pathToSpawn = pathToSpawn;
                console.log('[build.roads.ramparts] - creating new memory for rampart ids');
            } else {
                //console.log('didntwork');
                rampartToUse.memory = room.memory.ramparts[rampartToUse.id]
                pathToSpawn = rampartToUse.memory.pathToSpawn;
            }
            if(!room.memory.ramparts[rampartToUse.id].createdPath) {

                if (forceRebuild) {
                    room.memory.ramparts[rampartToUse.id].createdPath = true;
                }

                for ( let i  in pathToSpawn ) {
                    let construct = room.createConstructionSite(pathToSpawn[i]['x'], pathToSpawn[i]['y'], STRUCTURE_ROAD, {swampCost: 1});
                    if ( construct == OK ){
                        console.log('[build.roads.ramparts] - construction site created');
                        room.memory.ramparts[rampartToUse.id].createdPath = true;
                    } else if (construct == ERR_RCL_NOT_ENOUGH) {
                        console.log('[build.roads.ramparts] - ERR_RCL_NOT_ENOUGH' + construct.toString());
                    } else if (construct == ERR_INVALID_TARGET) {
                        //console.log('[build.roads.ramparts] - ERR_INVALID_TARGET' + construct.toString());
                        room.memory.ramparts[rampartToUse.id].createdPath = true;
                    } else {
                        console.log('[build.roads.ramparts] - something went wrong' + construct.toString());
                    }
                }
                for (let r in roadNum) {
                    let roadX = rampartToUse.pos.x + roadNum[r].x;
                    let roadY = rampartToUse.pos.y + roadNum[r].y;
                    let roadConstruct = room.createConstructionSite(roadX, roadY, STRUCTURE_ROAD);
                    if (roadConstruct == OK) {
                        console.log('[build.roads.ramparts] - build road around each rampart');
                    } else {
                        //console.log('[build.ramparts] - bAHHHHHHHHH');
                        console.log("[build.roads.ramparts] - no space to build surrounding road" + roadConstruct.toString());
                    }
                }
                for (let s in sources) {
                    let sourceToUse = sources[s];
                    let pathToSource = {};
                    pathToSource = room.findPath(sourceToUse.pos, rampartToUse.pos, {range: 2, ignoreCreeps: true, swampCost: 1, ignoreRoads: true});
                    for (r in pathToSource) {
                        let roadConstruct = room.createConstructionSite(pathToSource[i]['x'], pathToSource[i]['y'], STRUCTURE_ROAD);
                        if (roadConstruct == OK) {
                            console.log('[build.roads.ramparts] - construction site rampart -> sources');
                        } else {
                            //console.log('[build.ramparts] - bAHHHHHHHHH');
                            console.log('[build.roads.ramparts] -  failed to build rampart -> sources', roadConstruct);
                        }
                    }
                }
            }
        }
    } //buildToRamparts
};

module.exports = buildRoads;
