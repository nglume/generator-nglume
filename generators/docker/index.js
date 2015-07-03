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
        'ps|status' : {
            command: 'yo',
            args: ['spira:docker', 'ps'],
            description: 'Get docker container info'
        },
        'up|start' : {
            command: 'yo',
            args: ['spira:docker', 'up -d'],
            description: 'Start docker containers'
        },
        'down|stop' : {
            command: 'yo',
            args: ['spira:docker', 'stop <%= process.argv.slice(4).join(" ") %>'],
            description: 'Stop docker containers'
        },
        'logs' : {
            command: 'yo',
            args: ['spira:docker', 'logs <%= process.argv.slice(4).join(" ") %>'],
            description: 'Get docker logs'
        },
        'reload|restart' : {
            command: 'yo',
            args: ['spira:docker', 'restart <%= process.argv.slice(4).join(" ") %>'],
            description: 'Restart docker containers'
        },
        'pull' : {
            command: 'yo',
            args: ['spira:docker', 'pull'],
            description: 'Update docker containers'
        },
        '*' : {
            args: ['ssh', '--command', 'cd /data && docker-compose <%= process.argv.slice(3).join(" ") %>'],
            description: 'Run arbitrary docker-compose command'
        }

    },

    command: function(){
        command.register(this, this._commands, this.command);
    }

});
