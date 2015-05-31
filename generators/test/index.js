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
        'api': {
            command: './node_modules/.bin/newman',
            args: ['-c', './api/postman/nglume.json.postman_collection', '-e', './api/postman/nglume-local.postman_environment', '--stopOnError'],
            description: "Run newman integration test"
        },
        'phplocal': {
            command: './api/vendor/bin/phpunit',
            args: ['--configuration', './api/phpunit.xml'],
            description: "Run PHPUnit tests locally"
        },
        'php': {
            command: 'vagrant',
            args: ['ssh', '--command', 'cd /data && docker-compose run --entrypoint /data/api/vendor/bin/phpunit php --configuration /data/api/phpunit.xml'],
            description: "Run PHPUnit tests in docker container"
        }

    },

    command: function(){
        command(this, this._commands, this.command);
    }

});