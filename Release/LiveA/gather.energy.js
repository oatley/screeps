// Gather energy from multiple energy sources by spliting up creeps into 2 groups

let gatherEnergy = {
    gather: function  (creep) {
        let sources = creep.room.find(FIND_SOURCES, {
                        filter: (source) => {
                            return (source.energyAvailable > 0)
                        }
        });
        if (sources.length > 1) {
            if ((Number(creep.memory.roleid) % 2) == 0) {
                let sourceToUse = sources[1];
            }
        } (source.length > 0) {
            let sourceToUse = sources[0];
        } else {
            console.log('[gather.energy] - No energy left in room');
            return;
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
