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


module.exports.loop = function () {

    // ToDo list
    // - 1x Creep type builder, takes from storage builds/repairs
    // - 1x Creep type upgrader, takes from storage and upgrades the roomController
    // - 5x Creep type harvester, takes
    // - x1 Creep type explorer, claims room, and then suicides
    // - Energy storage building (harvesters should store in here)
    // - Backup redis and mongodb and mods

    // Optimize road code
    if (!Memory.data) {
        Memory.data = {maxCreeps: 8, bodyParts: 3, buildRoadTick: 0};
    } else {
        Memory.data.buildRoadTick = Memory.data.buildRoadTick + 1;
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
    // Testing githook Update
    //Memory.data = {maxCreeps: 8, bodyParts: 3};
    cleanMemory.clean(); // Clean dead creeps from memory
    spawnCreeper.spawn(Game.spawns['Spawn1']); // Check if you can spawn things
    buildExtensions.new(); // Check if you can build things
    //console.log('---------------------------------');
    buildTowers.new(); // Check if you can build things
    buildStorage.new(); // Check if you can build things

    //
    buildWalls.new();

    if (Memory.data.buildRoadTick == 100){
        console.log('[main] - buildRoads.buildToSource()');
        buildRoads.buildToSource();
    } else if (Memory.data.buildRoadTick == 200){
        console.log('[main] - buildRoads.buildToExtension()');
        buildRoads.buildToExtension();
    } else if (Memory.data.buildRoadTick == 300){
        console.log('[main] - buildRoads.buildToTower()');
        buildRoads.buildToTower();
    } else if (Memory.data.buildRoadTick == 400){
        console.log('[main] - buildRoads.buildToRoomController()');
        buildRoads.buildToRoomController();
    } else if (Memory.data.buildRoadTick >= 500){
        console.log('[main] - reset memory road build timer');
        Memory.data.buildRoadTick = 0;
    }




    // Find exits to the room, give these to explorers
    /*var exits = Game.map.describeExits(Game.spawns['Spawn1'].room.name);
    var roomToExplore = '';
    for (var otherRooms in exits) {
        //console.log(exits[otherRooms]);
        roomToExplore = exits[otherRooms];
        break;
        //console.log(Game.map.findExit(Game.spawns['Spawn1'].room.name, exits[otherRooms]));

    }*/

    // Run each tower
    towerAction.run();

    // Run each creep
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


}
