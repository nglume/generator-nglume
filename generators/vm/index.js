'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({

    constructor: function () {
        yeoman.generators.Base.apply(this, arguments);

        // This makes `command` a required argument.
        this.argument('command', { type: String, required: true });

    },

    command: function () {
        var done = this.async();

        var ym = this;

        var commandMap2 = {
            'up|start' : ['up'],
            'down|stop|suspend' : ['suspend'],
            'reload|restart' : ['reload'],
            'ssh' : ['ssh'],

            'boot' : ['ssh', '--command', 'cd /data && docker-compose ps']
        };

        var arg = _.find(commandMap2, function(arg, command){
            return new RegExp(ym.command).test(command);
        });

        if (!arg){
            ym.env.error(chalk.red("Your command `"+this.command+"` is not valid"));
        }

        console.log('running command', arg);
        var ls = this.spawnCommand('vagrant', arg);

        ls.on('error', function(error){
            ym.log(error);
        });

        ls.on('close', function (code) {
            done();
        });



    }

});
