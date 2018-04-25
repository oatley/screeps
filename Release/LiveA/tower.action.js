
var towerAction = {

    run: function () {
        var towerTargets = Game.rooms[Object.keys(Game.rooms)[0]].find(FIND_STRUCTURES, {
            filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
        });
        for (var tower in towerTargets) {
            if(tower) {
                var closestHostile = towerTargets[tower].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(closestHostile) {
                    towerTargets[tower].attack(closestHostile);
                }
                //console.log(towerTargets[tower]);
                var closestDamagedStructure = towerTargets[tower].pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) =>  (structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_ROAD) ||
                                            (structure.hits < 10000 &&  structure.structureType == STRUCTURE_RAMPART) ||
                                            (structure.hits < 100000 &&  structure.structureType == STRUCTURE_WALL)
                });
                if(closestDamagedStructure) {
                    let repair = towerTargets[tower].repair(closestDamagedStructure);
                }
                var closestHostile = towerTargets[tower].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(closestHostile) {
                    towerTargets[tower].attack(closestHostile);
                }
            }
        }
    }

};

module.exports = towerAction;
