//Imports
var cleanMemory = require('clean.memory');
var spawnCreeper = require('spawn.creeper');
var buildExtensions = require('build.extensions');
var buildTowers = require('build.towers');
var buildWalls = require('build.walls');
var buildRoads = require('build.roads');
var buildStorage = require('build.storage');
var creepHarvester = require('creep.harvester');
var creepExplorer = require('creep.explorer');
var towerAction = require('tower.action');
var findExits = require('find.exits');


module.exports.loop = function () {

    // ToDo list
    // - 1x Creep type builder, takes from storage builds/repairs
    // - 1x Creep type upgrader, takes from storage and upgrades the roomController
    // - 5x Creep type harvester, takes
    // - x1 Creep type explorer, claims room, and then suicides
    // - (DONE) Energy storage building (harvesters should store in here)
    // - Backup redis and mongodb and mods
    // - If at max creeps, make the creeps renew instead of just dying, make a new memory renewing
    // - Fix the static number of creeps and scale down as they get more bodyParts
    // - Upgrade scripts to support multi room
    // - Use the delays ticker timer to optimize cpu performance


    // Optimize road code
    Memory.data = {};
    if (!Memory.data) {
        Memory.data = {maxCreeps: 6, bodyParts: 3, buildRoadTick: 0, buildRoadForceTick: 0, mainTick: 0};
    } else {
        Memory.data.buildRoadTick = Memory.data.buildRoadTick + 1;
        Memory.data.buildRoadForceTick = Memory.data.buildRoadForceTick + 1;
        Memory.data.mainTick = Memory.data.mainTick + 1;
    }


    // Testing githook Update
    //Memory.data = {maxCreeps: 8, bodyParts: 3};




    // Run each tower every tick
    towerAction.run();
    // Run each creep every tick
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        // Memory upgrade
        //creep.memory.randomEnergyStorage = 0;
        if ( creep.memory.role == 'worker') {
            creepHarvester.work(creep);
        } else if ( creep.memory.role == 'explorer') {
            creep.say('explore');
            creepExplorer.explore(creep, roomToExplore);
        } else {
            creepHarvester.work(creep);
        }
    }

    // Slow tasks for base building, run each task every 25 ticks
    for (let room in Game.rooms) {
        // Delete walls and construction sites
        //let constructionTargets = room.find(FIND_CONSTRUCTION_SITES);
        /*let constructionTargets = Game.rooms[room].find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_WALL);}
        });
        for (let i in constructionTargets) {
            constructionTargets[i].destroy();
            console.log(constructionTargets[i], i);
        }*/
        if (Memory.data.mainTick == 5){
            console.log('[main] - cleanMemory.clean()');
            cleanMemory.clean(); // Clean dead creeps from memory
        } else if (Memory.data.mainTick == 10){
            console.log('[main] - findExits.updateMemoryLocations()');
            findExits.updateMemoryLocations(Game.rooms[room]);
        } else if (Memory.data.mainTick == 15){
            console.log('[main] - spawnCreeper.spawn()');
            spawnCreeper.spawn(Game.spawns['Spawn1']); // Check if you can spawn things
        } else if (Memory.data.mainTick == 20){
            console.log('[main] - buildExtensions.new()');
            buildExtensions.new(Game.rooms[room]); // Check if you can build things
        } else if (Memory.data.mainTick == 25){
            console.log('[main] - buildTowers.new()');
            buildTowers.new(Game.rooms[room]); // Check if you can build things
        } else if (Memory.data.mainTick == 30){
            console.log('[main] - buildStorage.new()');
            buildStorage.new(Game.rooms[room]); // Check if you can build things
        }

        if (Memory.data.buildRoadForceTick > 10000) {
            console.log('[main] - forcing a rebuild of all roads');
            Game.rooms[room].memory.sources = {};
            Game.rooms[room].memory.towers = {};
            Game.rooms[room].memory.extensions = {};
            Game.rooms[room].memory.controller = {};
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
        } else if (Memory.data.buildRoadTick > 500) {
            console.log('[main] - reset memory road build timer');
            Memory.data.buildRoadTick = 0;
        }
    }

    if (Object.keys(Game.rooms).length < Game.gcl.level) {
        //console.log('[main] - Time to get another room!', Object.keys(Game.rooms).length, Game.gcl.level);
    } else {
        //console.log(Object.keys(Game.rooms).length, Game.gcl.level);
    }

    for (let room in Game.rooms) {
        let spawnTargets = Game.rooms[room].find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
        if (spawnTargets.length < 1) {
                console.log('[main] - No spawn in', room);
                // Create spawn
                // continue
        }
        // Do everything
        //console.log(room, spawnTargets.length);
    }

}
