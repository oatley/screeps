var spawnCreeper = {

    // This whole file can be simplified into a shorter set moving logic to spawn logic
    // Just make it dry run and create
    /** @param {Creep} creep **/
    spawn: function(spawn, creeper) {
        //console.log("[spawncreeper] tick");
        var creepers = _.filter(Game.creeps, (creep) => creep.memory.role == creeper);
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var opts = [WORK, CARRY, MOVE];
        var idnum = Math.round(Math.random() * 1000).toString();
        var creepName = creeper + idnum;
        
        // Test if there are enough resources for a spawn and then try and spawn
        if (spawn.spawnCreep([WORK, CARRY, MOVE], creepName, {dryRun: true}) == 0 ) { 
            console.log('[spawn] Spawning new ' + creeper);
            spawn.spawnCreep([WORK, CARRY, MOVE], creepName, { memory: { role: creeper, roleid: idnum }});    
        } else {
            console.log('[spawn] Not enough resources to spawn ' + creeper);
        }
	}
};

module.exports = spawnCreeper;