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
        'shell': {
            command: 'vagrant',
            args: ['ssh', '--command', 'cd /data && docker-compose run --no-deps --entrypoint=/bin/bash devtools'],
            description: 'Interactive shell'
        },
        '*' : {
            args: ['ssh', '--command', 'cd /data && docker-compose run --no-deps --entrypoint <%= process.argv[3] %> devtools <%= process.argv.slice(4).join(" ") %>'],
            description: 'Run arbitrary development command'
        }
    },

    command: function(){
        command.register(this, this._commands, this.command);
    }

});
