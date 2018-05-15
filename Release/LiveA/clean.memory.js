var cleanMemory = {
    clean: function(room) {

        //var room = Game.rooms[Object.keys(Game.rooms)[0]];
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('[clean] - deleting creep from memory:', name);
            }
        }
        if (room.memory && room.memory.extensions){
            var extensionTargets = room.find(FIND_STRUCTURES, {
                filter: (structure) => {return (structure.structureType == STRUCTURE_EXTENSION);}
            });
            for (var extensionId in room.memory.extensions) {
                let doesNotExist = true;
                for (let i in extensionTargets) {
                    if (extensionId == extensionTargets[i].id) {
                        doesNotExist = false;
                    }
                }
                if (doesNotExist) {
                    delete room.memory.extensions[extensionId];
                    console.log('[clean] - deleting extension from memory:', extensionId);
                }
            }
        }
    }
};

module.exports = cleanMemory;
