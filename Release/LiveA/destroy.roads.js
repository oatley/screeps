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
                if (targetStructures[s].pos.x == targetRoads[r].pos.x && targetStructures[s].pos.y == targetRoads[r].pos.y) {
                    console.log('[destroy.roads] - Destroying road under structure', targetStructures[s].pos.x, targetStructures[s].pos.y, targetRoads[r].pos.x, targetRoads[r].pos.y);
                    //targetRoads[r].destroy();
                }
            }
            for (let r in targetConstructionRoads) {
                if (targetStructures[s].pos.x == targetConstructionRoads[r].pos.x && targetStructures[s].pos.y == targetConstructionRoads[r].pos.y) {
                    console.log('[destroy.roads] - Destroying road construction site under structure',targetStructures[s].pos.x, targetStructures[s].pos.y, targetConstructionRoads[r].pos.x, targetConstructionRoads[r].pos.y);
                    //targetConstructionRoads[r].remove();
                }
            }
        }
    }

};

module.exports = destroyRoads;
