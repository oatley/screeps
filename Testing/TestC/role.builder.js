// Imports
var taskBuild = require('task.build');
var taskHarvest = require('task.harvest');

var roleBuilder = {
    run: function(creep) {
        if(taskBuild.build(creep)) { 
            console.log ('[' + creep.name + '] - building');
        } else if (taskHarvest.harvest(creep)) { // Nothing to harvest
            console.log ('[' + creep.name + '] - harvesting');
        } else {
            console.log ('[' + creep.name + '] - chilling');
        }
    }
};

module.exports = roleBuilder;