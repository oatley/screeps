// Because you can build roads UNDER any structure which is really dumb,
// you might need to delete these roads otherwise they will break econ by repair costs

let destroyRoads = {
    destroy: function (room) {
        let targetRoads = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_ROAD);}
        });
        let targetConstructionRoads = room.find(FIND_CONSTRUCTION_SITES, {
                    filter: (structure) => {return (structure.structureType == STRUCTURE_ROAD);}

        });

        var targetStructures = room.find(FIND_STRUCTURES);

        for (let s in targetStructures) {
            for (let r in targetRoads) {
                if (targetStructures[s].pos == targetRoads[r].pos) {
                    console.log('[destroy.roads] - Destroying road under structure');
                    targetRoads[r].destroy();
                }
            }
            for (let r in targetConstructionRoads) {
                if (targetStructures[s].pos == targetConstructionRoads[r].pos) {
                    console.log('[destroy.roads] - Destroying road construction site under structure');
                    targetConstructionRoads[r].remove();
                }
            }
        }
    }

};

module.exports = destroyRoads;
