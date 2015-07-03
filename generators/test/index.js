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
        '_baseCommand' : '',
        'phplocal': {
            command: './api/vendor/bin/phpunit',
            args: ['--configuration', './api/phpunit.xml'],
            description: "Run PHPUnit tests locally"
        },
        'php|api|phpunit': {
            command: 'yo',
            args: ['spira:run', 'hhvm', '/data/api/vendor/bin/phpunit --colors --configuration /data/api/phpunit.xml --coverage-clover=/data/reports/coverage/api/clover.xml <%= process.argv.slice(4).join(" ") %>'],
            description: "Run PHPUnit tests in docker container"
        },
        'app|integration|bdd': {
            command: 'yo',
            args: ['spira:run', '/data/node_modules/.bin/cucumber.js'],
            description: "Run PHPUnit tests in docker container"
        },
        'coveralls': {
            command: 'yo',
            args: ['spira:run', 'hhvm', '/data/vendor/bin/coveralls -v'],
            description: "Compile PHP and JS coverage data and send to Coveralls.io"
        }

    },

    command: function(){
        command.register(this, this._commands, this.command);
    }

});
