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
        'dmp': {
            args: ['ssh', '--command', 'cd /data && docker-compose run phpcomposer dumpautoload'],
            description: "Rebuild composer autoload files"
        },
        'dmpo': {
            args: ['ssh', '--command', 'cd /data && docker-compose run phpcomposer dumpautoload -o'],
            description: "Rebuild optimised composer autoload files"
        },
        'require|install': {
            args: ['ssh', '--command', 'cd /data && docker-compose run phpcomposer require <%= lodash.rest(arguments).join(" ") %>'],
            description: "Install a composer dependency"
        },
        '*' : {
            args: ['ssh', '--command', 'cd /data && docker-compose run phpcomposer <%= process.argv.slice(3).join(" ") %>'],
            description: 'Run arbitrary composer command'
        }

    },

    command: function(){
        command.register(this, this._commands, this.command);
    }

});
