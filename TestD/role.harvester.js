// Imports
var taskHarvest = require('task.harvest');
var taskBuild = require('task.build');

var roleHarvester = {
    
    // Carry energy to base is instant transfer, carry energy to build is slow transfer
    
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity ) {
            gatherEnergy.gather(creep);
        }
        if (taskHarvest.harvest(creep)){
            console.log ('[' + creep.name + '] - harvesting');
        } else if(taskBuild.build(creep)) {
            console.log ('[' + creep.name + '] - building');
        } else {
            console.log ('[' + creep.name + '] - chilling');
        }
	}
};

module.exports = roleHarvester;