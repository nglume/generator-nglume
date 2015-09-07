'use strict';

var mockSpawn = require('mock-spawn');
var mySpawn = mockSpawn();
require('child_process').spawn = mySpawn; //replace spawn command

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var _ = require('lodash');


describe('spira:app', function () {
    before(function (done) {


        var generator = helpers.createGenerator('spira:app', [
            './generators/app'
        ]);

        var installSteps = _.keys(generator._installSteps);

        helpers.run(path.join(__dirname, '../generators/app'))
            .withOptions({/*skipInstall: true*/})
            .withPrompts({
                remoteRepo: 'https://github.com/spira/spira.git',
                steps: installSteps,
                appFolder: '.'
            })
            .on('end', function(){
                setTimeout(function(){
                    done();
                }, 100); //give the fs read some time to run as the helpers function doesn't seem to wait for promises to resolve.
            });
    });

    it('runs all mock install steps', function () {

        var allSpawnCommands = _.map(mySpawn.calls, function(spawnConfig){

            return spawnConfig.command + ' '+spawnConfig.args.join(' ');
        });

        assert.ok(_.contains(allSpawnCommands, 'git clone https://github.com/spira/spira.git .'), 'Repo clone command ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:vm up --no-provision'), 'Boot virtual machine command ran');
        assert.ok(_.contains(allSpawnCommands, 'vagrant plugin install vagrant-docker-compose'), 'Vagrant docker compose plugin installed');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:vm provision'), 'Provision vagrantbox');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:docker pull'), 'Docker images pulled');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:composer install'), 'PHP composer install ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:composer dmpo'), 'PHP composer dumpautoload ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:forum install'), 'Forum install ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:db ms'), 'Database migrations ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:npm install'), 'NPM install ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:gulp bower:install'), 'Bower install ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:gulp build'), 'Gulp build ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:docker up'), 'Docker container boot command ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:docker ps'), 'Docker container status ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:docker ps'), 'Docker container status ran');
        assert.ok(_.find(allSpawnCommands, function(command){
            return /sudo -- sh -c printf[\s\S]*?>> \/etc\/hosts/.test(command);
        }), 'Hosts file writing ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:gulp watchlocal'), 'Gulp watch & BrowserSync ran');

    })

});
