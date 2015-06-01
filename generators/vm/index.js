'use strict';
var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var command = require('../command');

module.exports = generators.Base.extend({

    constructor: function () {
        generators.Base.apply(this, arguments);

        // This makes `command` a required argument.
        this.argument('command', { type: String, required: false });

    },

    _commands: {
        '_baseCommand' : 'vagrant',
        'up|start' : {
            args: ['up'],
            description: 'Start virtual machine'
        },
        'down|stop|suspend' : {
            args: ['suspend'],
            description: 'Stop virtual machine'
        },
        'reload|restart' : {
            args: ['reload'],
            description: 'Reload virtual machine'
        },
        'ssh' : {
            args: ['ssh'],
            error: function(ym, code){
                ym.log(chalk.blue('Try running '+chalk.magenta('`yo spira:vm up`')+' first'));
            },
            description: 'Log in to virtual machine'
        },
        '*' : {
            args: ['<%= process.argv.slice(3).join(" ") %>'],
            description: 'Run arbitrary vagrant command'
        }

    },

    command: function(){
        command.register(this, this._commands, this.command);
    }

});
