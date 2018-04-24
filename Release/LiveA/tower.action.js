
var towerAction = {

    run: function () {
        var towerTargets = Game.rooms[Object.keys(Game.rooms)[0]].find(FIND_STRUCTURES, {
            filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
        });
        for (var tower in towerTargets) {
            if(tower) {
                //console.log(towerTargets[tower]);
                var closestDamagedStructure = towerTargets[tower].pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) =>  structure.hits < structure.hitsMax
                });
                console.log(closestDamagedStructure);
                if(closestDamagedStructure) {
                    let repair = towerTargets[tower].repair(closestDamagedStructure);
                    console.log('trying to repair', repair);
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
