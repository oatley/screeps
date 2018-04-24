var cleanMemory = {
    clean: function() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('[clean] Clearing non-existing creep memory:', name);
            }
        }
    }
};

module.exports = cleanMemory;
