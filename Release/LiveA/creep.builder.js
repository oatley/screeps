// Imports
let gatherEnergy = require('gather.energy');
let creepHarvester = require('creep.harvester');
let creepUpgrader = require('creep.upgrader');
let creepBuilder = {

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
                        return structure.structureType == STRUCTURE_TOWER && structure.energy < (structure.energyCapacity/2);
                    }
        });

        var targetConstruction = creep.room.find(FIND_CONSTRUCTION_SITES);
        var targetConstructionExtensions = creep.room.find(FIND_CONSTRUCTION_SITES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION);
                    }

        });

        var closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) =>  (structure.hits < 150000 &&  structure.structureType == STRUCTURE_RAMPART) ||
                                    (structure.hits < 150000 &&  structure.structureType == STRUCTURE_WALL)
        });


        // Creep has been banished to build a new spawn in another room until death
        if (creep.memory.banish) {
            if (creep.room.name != creep.memory.banish) {
                creep.say('banished');
                var position = new RoomPosition(25, 25, creep.memory.banish); // might need to find a better path
                creep.moveTo(position, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.memory.building = false;
                creep.memory.upgrading = false;
                creep.memory.storing = false;
                return;
            }
        }


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
        if (creep.memory.role == 'explorer') {
            creep.memory.upgrading = false;
        }


        var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);


        //console.log('why you no build?');
        //console.log(targetStorage, targetStorage.store.energy, targetStorage.storeCapacity);
        // if creep energy cap is not full and creep is not building/upgrading = go get energy
        if (creep.carry.energy < creep.carryCapacity  && !creep.memory.building && !creep.memory.upgrading && !creep.memory.storing) {
            if ((creep.room.storage) && creep.room.storage.store.energy > creep.carryCapacity) {
                let withdraw = creep.withdraw(creep.room.storage, RESOURCE_ENERGY, creep.carryCapacity-creep.carry.energy);
                if (withdraw == ERR_NOT_ENOUGH_RESOURCES) {

                } else if (withdraw == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                gatherEnergy.gather(creep);
            }
        } else { // have a full load of energy (may or may not be building/upgrading)
            if (targetStructure && !creep.memory.building && !creep.memory.upgrading && (creep.room.controller.ticksToDowngrade >= 1000 || creep.memory.role == 'explorer' || creep.memory.banish)) {
                creep.memory.storing = true;

                //console.log('[creep.harvester] - Creep ' + creep.name + ' storing energy in:', randomEnergyStorage.toString() + '/' + targetStructures.length .toString());
                let transfer = creep.transfer(targetStructure, RESOURCE_ENERGY);
                if(transfer == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targetStructure, {visualizePathStyle: {stroke: '#ffffff'}});
                } else if (transfer == ERR_FULL) {
                    creep.memory.storing = false;
                }
            } else if (targetConstruction.length > 0 && !creep.memory.upgrading && (creep.room.controller.ticksToDowngrade >= 8000 || creep.memory.role == 'explorer' || creep.memory.banish)) {
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
            } else if (closestDamagedStructure && !creep.memory.upgrading &&!creep.memory.storing && creep.room.controller.ticksToDowngrade >= 1000) {
                let repair = creep.repair(closestDamagedStructure);
                if (repair == OK) {
                    creep.memory.building = true;
                }
                else if (repair == ERR_NOT_IN_RANGE) {
                    creep.memory.building = true;
                    creep.moveTo(closestDamagedStructure, {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    creep.memory.building = false;
                }
            } else { // What should idle builders do?
                // Builders cannot harvest it breaks them in infinite loop

                // Can builders get banished to a neighbor room if we own that room and there are no creeps in it and theres a construction site?

                for (let room in Game.rooms) {
                    let extensionTargets = Game.rooms[room].find(FIND_STRUCTURES, {
                                filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION);}
                    });
                    if (Game.rooms[room].find(FIND_CONSTRUCTION_SITES).length > 0 && (Game.rooms[room].find (FIND_MY_CREEPS).length == 0 || extensionTargets.length <= 5) && (Game.rooms[room].controller.owner) && (Game.rooms[room].controller.owner.username) &&  (Game.rooms[room].controller.owner.username == 'oatley')) {
                        creep.memory.banish = room;
                    }
                }

                creepUpgrader.work(creep);

            }
        }
    }
};

module.exports = creepBuilder;
