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
        'build': {
            command: 'yo',
            args: ['spira:forum', 'run-script', 'build-forum'],
            description: "Install and build forum"
        },
        'install': {
            command: 'yo',
            args: ['spira:forum', 'build'],
            description: "Install and build forum (alias for yo spira:forum build)"
        },
        '*' : {
            args: ['ssh', '--command', 'cd /data && docker-compose run --entrypoint hhvm devtools /usr/bin/composer <%= process.argv.slice(3).join(" ") %> --working-dir forum'],
            description: 'Run arbitrary composer command for forum'
        }

    },

    command: function(){
        command.register(this, this._commands, this.command);
    }

});
