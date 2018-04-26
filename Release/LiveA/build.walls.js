var buildWalls = {
    new: function() {
        let exits = Game.rooms.describeExits();
        console.log(exits);
    }
};

module.exports = buildWalls;
