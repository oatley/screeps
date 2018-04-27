// Imports
var gatherEnergy = require('gather.energy');

var creepBuilder = {

    work: function (creep) {

        var targetStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }
        });
        var targetStorage = creep.room.storage;

        var targetTower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
                    }
        });

        var targetConstruction = creep.room.find(FIND_CONSTRUCTION_SITES);
        var targetConstructionExtensions = creep.room.find(FIND_CONSTRUCTION_SITES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION);
                    }

        });

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


        var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        //console.log('why you no build?');

        //console.log(targetStorage, targetStorage.store.energy, targetStorage.storeCapacity);
        // if creep energy cap is not full and creep is not building/upgrading = go get energy
        if (creep.carry.energy < creep.carryCapacity && creep.room.storage.store.energy > creep.carryCapacity && !creep.memory.building && !creep.memory.upgrading && !creep.memory.storing) {
            // go get energy
            //creep.say('WITHDRAW');
            let withdraw = creep.withdraw(creep.room.storage, RESOURCE_ENERGY, creep.carryCapacity-creep.carry.energy);
            if (withdraw == ERR_NOT_ENOUGH_RESOURCES) {
                gatherEnergy.gather();
            } else if (withdraw == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
            }

        } else { // have a full load of energy (may or may not be building/upgrading)
            if (targetStructure  && !creep.memory.building && !creep.memory.upgrading && creep.room.controller.ticksToDowngrade >= 1000) {
                creep.memory.storing = true;

                //console.log('[creep.harvester] - Creep ' + creep.name + ' storing energy in:', randomEnergyStorage.toString() + '/' + targetStructures.length .toString());
                let transfer = creep.transfer(targetStructure, RESOURCE_ENERGY);
                if(transfer == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetStructure, {visualizePathStyle: {stroke: '#ffffff'}});
                } else if (transfer == ERR_FULL) {
                    creep.memory.storing = false;
                }
            } else if (targetConstruction.length > 0 && !creep.memory.upgrading && creep.room.controller.ticksToDowngrade >= 8000) {
                // if structures energy cap is full set and construction sites exist = go build(set building true)
                //creep.say('build');
                // Build extensions before anything else
                if (targetConstructionExtensions > 0) {
                    var tryBuild = creep.build(targetConstructionExtensions[0]);
                } else {
                    var tryBuild = creep.build(targetConstruction[0]);
                }
                if( tryBuild == ERR_NOT_IN_RANGE) {
                    creep.memory.building = true;
                    creep.moveTo(targetConstruction[0], {visualizePathStyle: {stroke: '#ffffff'}});
                } else if (tryBuild == ERR_RCL_NOT_ENOUGH) { // Room level too low to finish building
                    creep.memory.building = false;
                    creep.memory.upgrading = true;
                }
            } else if (targetTower && !creep.memory.building && !creep.memory.upgrading && creep.room.controller.ticksToDowngrade >= 1000) {
                //creep.say('towers');
                creep.memory.storing = true;
                let transfer = creep.transfer(targetTower, RESOURCE_ENERGY);
                if(transfer == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetTower, {visualizePathStyle: {stroke: '#ffffff'}});
                } else if (transfer == ERR_FULL) {
                    creep.memory.storing = false;
                }
                if (creep.carry.energy == 0) {
                    creep.memory.storing = false;
                    randomEnergyStorage = Math.round(Math.random(0, targetTowers.length));
                    creep.memory.randomEnergyStorage = randomEnergyStorage;
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

module.exports = creepBuilder;
