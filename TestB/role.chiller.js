var roleChiller = {
    
    // In the even that the unit has nothing to do... Just move out of the way plz...
    chill: function (creep) {
        var structureTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN);}
        });
                var spawnx = structureTargets[0].pos.x + 5; 
                var spawny = structureTargets[0].pos.y;
                creep.moveTo(spawnx, spawny, {visualizePathStyle: {stroke: '#ffaa00'}});
                //creep.moveTo(structureTargets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
    }

};

module.exports = roleChiller;