// Imports
var gatherEnergy = require('gather.energy');

var taskBuild = {

    build: function(creep) {
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
                    return 1;
                }
            } 
            else { // Nothing to build was found
                return 2;
	        }
	    }
	    /*else {
	        gatherEnergy.gather(creep);
            return 3
	    }*/
	}
};

module.exports = taskBuild;