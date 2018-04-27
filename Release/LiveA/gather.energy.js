// Gather energy from multiple energy sources by spliting up creeps into 2 groups

var gatherEnergy = {
    gather: function  (creep) {
        var sources = creep.room.find(FIND_SOURCES);
        var sourceToUse = sources[0];
        if(sources.length > 1 && creep.memory.roleid != null) {
            var choice = Number(creep.memory.roleid) % 2;
            if ( choice == 0 ) {
                sourceToUse = sources[0];
                if (sourceToUse.energyAvailable == 0) {
                    sourceToUse = sources[sources.length - 1];
                }
            } else {
                sourceToUse = sources[sources.length - 1];
                if (sourceToUse.energyAvailable == 0) {
                    sourceToUse = sources[0];
                }
            }
        }
        if(creep.harvest(sourceToUse) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sourceToUse, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    },
    withdraw: function (creep) {
        let withdraw = creep.withdraw(creep.room.storage, RESOURCE_ENERGY, creep.carryCapacity);
        if (withdraw == ERR_NOT_ENOUGH_RESOURCES) {
            //gatherEnergy.gather();
            creep.say('AHHHHHHHHH');
        } else if (withdraw == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }


};

module.exports = gatherEnergy;
