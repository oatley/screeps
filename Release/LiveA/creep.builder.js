// Imports
var gatherEnergy = require('gather.energy');

var creepBuilder = {

    work: function (creep) {

        var targetStructures = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }
        });
        var targetStorage = creep.room.storage;

        var targetTowers = creep.room.find(FIND_STRUCTURES, {
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



        //console.log(targetStorage, targetStorage.store.energy, targetStorage.storeCapacity);
        // if creep energy cap is not full and creep is not building/upgrading = go get energy
        if (creep.carry.energy < creep.carryCapacity && creep.room.storage.store.energy > creep.carryCapacity && !creep.memory.building && !creep.memory.upgrading && !creep.memory.storing) {
            // go get energy
            //creep.say('WITHDRAW');
            let withdraw = creep.withdraw(creep.room.storage, RESOURCE_ENERGY, creep.carryCapacity);
            if (withdraw == ERR_NOT_ENOUGH_RESOURCES) {
                gatherEnergy.gather();
            } else if (withdraw == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
            }

        } else { // have a full load of energy (may or may not be building/upgrading)
            if (targetTowers.length > 0 && !creep.memory.building && !creep.memory.upgrading && creep.room.controller.ticksToDowngrade >= 1000) {
                //creep.say('DANGER');
                creep.memory.storing = true;
                let randomEnergyStorage = creep.memory.randomEnergyStorage;
                if (randomEnergyStorage >= targetTowers.length || (targetTowers.length > 1 && randomEnergyStorage == 0)) {
                    randomEnergyStorage = Math.round(Math.random(0, targetTowers.length));
                    creep.memory.randomEnergyStorage = randomEnergyStorage;
                }
                console.log(targetTowers[randomEnergyStorage], randomEnergyStorage);
                let transfer = creep.transfer(targetTowers[randomEnergyStorage], RESOURCE_ENERGY);
                if(transfer == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetTowers[randomEnergyStorage], {visualizePathStyle: {stroke: '#ffffff'}});
                } else if (transfer == ERR_FULL) {
                    creep.memory.storing = false;
                    randomEnergyStorage = Math.round(Math.random(0, targetTowers.length));
                    creep.memory.randomEnergyStorage = randomEnergyStorage;
                }
                if (creep.carry.energy == 0) {
                    creep.memory.storing = false;
                    randomEnergyStorage = Math.round(Math.random(0, targetTowers.length));
                    creep.memory.randomEnergyStorage = randomEnergyStorage;
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
