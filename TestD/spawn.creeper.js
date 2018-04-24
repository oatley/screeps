
var spawnCreeper = {

    spawn: function(spawn) {
        
        //var energyAvailableInRoom = spawn.room.energyAvailable
        
        if ( spawn.room.energyAvailable == spawn.room.energyCapacityAvailable) {
            var opts = [WORK, CARRY, MOVE];
        }
        
        
        
        var idnum = Math.round(Math.random() * 1000).toString();
        var creepName = 'Creeper' + idnum;
        var allCreeps = _.filter(Game.creeps, (creep) => true);
        
        if (allCreeps.length > Memory.data.maxCreeps) {
            //console.log('[spawn] Too many creeps ' + allCreeps.length.toString() + '/' + Memory.data.maxCreeps.toString());
        } else if (spawn.spawnCreep([WORK, CARRY, MOVE], creepName, {dryRun: true}) == 0 ) { 
            console.log('[spawn] Spawning new ' + creepName);
            spawn.spawnCreep([WORK, CARRY, MOVE], creepName, { memory: { roleid: idnum, building: false, upgrading: false }});    
        } else {
            //console.log('[spawn] Not enough resources to spawn');
        }
	}
};

module.exports = spawnCreeper;