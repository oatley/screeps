//Imports
let cleanMemory = require('clean.memory');
let spawnCreeper = require('spawn.creeper');
let buildExtensions = require('build.extensions');
let buildTowers = require('build.towers');
let buildWalls = require('build.walls');
let buildRoads = require('build.roads');
let buildStorage = require('build.storage');
let creepHarvester = require('creep.harvester');
let creepBuilder = require('creep.builder');
let creepExplorer = require('creep.explorer');
let creepUpgrader = require('creep.upgrader');
let towerAction = require('tower.action');
let findExits = require('find.exits');
let destroyRoads = require('destroy.roads');

module.exports.loop = function () {

    // ToDo list (do it X4 now)
    // - (DONE) 1x Creep type builder, takes from storage builds/repairs
    // - (DONE) 1x Creep type upgrader, takes from storage and upgrades the roomController
    // - (DONE) 4x Creep type harvester, takes
    // - (DONE) x1 Creep type explorer, claims room, and then suicides(instead it turns into a builder)
    // - (DONE) Energy storage building (harvesters should store in here)
    // - (DONE) Backup redis and mongodb and mods
    // - (NOPE) If at max creeps, make the creeps renew instead of just dying, make a new memory renewing
    // - (DONE) Fix the static number of creeps and scale down as they get more bodyParts
    // - (DONE) Upgrade scripts to support multi room
    // - (DONE) Use the delays ticker timer to optimize cpu performance
    // - Place containers next to sources
    // - Make a new refiller creep that only takes from containers and stores in link and storage
    // - Maybe builders can be refillers or maybe a single new creep
    // - Make harvesters slower and more optimized for sitting and storing in containers
    // - Place a link next to the storage and the room controller
    // - (DONE) If room only has 1 energy don't build 2 workers
    // - Instead of maxcreeps have maxUpgraders, maxWorkers, maxBuilders etc. Allow for adding extra upgraders if +200k econ


    // Check if memory structure has been created
    if (!Memory.data) {
        Memory.data = {bodyParts: 3, buildRoadTick: 0, buildRoadForceTick: 0, mainTick: 0, expandRooms: []};
    } else {
        // Optimize road code to run every X ticks
        Memory.data.buildRoadTick = Memory.data.buildRoadTick + 1;
        Memory.data.buildRoadForceTick = Memory.data.buildRoadForceTick + 1;
        Memory.data.mainTick = Memory.data.mainTick + 1;
        // Control the max number of creeps in a room
        for (let room in Game.rooms) {
            // Control the max number of creeps in a room
            let extensions = Game.rooms[room].find(FIND_STRUCTURES, {
                        filter: (structure) => {return structure.structureType == STRUCTURE_EXTENSION}
            });
            if (!Game.rooms[room].memory.maxCreeps) {
                Game.rooms[room].memory.maxCreeps = 0;
            }
            if (extensions.length >= 30) {
                let sources = Game.rooms[room].find(FIND_SOURCES);
                // 2 harvesters // 2 builder // 1 upgraders
                if (sources.length == 1) {
                    Game.rooms[room].memory.maxCreeps = 4;
                } else {
                    Game.rooms[room].memory.maxCreeps = 5;
                }
            } else if (extensions.length >= 20) {
                Game.rooms[room].memory.maxCreeps = 6;
            } else if (extensions.length >= 10) {
                Game.rooms[room].memory.maxCreeps = 7;
            } else {
                Game.rooms[room].memory.maxCreeps = 8;
            }
        }
    }

    // Run each creep every tick
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role == 'worker') {
            creepHarvester.work(creep);
        } else if (creep.memory.role == 'builder') {
            creepBuilder.work(creep);
        } else if (creep.memory.role == 'upgrader') {
            creepUpgrader.work(creep);
        } else if (creep.memory.role == 'explorer') {
            if (Memory.data.expandRooms.length > 0) {
                creep.memory.roomToExplore = Memory.data.expandRooms[0];
                creepExplorer.explore(creep);
            } else {
                creepExplorer.explore(creep);
            }
        } else {
            creepHarvester.work(creep);
        }
    }

    let ownedRooms = [];
    // Slow tasks for base building, run each task every 25 ticks
    console.log(Game.rooms);
    for (let room in Game.rooms) {

        // Weird conditions to skip
        if (!room) continue;
        // Spawns
        let spawnTargets = Game.rooms[room].find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
        // Get all the rooms I "own" again
        if (spawnTargets.length > 0 && (Game.rooms[room].controller) && (Game.rooms[room].controller.owner) && (Game.rooms[room].controller.owner.username == 'oatley' || Game.rooms[room].controller.owner.username == 'oatsmonkey')) {
            ownedRooms.push(room);
        }
        // If creeps enter a room you don't own, don't try and build in it
        if (((Game.rooms[room].controller) && (Game.rooms[room].controller.owner) && (Game.rooms[room].controller.owner.username != 'oatley')) || spawnTargets.length < 1) {
            if (((Game.rooms[room].controller) && (Game.rooms[room].controller.owner) && (Game.rooms[room].controller.owner.username != 'oatsmonkey')) || spawnTargets.length < 1) {
                continue;
            }
        }

        // Run every tick
        towerAction.run(Game.rooms[room]); // Towers attack or repair
        cleanMemory.clean(Game.rooms[room]); // Memory cleaned of old stuff
        console.log(room);
        for (let spawn in spawnTargets) {
            console.log('spawn', room, spawn);
            spawnCreeper.spawn(spawnTargets[spawn]);
        }

        // Debugs
        //buildRoads.buildToRamparts(Game.rooms[room], forceRebuild = true);
        //buildRoads.buildToExtension(Game.rooms[room], forceRebuild = true);
        //buildExtensions.new(Game.rooms[room]); // Check if you can build things
        //console.log(Memory.data.mainTick);
        // Run these non critical base building scripts slowly
        if (Memory.data.mainTick == 5){
            console.log('[main',room,'] - findExits.updateMemoryLocations()');
            findExits.updateMemoryLocations(Game.rooms[room]);
        } else if (Memory.data.mainTick == 10){
            console.log('[main',room,'] - buildExtensions.new()');
            buildExtensions.new(Game.rooms[room]); // Check if you can build things
        } else if (Memory.data.mainTick == 15){
            console.log('[main',room,'] - buildTowers.new()');
            buildTowers.new(Game.rooms[room]); // Check if you can build things
        } else if (Memory.data.mainTick == 20){
            console.log('[main',room,'] - buildStorage.new()');
            buildStorage.new(Game.rooms[room]); // Check if you can build things
        } else if (Memory.data.mainTick == 25) {
            console.log('[main',room,'] - destroyRoads.destroy()');
            destroyRoads.destroy(Game.rooms[room]);
        } else if (Memory.data.mainTick > 30) {
            console.log('[main',room,'] - Memory.data.mainTick reset');
            Memory.data.mainTick = 0;
        }

        // Wipe memory to rebuild roads that have been lost for some reason
        if (Memory.data.buildRoadForceTick >= 10000) {
            console.log('[main] - forcing a rebuild of all roads');
            Game.rooms[room].memory.sources = {};
            Game.rooms[room].memory.towers = {};
            Game.rooms[room].memory.extensions = {};
            Game.rooms[room].memory.roomControllers = {};
            Game.rooms[room].memory.ramparts = {};
            Memory.data.buildRoadForceTick = 0;
            Memory.data.buildRoadTick = 0;
            Memory.data.mainTick = 0;
            Memory.data.expandRooms = [];

        }

        // Building walls and roads this is not important, high cpu pathfinding
        if (Memory.data.buildRoadTick == 100) {
            console.log('[main',room,'] - buildRoads.buildToSource()');
            buildWalls.new(Game.rooms[room]);
        } else if (Memory.data.buildRoadTick == 200) {
            console.log('[main',room,'] - buildRoads.buildToSource()');
            buildRoads.buildToSource(Game.rooms[room]);
        } else if (Memory.data.buildRoadTick == 300) {
            console.log('[main',room,'] - buildRoads.buildToExtension()');
            buildRoads.buildToExtension(Game.rooms[room]);
        } else if (Memory.data.buildRoadTick == 400) {
            console.log('[main',room,'] - buildRoads.buildToTower()');
            buildRoads.buildToTower(Game.rooms[room]);
        } else if (Memory.data.buildRoadTick == 500) {
            console.log('[main',room,'] - buildRoads.buildToRoomController()');
            buildRoads.buildToRoomController(Game.rooms[room]);
        } else if (Memory.data.buildRoadTick == 600) {
            console.log('[main',room,'] - buildRoads.buildToRamparts');
            buildRoads.buildToRamparts(Game.rooms[room]);
        } else if (Memory.data.buildRoadTick > 600) {
            console.log('[main',room,'] - reset memory road build timer');
            Memory.data.buildRoadTick = 0;
        }
    }


    if (ownedRooms.length < Game.gcl.level) {

        // Check for valid rooms to expand to
        if (Game.rooms[Object.keys(Game.rooms)[0]].length <= 4) {
            // Private server
            Memory.data.expandRooms = ['W4N8', 'W5N8', 'W5N9', 'W5N7'];
        } else {
            // Public screeps
            Memory.data.expandRooms = ['E19S33', 'E19S32'];
        }


        // Check if expandRooms exist with spawn and remove them
        for (let room in Game.rooms) {
            let spawnTargets = Game.rooms[room].find(FIND_STRUCTURES, {
                        filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
            });
            if (spawnTargets.length > 0 && (Game.rooms[room].controller) && (Game.rooms[room].controller.owner) && (Game.rooms[room].controller.owner.username == 'oatley' || Game.rooms[room].controller.owner.username == 'oatsmonkey')) {
                let index = Memory.data.expandRooms.indexOf(Game.rooms[room].name);
                if (index > -1) {
                    Memory.data.expandRooms.splice(index, 1)
                }
            }
        }
        if (Memory.data.expandRooms.length > 0) {
            console.log('[main] - Expanding to new rooms', Memory.data.expandRooms);
        }
    } else {
        // GCL too low to expand
        Memory.data.expandRooms = [];
    }
}
