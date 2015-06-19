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
            args: ['-c', './api/postman/spira.json.postman_collection', '-e', './api/postman/spira-local.postman_environment', '--stopOnError'],
            description: "Run newman integration test"
        },
        'phplocal': {
            command: './api/vendor/bin/phpunit',
            args: ['--configuration', './api/phpunit.xml'],
            description: "Run PHPUnit tests locally"
        },
        'php': {
            command: 'vagrant',
            args: ['ssh', '--command', 'cd /data && docker-compose run --entrypoint hhvm php /data/api/vendor/bin/phpunit --colors --configuration /data/api/phpunit.xml --coverage-clover=/data/reports/coverage/api/clover.xml'],
            description: "Run PHPUnit tests in docker container"
        },
        'app|integration|bdd': {
            command: 'vagrant',
            args: ['ssh', '--command', 'cd /data && docker-compose run --entrypoint /data/node_modules/.bin/cucumber.js gulp'],
            description: "Run PHPUnit tests in docker container"
        },
        'coveralls': {
            command: 'vagrant',
            args: ['ssh', '--command', 'cd /data && docker-compose run --entrypoint /usr/bin/php lumen /data/vendor/bin/coveralls -v'],
            description: "Compile PHP and JS coverage data and send to Coveralls.io"
        }

    },

    command: function(){
        command.register(this, this._commands, this.command);
    }

});
