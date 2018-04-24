//var roleHarvester = require('role.harvester');
//var roleUpgrader = require('role.upgrader');
//var roleBuilder = require('role.builder');
//var spawnHarvester = require('spawn.harvester');
//var cleanMemory = require('clean.memory');
//var spawnCreeper = require('spawn.creeper');
//var spawnLogic = require('spawn.logic');
//var buildExtensions = require('build.extensions');

module.exports.loop = function () {
    
    // Global stored values
    //var Game.memory.max_creeps = 5;
    
    //Memory.data = {maxCreeps: Memory.data.maxCreeps + 1};
    
    //console.log("tick");
    //console.log(Memory.data.maxCreeps);

    // Clean the memory of creeps that died
    cleanMemory.clean();

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
    //buildExtensions.buildExt();
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
        }*/
    }
}