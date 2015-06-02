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
            .on('end', done);
    });

    it('runs all mock install steps', function () {

        var allSpawnCommands = _.map(mySpawn.calls, function(spawnConfig){

            return spawnConfig.command + ' '+spawnConfig.args.join(' ');
        });

        assert.ok(_.contains(allSpawnCommands, 'git clone https://github.com/spira/spira.git .'), 'Repo clone command ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:vm up'), 'Boot virtual machine command ran');
        assert.ok(_.contains(allSpawnCommands, 'vagrant plugin install vagrant-docker-compose'), 'Vagrant docker compose plugin installed');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:docker pull'), 'Docker images pulled');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:composer install'), 'PHP composer install ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:composer dmpo'), 'PHP composer dumpautoload ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:db ms'), 'Database migrations ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:npm install'), 'NPM install ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:gulp bower:install'), 'Bower install ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:gulp build'), 'Gulp build ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:docker up'), 'Docker container boot command ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:docker ps'), 'Docker container status ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:docker ps'), 'Docker container status ran');
        assert.ok(_.contains(allSpawnCommands, 'sudo -- sh -c printf \'\n\n# start spira vagrant/docker\n192.168.2.2\tlocal.spira.io\n192.168.2.2\tlocal.api.spira.io\n192.168.2.2\tlocal.app.spira.io\n# end spira vagrant/docker\' >> /etc/hosts'), 'Hosts file writing ran');
        assert.ok(_.contains(allSpawnCommands, 'yo spira:gulp watchlocal'), 'Gulp watch & BrowserSync ran');

    })

});
