//Imports
var cleanMemory = require('clean.memory');
var spawnCreeper = require('spawn.creeper');
var buildExtensions = require('build.extensions');
var buildTowers = require('build.towers');
var buildWalls = require('build.walls');
var buildRoads = require('build.roads');
var buildStorage = require('build.storage');
var creepHarvester = require('creep.harvester');
var creepBuilder = require('creep.builder');
var creepExplorer = require('creep.explorer');
var creepUpgrader = require('creep.upgrader');
var towerAction = require('tower.action');
var findExits = require('find.exits');
var destroyRoads = require('destroy.roads');

module.exports.loop = function () {

    // ToDo list
    // - (DONE) 1x Creep type builder, takes from storage builds/repairs
    // - (DONE) 1x Creep type upgrader, takes from storage and upgrades the roomController
    // - (DONE) 4x Creep type harvester, takes
    // - x1 Creep type explorer, claims room, and then suicides
    // - (DONE) Energy storage building (harvesters should store in here)
    // - Backup redis and mongodb and mods
    // - If at max creeps, make the creeps renew instead of just dying, make a new memory renewing
    // - Fix the static number of creeps and scale down as they get more bodyParts
    // - Upgrade scripts to support multi room
    // - Use the delays ticker timer to optimize cpu performance


    // Optimize road code
    if (!Memory.data) {
        Memory.data = {maxCreeps: 6, bodyParts: 3, buildRoadTick: 0, buildRoadForceTick: 0, mainTick: 0};
    } else {
        Memory.data.buildRoadTick = Memory.data.buildRoadTick + 1;
        Memory.data.buildRoadForceTick = Memory.data.buildRoadForceTick + 1;
        Memory.data.mainTick = Memory.data.mainTick + 1;
        let extensions = Game.rooms[Object.keys(Game.rooms)[0]].find(FIND_STRUCTURES, {
                    filter: (structure) => {return structure.structureType == STRUCTURE_EXTENSION}
        });
        if (extensions.length >= 30) {
            // 2 harvesters
            // 2 builder
            // 1 upgraders
            Memory.data.maxCreeps = 5;
        } else if (extensions.length >= 20) {
            Memory.data.maxCreeps = 8;
        } else if (extensions.length >= 10) {
            Memory.data.maxCreeps = 10;
        } else {
            Memory.data.maxCreeps = 12;
        }
    }


    // Testing githook Update
    //Memory.data = {maxCreeps: 8, bodyParts: 3};




    // Run each tower every tick
    towerAction.run();
    spawnCreeper.spawn(Game.spawns['Spawn1']);
    // Run each creep every tick
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        // Memory upgrade
        //creep.memory.randomEnergyStorage = 0;
        if ( creep.memory.role == 'worker') {
            creepHarvester.work(creep);
        } else if ( creep.memory.role == 'builder') {
            creepBuilder.work(creep);
        } else if ( creep.memory.role == 'upgrader') {
            creepUpgrader.work(creep);
        } else if ( creep.memory.role == 'explorer') {
            creep.say('explore');
            creepExplorer.explore(creep, roomToExplore);
        } else {
            creepHarvester.work(creep);
        }
    }

    // Slow tasks for base building, run each task every 25 ticks
    for (let room in Game.rooms) {
        let spawnTargets = Game.rooms[room].find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
        if (!Game.rooms[room].controller.owner || spawnTargets.length < 1) {
            continue;
        }

        destroyRoads.destroy(Game.rooms[room]);
        buildRoads.buildToRamparts(Game.rooms[room], forceRebuild = true);

        if (Memory.data.mainTick == 5){
            console.log('[main] - cleanMemory.clean()');
            cleanMemory.clean(); // Clean dead creeps from memory
        } else if (Memory.data.mainTick == 10){
            console.log('[main] - findExits.updateMemoryLocations()');
            findExits.updateMemoryLocations(Game.rooms[room]);
        } else if (Memory.data.mainTick == 15){
            //console.log('[main] - spawnCreeper.spawn()'); too slow for spawning
            //spawnCreeper.spawn(Game.spawns['Spawn1']); // Check if you can spawn things
        } else if (Memory.data.mainTick == 20){
            console.log('[main] - buildExtensions.new()');
            buildExtensions.new(Game.rooms[room]); // Check if you can build things
        } else if (Memory.data.mainTick == 25){
            console.log('[main] - buildTowers.new()');
            buildTowers.new(Game.rooms[room]); // Check if you can build things
        } else if (Memory.data.mainTick == 30){
            console.log('[main] - buildStorage.new()');
            buildStorage.new(Game.rooms[room]); // Check if you can build things
        } else if (Memory.data.mainTick > 30) {
            Memory.data.mainTick = 0;
        }

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

        }

        if (Memory.data.buildRoadTick == 100) {
            console.log('[main] - buildRoads.buildToSource()');
            buildWalls.new(Game.rooms[room]);
        } else if (Memory.data.buildRoadTick == 200) {
            console.log('[main] - buildRoads.buildToSource()');
            buildRoads.buildToSource(Game.rooms[room]);
        } else if (Memory.data.buildRoadTick == 300) {
            console.log('[main] - buildRoads.buildToExtension()');
            buildRoads.buildToExtension(Game.rooms[room]);
        } else if (Memory.data.buildRoadTick == 400) {
            console.log('[main] - buildRoads.buildToTower()');
            buildRoads.buildToTower(Game.rooms[room]);
        } else if (Memory.data.buildRoadTick == 500) {
            console.log('[main] - buildRoads.buildToRoomController()');
            buildRoads.buildToRoomController(Game.rooms[room]);
        } else if (Memory.data.buildRoadTick == 600) {
            console.log('[main] - buildRoads.buildToRamparts');
            buildRoads.buildToRamparts(Game.rooms[room]);
        } else if (Memory.data.buildRoadTick > 600) {
            console.log('[main] - reset memory road build timer');
            Memory.data.buildRoadTick = 0;
        }
    }

    if (Object.keys(Game.rooms).length < Game.gcl.level) {
        //console.log('[main] - Time to get another room!', Object.keys(Game.rooms).length, Game.gcl.level);
    } else {
        //console.log(Object.keys(Game.rooms).length, Game.gcl.level);
    }
}
