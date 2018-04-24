//Imports
var cleanMemory = require('clean.memory');
var spawnCreeper = require('spawn.creeper');
var buildExtensions = require('build.extensions');
var buildTowers = require('build.towers');
var buildRoads = require('build.roads');
var creepHarvester = require('creep.harvester');
var creepExplorer = require('creep.explorer');
var towerAction = require('tower.action');

module.exports.loop = function () {
    
    // Figure out how to get the downgrade value and stop it from happening
    
    // I have no idea what I was doing here? Too much beer?
    /*var lowestBody = 0;
    var otherBody = 0;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        console.log(creep.body.length);
        if (creep.body.length < lowestBody ) {
            lowestBody = creep.body.length;
        }
    }*/
    
    //if (spawn.room.energyCapacityAvailable >)
    Memory.data = {maxCreeps: 8, bodyParts: 3};
    
    cleanMemory.clean(); // Clean dead creeps from memory
    spawnCreeper.spawn(Game.spawns['Spawn1']); // Check if you can spawn things
    buildExtensions.new(); // Check if you can build things
    buildTowers.new(); // Check if you can build things
    buildRoads.new();
    
    // Find exits to the room, give these to explorers
    var exits = Game.map.describeExits(Game.spawns['Spawn1'].room.name);
    var roomToExplore = '';
    for (var otherRooms in exits) {
        //console.log(exits[otherRooms]);
        roomToExplore = exits[otherRooms];
        break;
        //console.log(Game.map.findExit(Game.spawns['Spawn1'].room.name, exits[otherRooms]));
        
    }
    
    // Run each tower
    towerAction.run();
    
    // Run each creep
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
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