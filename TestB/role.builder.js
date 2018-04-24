var gatherEnergy = require("gather.energy");
var roleHarvester = require("role.harvester");
var roleChiller = require("role.chiller");

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //console.log("doing builder stuff");
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } 
            else {
                // Builders become harvesters if there is nothing to build
                // This should be expanded to start creating buildings?
                roleHarvester.run(creep);
                //Room.createConstructionSite(Game.spawns['Spawn1'], 'extension', 'ext1');
	            
	        }
	    }
	    else {
	        gatherEnergy.gather(creep);
	    }
	}
};

module.exports = roleBuilder;