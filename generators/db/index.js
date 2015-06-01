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
        'mrs|refresh' : {
            args: ['ssh', '--command', 'cd /data && docker-compose run artisan migrate:refresh --seed'],
            description: 'Refresh database with fixture data'
        },
        'ms|build' : {
            args: ['ssh', '--command', 'cd /data && docker-compose run artisan migrate --seed'],
            description: 'Build database with fixture data (for first time)'
        },
        'm|buildempty' : {
            args: ['ssh', '--command', 'cd /data && docker-compose run artisan migrate'],
            description: 'Build database without fixture data'
        },
        'mr|rebuilddempty' : {
            args: ['ssh', '--command', 'cd /data && docker-compose run artisan migrate:refresh'],
            description: 'Refresh database without fixture data'
        }

    },

    command: function(){
        command.register(this, this._commands, this.command);
    }

});
