// Imports
var gatherEnergy = require('gather.energy');

var creepHarvester = {

    work: function (creep) {


        var targetStorage = creep.room.storage;

        // Set building and upgrading to false if you run out of energy
        if (creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.memory.upgrading = false;
            creep.memory.storing = false;
        } else if (creep.room.energyAvailable == creep.room.energyCapacity) {
            creep.memory.storing = false;
        }
        if ((creep.memory.building && creep.memory.upgrading) || (creep.memory.building && creep.memory.storing) || (creep.memory.storing && creep.memory.upgrading)){
            creep.memory.building = false;
            creep.memory.upgrading = false;
            creep.memory.storing = false;
        }

        // if creep energy cap is not full and creep is not building/upgrading = go get energy
        if (creep.carry.energy < creep.carryCapacity && !creep.memory.building && !creep.memory.upgrading && !creep.memory.storing) {
            gatherEnergy.withdraw(creep);
        } else { // have a full load of energy (may or may not be building/upgrading)
                creep.memory.upgrading = true;
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }

        }
    }
};

module.exports = creepHarvester;
