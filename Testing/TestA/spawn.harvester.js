var spawnHarvester = {

    /** @param {Creep} creep **/
    spawn: function(spawn) {

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var opts = [WORK, CARRY, MOVE];
        var creepName = 'Harvester' + Math.round(Math.random() * 1000).toString();
        
        //console.log(creepName, harvesters.length, spawn.spawnCreep([WORK, CARRY, MOVE], creepName , { dryRun: true } ));
        //console.log(harvesters.length < 3 && spawn.spawnCreep([WORK, CARRY, MOVE], creepName, { dryRun: true } ) == 0);
        
        if (harvesters.length >= 3) {
            return;
        }
        
        if ( harvesters.length < 3 && spawn.spawnCreep([WORK, CARRY, MOVE], creepName, {dryRun: true}) == 0 ) { 
            // Spawn new creep
            console.log('[spawn] Spawning new harvester');
            spawn.spawnCreep([WORK, CARRY, MOVE], creepName, { memory: {role: 'harvester'}});    
        } else {
            //console.log('[spawn] Unable to spawn harvester');
        }
	}
};

module.exports = spawnHarvester;