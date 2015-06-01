'use strict';
var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var path = require('path');
var command = require('../command');
var Q = require('q');

module.exports = generators.Base.extend({

    constructor: function () {
        generators.Base.apply(this, arguments);

        this.on('error', function(err){

            this.env.error(chalk.magenta("Error: ") + chalk.red(err.message));

        });
        // This makes `appname` a required argument.
        //this.argument('appname', {type: String, required: true});

        // And you can then access it later on this way; e.g. CamelCased
        //this.appnameVar = _.camelCase(this.appname);

    },

    initializing: function(){


    },

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the stellar ' + chalk.red('spira') + ' generator!'
        ));

        var prompts = [
            {
                type: 'input',
                name: 'remoteRepo',
                message: 'Enter the remote repo of your spira project to clone',
                default: 'https://github.com/spira/spira.git'
            },
            {
                type: 'list',
                name: 'appFolder',
                message: 'Choose the directory for your application (select one)',
                default: './',
                choices: function(currentAnswers){
                    var options = [
                        {
                            name: ". (Current working directory)",
                            value: '.'
                        }
                    ];

                    var pathInfo = path.parse(currentAnswers.remoteRepo);

                    options.push({
                        name: pathInfo.name + " (Your repo name)",
                        value: pathInfo.name
                    });

                    options.push({
                        name: "Other",
                        value: false
                    });

                    return options;
                }
            },
            {
                type: 'input',
                name: 'appFolder',
                message: 'Enter the folder name you want to create the project in',
                when: function(currentAnswers){

                    return currentAnswers.appFolder === false;
                }
            }
        ];

        this.prompt(prompts, function (props) {
            this.props = props;
            // To access props later use this.props.someOption;

            done();
        }.bind(this));
    },

    writing: {
        //app: function () {
        //    this.fs.copy(
        //        this.templatePath('_package.json'),
        //        this.destinationPath('package.json')
        //    );
        //    this.fs.copy(
        //        this.templatePath('_bower.json'),
        //        this.destinationPath('bower.json')
        //    );
        //},
        //
        //projectfiles: function () {
        //    this.fs.copy(
        //        this.templatePath('editorconfig'),
        //        this.destinationPath('.editorconfig')
        //    );
        //    this.fs.copy(
        //        this.templatePath('jshintrc'),
        //        this.destinationPath('.jshintrc')
        //    );
        //}

        projectfiles: function(){

            console.log('this.props', this.props);

        }

    },

    install: function () {

        //this.spawnCommand('git', ['clone', this.props.remoteRepo, this.props.appFolder]);
        //
        //this.spawnCommand('cd', [this.props.appFolder]);

        var generator = this;

        command.promised(generator, 'git', ['clone', generator.props.remoteRepo, generator.props.appFolder])

            .then(function(){
                return command.promised(generator, 'yo', ['spira:vm', 'up'], {
                    cwd : generator.props.appFolder
                });
            })

            .then(function(){

                return Q.all([
                    command.promised(generator, 'yo', ['spira:npm', 'install'], {
                        cwd : generator.props.appFolder
                    }),
                    command.promised(generator, 'yo', ['spira:composer', 'install'], {
                        cwd : generator.props.appFolder + '/ap'
                    }),
                    command.promised(generator, 'yo', ['spira:gulp', 'bower:install'], {
                        cwd : generator.props.appFolder
                    })
                ]);
            })

            .catch(function(err){
                console.log('err', err);
                generator.env.error(chalk.magenta("Error: ") + chalk.red(err.message));
            })
        ;


    }
});
