'use strict';

const Mockstar = require('./core');
const pkg = require('../package.json');
const figlet = require('figlet');
const chalk = require('chalk');
const minimist = require('minimist');
const semver = require('semver');

/**
 * Entrance file, parse user input and call a command.
 *
 * @param args
 * @returns {Promise.<T>}
 */
function entry(args) {
    args = minimist(process.argv.slice(2));

    const mockstar = new Mockstar(args);
    const log = mockstar.log;

    function handleError(err) {
        if (err) {
            log.fatal(err);
        }

        process.exit(2);
    }

    /**
     * Print banner
     * Font preview：http://patorjk.com/software/taag/#p=display&f=3D-ASCII&t=mockstar%0A
     *
     */
    function printBanner() {
        figlet.text('MockStar', {
            font: '3D-ASCII',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }, function (err, data) {
            if (err) {
                log.info('Something went wrong...');
                log.error(err);
                return;
            }

            console.log(chalk.cyan(data));
            console.log(chalk.cyan(` MockStar，当前版本v${mockstar.version}, 让数据打桩和自动化测试更简单，主页: https://github.com/mockstarjs/mockstar `));
            console.log(chalk.cyan(' (c) powered by IVWEB Team                                                                            '));
            console.log(chalk.cyan(' Run mockstar --help to see usage.                                                                      '));
        });
    }

    log.debug('process.version', process.version);
    log.debug('pkg.engines.node', pkg.engines.node);

    if (!semver.satisfies(process.version, pkg.engines.node)) {
        return log.error(`运行 mockstar 所需Node.js版本为${pkg.engines.node}，当前版本为${process.version}，请升级到最新版本Node.js(https://nodejs.org/en/).`);
    }

    return mockstar.init().then(function () {
        let cmd = '';

        if (args.v || args.version) {
            console.log(`v${mockstar.version}`);
            return;
        } else if (!args.h && !args.help) {
            cmd = args._.shift();

            if (cmd) {
                let c = mockstar.cmd.get(cmd);
                if (!c) cmd = 'help';
            } else {
                printBanner();
                return;
            }
        } else {
            cmd = 'help';
        }

        return mockstar.call(cmd, args).then(function () {

        }).catch(function (err) {
            console.log(err);
        });
    }).catch(handleError);
}

module.exports = entry;