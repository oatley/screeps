/*var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var spawnHarvester = require('spawn.harvester');


var spawnLogic = require('spawn.logic');
var buildExtensions = require('build.extensions');*/

//Imports
var cleanMemory = require('clean.memory');
var spawnCreeper = require('spawn.creeper');
var buildExtensions = require('build.extensions');
var creepHarvester = require('creep.harvester');

module.exports.loop = function () {
    
    Memory.data = {maxCreeps: 10};
    
    cleanMemory.clean(); // Clean dead creeps from memory
    spawnCreeper.spawn(Game.spawns['Spawn1']); // Check if you can spawn things
    buildExtensions.new(); // Check if you can build things
    
    // Run each creep
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        creepHarvester.work(creep)
    }

    /*var tower = Game.getObjectById('8ddc20f8f17b076566d3d862');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }*/
    
    //spawnHarvester.spawn(Game.spawns['Spawn1']);
    //console.log("[main] tick");
    //spawnCreeper.spawn(Game.spawns['Spawn1'], 'harvester');
    //spawnCreeper.spawn(Game.spawns['Spawn1'], 'upgrader');
    //spawnCreeper.spawn(Game.spawns['Spawn1'], 'builder');
    //spawnLogic.spawn(Game.spawns['Spawn1'])
    //buildExtensions.new();

    /*for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }*/
}