
var spawnCreeper = {

    spawn: function(spawn) {

        var idnum = Math.round(Math.random() * 1000).toString();
        var allCreepsInGame = _.filter(Game.creeps, (creep) => true);
        let allCreeps = spawn.room.find (FIND_MY_CREEPS);
        var allExplorers = spawn.room.find (FIND_MY_CREEPS, {
                    filter: (creep) => {return (creep.memory.role == 'explorer');}
        });
        var allBuilders = spawn.room.find (FIND_MY_CREEPS, {
                    filter: (creep) => {return (creep.memory.role == 'builder');}
        });
        var allWorkers = spawn.room.find (FIND_MY_CREEPS, {
                    filter: (creep) => {return (creep.memory.role == 'worker');}
        });
        var allUpgraders = spawn.room.find (FIND_MY_CREEPS, {
                    filter: (creep) => {return (creep.memory.role == 'upgrader');}
        });


        // Do not spawn if too many creeps
        if (allCreeps.length >= spawn.room.memory.maxCreeps) {
            return;
        }


        // Check if we need an Explorer, check if there is a room in expandRooms that is not in Game.rooms
        let roomToExplore = false;
        if (Memory.data.expandRooms.length > 0) {
                roomToExplore = true;
                //console.log('Explore the rooms = ', roomToExplore, Memory.data.expandRooms);
        }

        // Enough energy to build the fattest creep ever?
        if (spawn.room.energyAvailable == spawn.room.energyCapacityAvailable || (allCreeps.length <= 2 && spawn.room.energyAvailable >= 300 )) {
            var energyToUse = spawn.room.energyAvailable;
            var opts = [CARRY, MOVE, WORK];
            var bodyCarry = 1;
            var bodyMove = 1;
            var bodyWork = 1;
            // Add one carry
            energyToUse -= 50;
            // Add one move
            energyToUse -= 50;
            // Add one work
            energyToUse -= 100;
            if (energyToUse > 1500) {
                energyToUse -= 500; // Try and improve econ
            } else if (energyToUse > 1000) {
                energyToUse -= 250; // Try and improve econ
            }

            // Create memories to assign roles
            //console.log ('there are worker = ', allWorkers.length, 'so make workers', 'and there are builders = ', allBuilders.length);
            if (allWorkers.length < 2) {
                //console.log('make workers true');
                if (allWorkers.length != 0) {
                    if (((allWorkers[0].memory.roleid % 2) == 0 && (idnum % 2) == 0) || ((allWorkers[0].memory.roleid % 2) == 1 && (idnum % 2) == 1)) {
                        idnum = Number(idnum) + 1;
                    }
                }
                var insertMemory = { memory: { roleid: idnum, role: 'worker', building: false, upgrading: false, storing: false, randomEnergyStorage: 0 }};
                var creepName = 'Worker' + idnum;
            } else if ( roomToExplore && allExplorers.length < 1 && energyToUse >= 800  ) { //allExplorers.length == 0 && energyToUse >= 650){
                var insertMemory = { memory: { roleid: idnum, role: 'explorer', building: false, upgrading: false, storing: false, randomEnergyStorage: 0 }};
                var creepName = 'Explorer' + idnum;
                energyToUse -= 650;
                bodyWork += 2;
                opts.push(MOVE);
                opts.push(CLAIM);
            } else if (allBuilders.length < 2) {//allBuilders.length == 0) {
                if (allBuilders.length != 0) {
                    if (((allBuilders[0].memory.roleid % 2) == 0 && (idnum % 2) == 0) || ((allBuilders[0].memory.roleid % 2) == 1 && (idnum % 2) == 1)) {
                        idnum = Number(idnum) + 1;
                    }
                }
                var insertMemory = { memory: { roleid: idnum, role: 'builder', building: false, upgrading: false, storing: false, randomEnergyStorage: 0 }};
                var creepName = 'Builder' + idnum;
                energyToUse -= 50;
                bodyWork += 1; // This is just done to make sure builders can travel fast off road
                opts.push(MOVE);
            } else if (allUpgraders.length < 1) {//allBuilders.length == 0) {
                var insertMemory = { memory: { roleid: idnum, role: 'upgrader', building: false, upgrading: false, storing: false, randomEnergyStorage: 0 }};
                var creepName = 'Upgrader' + idnum;
            } else {
                //console.log('alternate bad worker maker');
                var insertMemory = { memory: { roleid: idnum, role: 'worker', building: false, upgrading: false, storing: false, randomEnergyStorage: 0 }};
                var creepName = 'Worker' + idnum;
            }

            // Another check here, if work != 0 and work % 5 == 0 then add a carry and move
            while (energyToUse >= 100 && opts.length < 25 ) {

                // If movement speed is at full and one remaining slot left, just stop, don't waste on an extra +1 tick
                //if ( (energyToUse == 50 || energyToUse == 100) && ((bodyWork + bodyCarry / 2) == bodyMove )) {
                //    break;
                //}
                energyToUse -= 50;
                //if (((bodyWork + 1)+ bodyCarry / 2) >= bodyMove ) {
                if (((bodyWork)+ bodyCarry / 2) >= bodyMove ) { // Can have one less move if you have roads
                    // Add one move
                    bodyMove += 1;
                    opts.push(MOVE);
                    //console.log('add move to creep');
                } else if (((bodyWork + bodyMove) * 0.20) > bodyCarry) {
                    // Add one carry
                    bodyCarry += 1;
                    opts.push(CARRY);
                    //console.log('add carry to creep');
                }
                else if (energyToUse >= 100){
                    // Add one work
                    energyToUse -= 50;
                    bodyWork += 1;
                    opts.push(WORK);
                    //console.log('add work to creep');
                }
            }

            let spawncreep = spawn.spawnCreep(opts, creepName, {dryRun: true});
            if ( spawncreep == 0 ) {
                console.log('[spawn.creeper] Spawning new ' + creepName);
                spawn.spawnCreep(opts, creepName, insertMemory);
            } else {
                //console.log('[spawn.creeper] Unable to spawn creep', spawncreep, opts, opts.length, creepName);
            }
        }
	}
};

module.exports = spawnCreeper;
