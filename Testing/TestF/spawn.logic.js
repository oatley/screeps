var spawnCreeper = require("spawn.creeper");

var spawnLogic = {
    
    // In future support multiple spawn locations
    // If multiple extensions increase size of workers
    spawn: function (spawn) {
        
        // Have a counter of the total number of creeps, if you reach the total number of creeps, increase the max creep size
        // This should let creeps scale in numbers
        // In the future this would alternate between scale in numbers and body parts
        
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var totalCreeps = harvesters.length + builders.length + upgraders.length;
        

        if (Memory.data == null) {
            Memory.data = {maxCreeps: 10};
        } else {
            Memory.data = {maxCreeps: 10};
        }
        
        if ((harvesters.length > builders.length && harvesters.length > upgraders.length) && totalCreeps >= Memory.data.maxCreeps ) {
            //console.log('[spawn] Too many creeps and more than enough harvesters');
            return;
        }
        
        // Auto choose what type of creep to spawn
        if ( harvesters.length <= builders.length || harvesters.length <= upgraders.length) {
            spawnCreeper.spawn(spawn, 'harvester');
        } else if (builders.length <= upgraders.length) {
            spawnCreeper.spawn(spawn, 'builder');
        } else if (upgraders.length < builders.length) {
            spawnCreeper.spawn(spawn, 'upgrader');
        } else {
            console.log("[logic] no spawning");
        }
    }
    
};

module.exports = spawnLogic;