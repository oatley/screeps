// Imports
var gatherEnergy = require('gather.energy');


var creepHarvester = {
    
    work: function (creep) {
        
        var targetStructures = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
        });
        
        var targetConstruction = creep.room.find(FIND_CONSTRUCTION_SITES);
        
        // Set building and upgrading to false if you run out of energy
        if (creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.memory.upgrading = false;
        } 
        if (creep.memory.building && creep.memory.upgrading ){
            creep.memory.building = false;
            creep.memory.upgrading = false;
        }
        
    
        // if creep energy cap is not full and creep is not building/upgrading = go get energy
        if (creep.carry.energy < creep.carryCapacity && !creep.memory.building && !creep.memory.upgrading) {
            // go get energy
            //creep.say('energy');
            gatherEnergy.gather(creep);
        } else { // have a full load of energy (may or may not be building/upgrading)
            if (targetStructures.length > 0) {
                // if structures energy cap is not full and not building = go fill structures
                //creep.say('store');
                //creep.memory.building = false;
                //creep.memory.upgrading = false;
                if(creep.transfer(targetStructures[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetStructures[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (targetConstruction.length > 0 && !creep.memory.upgrading) {
                // if structures energy cap is full set and construction sites exist = go build(set building true)
                //creep.say('build');
                var tryBuild = creep.build(targetConstruction[0]);
                if( tryBuild == ERR_NOT_IN_RANGE) {
                    creep.memory.building = true;
                    creep.moveTo(targetConstruction[0], {visualizePathStyle: {stroke: '#ffffff'}});
                } else if (tryBuild == ERR_RCL_NOT_ENOUGH) { // Room level too low to finish building
                    creep.memory.building = false;
                    creep.memory.upgrading = true;
                }
            } else {
                //creep.say('upgrade');
                creep.memory.upgrading = true;
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = creepHarvester;