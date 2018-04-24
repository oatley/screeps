// Restore honor protocol for themselves

var creepHonor = {
    
    if (Game.creeps.length <= 1) { // Nobody witnessed the shame
        return;
    }
    
    var lowestBody = 0;
    var otherBody = 0;
    var lowestBodyCreep = '';
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        console.log(creep.body.length);
        if (creep.body.length < lowestBody ) { // Just stop writing this code before it's too late
            lowestBody = creep.body.length;
            lowestBodyCreep = Game.creeps[name];
        }
    }
    if (lowestBodyCreep) {
        lowestBodyCreep.suicide();
    }
};

module.exports = creepHonor;