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
        'ls|list': {
            args: ['ssh', '--command', 'cd /data && ls -alh'],
            description: "List files in (docker) cwd"
        },
        'ps|status' : {
            args: ['ssh', '--command', 'cd /data && docker-compose ps'],
            description: 'Get docker container info'
        },
        'up|start' : {
            args: ['ssh', '--command', 'cd /data && docker-compose up -d'],
            description: 'Start docker containers'
        },
        'down|stop' : {
            args: ['ssh', '--command', 'cd /data && docker-compose stop'],
            description: 'Stop docker containers'
        },
        'logs' : {
            args: ['ssh', '--command', 'cd /data && docker-compose logs'],
            description: 'Get docker logs'
        },
        'reload|restart' : {
            args: ['ssh', '--command', 'cd /data && docker-compose restart'],
            description: 'Restart docker containers'
        },
        'pull' : {
            args: ['ssh', '--command', 'cd /data && docker-compose pull'],
            description: 'Update docker containers'
        },
        '*' : {
            args: ['ssh', '--command', 'cd /data && docker-compose <%= process.argv.slice(3).join(" ") %>'],
            description: 'Run arbitrary docker-compose command'
        }

    },

    command: function(){
        command(this, this._commands, this.command);
    }

});
