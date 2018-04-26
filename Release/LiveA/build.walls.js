var buildWalls = {
    new: function(room) {
        let exits = Game.map.describeExits(room);
        console.log(exits);
    }
};

module.exports = buildWalls;
