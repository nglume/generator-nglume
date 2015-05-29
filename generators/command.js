'use strict';
var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = function (context, commands, request) {

        commands = _.defaults(commands, {
            '_baseCommand': 'ls',
            'ls|list': {
                command: 'ls',
                args: ['-alh'],
                description: "List files in cwd"
            },
            'help': {
                description: "Print this help page",
                run: function(args, commands){

                    context.log(chalk.blue("Options: "));

                    _.each(commands, function(cmd, key){
                        if (key.charAt(0) == '_'){
                            return;
                        }

                        context.log(chalk.magenta(key) + ' : '+ _.defaults(cmd.description, '?'));
                    })
                }
            }
        });

        var done = context.async();

        var commandConf = _.find(commands, function(arg, commandAliases){

            if (!request){
                return false;
            }

            return _.contains(commandAliases.split('|'), request)
        });

        if (!commandConf && _.has(commands, '*')){ //no match found but catchall is defined
            commandConf = commands['*'];
        }

        if (!commandConf){
            if (!request){
                request = '';
            }
            context.env.error(chalk.magenta("Error: ") + chalk.red("Your command `"+context.options.namespace+' '+request+"` is not valid. Try `"+chalk.blue('yo '+context.options.namespace+' help')+"` to see your options"));
        }

        //assign defaults
        commandConf = _.defaults(commandConf, {
            command: commands._baseCommand
        });

        commandConf.args = _.map(commandConf.args, function(arg){

            if (! /<%.*%>/.test(arg)){
                return arg;
            }

            return _.template(arg, {
                imports: {
                    lodash: _
                }
            })(context);

        });

        if (_.isFunction(commandConf.run)){

            commandConf.run(commandConf.args, commands);

            done();
        }else{

            var commandString = commandConf.command;

            if (!!commandConf.args){
                commandString += ' ' + commandConf.args.join(' ');
            }

            context.log(chalk.magenta('Running command'), chalk.blue('`'+commandString+'`'));

            var ls = context.spawnCommand(commandConf.command, commandConf.args);

            ls.on('error', function(error){
                context.log(error);
            });

            ls.on('close', function (code) {
                if (code > 0){
                    if (_.isFunction(commandConf.error)){
                        commandConf.error(context, code);
                    }else{
                        context.env.error(chalk.magenta("Error: ") + chalk.red('Command exited with error status '+ chalk.white.bgRed(' '+code+' ')));
                    }

                }
                done();
            });

        }




    };
