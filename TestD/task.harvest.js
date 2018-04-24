// Imports
var gatherEnergy = require('gather.energy');

var taskHarvest = {
    
    harvest: function(creep) {
        if(creep.carry.energy < creep.carryCapacity ) {
            gatherEnergy.gather(creep);
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    return 0;
                }
            } else { 
                // No structures to take energy to were found
                return 1;
            }
        }
	}
};

module.exports = taskHarvest;