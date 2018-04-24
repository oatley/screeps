
var towerAction = {
    
    run: function () {
        var towerTargets = Game.rooms[Object.keys(Game.rooms)[0]].find(FIND_STRUCTURES, {
            filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}
        });
           console.log(towerTargets);
        for (var tower in towerTargets) {
               console.log(tower);
            if(tower) {
                console.log(towerTargets[tower]);
                var closestDamagedStructure = towerTargets[tower].pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => structure.hits < structure.hitsMax //&& structure.structureType == STRUCTURE_ROAD
                });
                if(closestDamagedStructure) {
                    towerTargets[tower].repair(closestDamagedStructure);
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