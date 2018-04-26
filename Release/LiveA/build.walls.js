var buildWalls = {
    new: function() {
        let exits = Game.map.describeExits();
        console.log(exits);
    }
};

module.exports = buildWalls;
