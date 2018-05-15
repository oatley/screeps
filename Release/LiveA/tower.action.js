
var towerAction = {

    run: function () {
        var towerTargets = Game.rooms[Object.keys(Game.rooms)[0]].find(FIND_STRUCTURES, {
            filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
        });
        for (var tower in towerTargets) {
            if(tower) {
                var closestDamagedRampart = towerTargets[tower].pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) =>  (structure.hits < 5000 &&  structure.structureType == STRUCTURE_RAMPART) });
                //console.log(towerTargets[tower]);
                var closestDamagedStructure = towerTargets[tower].pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) =>  (structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_ROAD) ||
                                            (structure.hits < 150000 &&  structure.structureType == STRUCTURE_RAMPART) //||
                                            //(structure.hits < 100000 &&  structure.structureType == STRUCTURE_WALL)
                });
                var closestHostile = towerTargets[tower].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                console.log('[tower.action] - ', closestHostile);
                if(closestHostile) {
                    console.log('[tower.action] - Enemy detected', closestHostile);
                    towerTargets[tower].attack(closestHostile);
                }
                if(closestDamagedStructure && !closestHostile) {
                    if (closestDamagedRampart > 0){
                        let repair = towerTargets[tower].repair(closestDamagedRampart);
                    } else {
                        let repair = towerTargets[tower].repair(closestDamagedStructure);
                    }
                }
                if(closestHostile) {
                    towerTargets[tower].attack(closestHostile);
                }
            }
        }
    }

};

module.exports = towerAction;
