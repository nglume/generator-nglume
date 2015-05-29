'use strict';
var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = function (context, commands, request) {

        commands = _.defaults(commands, {
            '_baseCommand': 'ls',
            'ls|list': {
                args: ['-alh']
            },
            'help': {
                run: function(args, commands){

                    context.log(chalk.green("Options: "));

                    _.each(commands, function(cmd, key){
                        if (key.charAt(0) == '_'){
                            return;
                        }

                        context.log(chalk.blue(key) + ' : '+ _.defaults(cmd.description, '?'));
                    })
                }
            }
        });

        var done = context.async();

        var commandConf = _.find(commands, function(arg, command){
            return new RegExp(request).test(command);
        });

        if (!commandConf){
            context.env.error(yosay(chalk.red("Your command `"+request+"` is not valid")));
        }

        //assign defaults
        commandConf = _.defaults(commandConf, {
            command: commands._baseCommand
        });

        if (_.isFunction(commandConf.run)){

            commandConf.run(commandConf.args, commands);

            done();
        }else{

            var commandString = commandConf.command;

            if (!!commandConf.args){
                commandString += ' ' + commandConf.args.join(' ');
            }

            context.log(chalk.green('Running command'), chalk.blue('`'+commandString+'`'));

            var ls = context.spawnCommand(commandConf.command, commandConf.args);

            ls.on('error', function(error){
                context.log(error);
            });

            ls.on('close', function (code) {
                if (commandConf.error && code > 0){
                    commandConf.error(context, code);
                }
                done();
            });

        }




    };
