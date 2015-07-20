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

        var thisGenerator = this;

        var prompts = [
            {
                type: 'checkbox',
                name: 'steps',
                message: "Select which steps you would like to complete",
                choices: function(currentAnswers){

                    var steps = _.reduce(thisGenerator._installSteps, function(res, installStep, key){
                        res.push({
                            name: (res.length + 1) + '. ' + installStep.name,
                            value: key,
                            checked: true
                        });

                        return res;
                    }, []);

                    return steps;

                }
            },
            {
                type: 'input',
                name: 'remoteRepo',
                message: 'Enter the remote repo of your spira project to clone',
                default: 'https://github.com/spira/spira.git',
                when: function(currentAnswers){
                    return _.contains(currentAnswers.steps, 'cloneRepo');
                }
            },
            {
                type: 'list',
                name: 'appFolder',
                message: 'Choose the directory for your application (select one)',
                default: '.',
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
                },
                when: function(currentAnswers){
                    return _.contains(currentAnswers.steps, 'cloneRepo');
                }
            },
            {
                type: 'input',
                name: 'appFolder',
                message: 'Enter the folder name you want to create the project in',
                when: function(currentAnswers){

                    return _.contains(currentAnswers.steps, 'cloneRepo') && currentAnswers.appFolder === false;
                }
            }
        ];

        this.prompt(prompts, function (props) {
            this.props = props;
            // To access props later use this.props.someOption;

            if (!props.appFolder){
                props.appFolder = '.';
            }

            done();
        }.bind(this));
    },

    _installSteps: {

        cloneRepo: {
            name: "Clone repository",
            installPromise: function (generator) {

                return command.promised(generator, 'git', ['clone', generator.props.remoteRepo, generator.props.appFolder]);
            }
        },

        bootVm: {
            name: "Boot VM",
            installPromise: function (generator) {

                return command.promised(generator, 'yo', ['spira:vm', 'up', '--no-provision'], {
                    cwd: generator.props.appFolder
                });
            }
        },

        installVagrantPlugins: {
            name: "Install Vagrant Plugins",
            installPromise: function (generator) {

                return command.promised(generator, 'vagrant', ['plugin', 'install', 'vagrant-docker-compose'], {
                    cwd: generator.props.appFolder
                });
            }
        },

        provisionVm: {
            name: "Provision VM",
            installPromise: function (generator) {

                return command.promised(generator, 'yo', ['spira:vm', 'provision'], {
                    cwd: generator.props.appFolder
                });
            }
        },

        pullImages: {
            name: "Pull Images",
            installPromise: function (generator) {

                return command.promised(generator, 'yo', ['spira:docker', 'pull'], {
                    cwd: generator.props.appFolder
                });
            }
        },

        composerInstall: {
            name: "Install composer dependencies",
            installPromise: function (generator) {
                return command.promised(generator, 'yo', ['spira:composer', 'install'], {
                    cwd: generator.props.appFolder
                });
            }
        },
        composerAutoload: {
            name: "Build php autoload files",
            installPromise: function (generator) {
                return command.promised(generator, 'yo', ['spira:composer', 'dmpo'], {
                    cwd: generator.props.appFolder
                });
            }
        },

        buildDatabase: {
            name: "Build database",
            installPromise: function (generator) {

                return command.promised(generator, 'yo', ['spira:db', 'ms'], {
                    cwd : generator.props.appFolder
                });
            }
        },

        npmInstall: {
            name: "Install npm dependencies",
            installPromise: function (generator) {

                return command.promised(generator, 'yo', ['spira:npm', 'install'], {
                    cwd : generator.props.appFolder
                });
            }
        },

        bowerInstall: {
            name: "Install bower dependencies",
            installPromise: function (generator) {

                return command.promised(generator, 'yo', ['spira:gulp', 'bower:install'], {
                    cwd : generator.props.appFolder
                });
            }
        },

        gulpBuild: {
            name: "Build app files",
            installPromise: function (generator) {

                return command.promised(generator, 'yo', ['spira:gulp', 'build'], {
                    cwd : generator.props.appFolder
                });

            }
        },

        startContainers: {
            name: "Start Containers",
            installPromise: function (generator) {

                return command.promised(generator, 'yo', ['spira:docker', 'up'], {
                    cwd: generator.props.appFolder
                }).then(function(){
                    return command.promised(generator, 'yo', ['spira:docker', 'ps'], {
                        cwd: generator.props.appFolder
                    });
                });
            }
        },

        writeHosts: {
            name: "Write Hosts File (/etc/hosts)",
            installPromise: function (generator) {

                var fs = require('fs');
                fs.readFile(__dirname+'/spira-hosts', 'utf8', function (err,data) {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    return data;
                });

                var hostFilePromise = Q.nfcall(require('fs').readFile, __dirname+'/spira-hosts', 'utf-8');

                return hostFilePromise.then(function(hostsEntries){

                    return command.promised(generator, 'sudo', ['--', 'sh',  '-c', "printf '"+hostsEntries+"' >> /etc/hosts"], {
                        cwd: generator.props.appFolder
                    });

                });
            }
        },

        startBrowserStack: {
            name: "Start BrowserStack",
            installPromise: function (generator) {

                return command.promised(generator, 'yo', ['spira:gulp', 'watchlocal'], {
                    cwd: generator.props.appFolder
                });
            }
        }


    },


    install: function () {

        var generator = this;

        var installSequence = _.map(this.props.steps, function(step){

            return generator._installSteps[step].installPromise;

        });


        var promisedSequence = _.reduce(installSequence, function(soFar, installFn){
            return soFar.then(function(){
                return installFn(generator);
            });
        }, Q.when(true));

        promisedSequence
            .then(function(){
                generator.log(yosay(
                    'All Done!'
                ));
            })
            .catch(function(err){
                console.log('err', err);
                generator.env.error(chalk.magenta("Error: ") + chalk.red(err.message));
            })
        ;

    }
});
