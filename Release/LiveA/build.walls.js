var buildWalls = {
    new: function(room) {
        let exits = Game.map.describeExits(room);
        for (let exit in exits) {
            console.log(exit, exits[exit]);
        }
    }
};

module.exports = buildWalls;
