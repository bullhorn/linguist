#!/usr/bin/env node
import program from 'commander';
import { Add } from './cli/Add';
import { Check } from './cli/Check';
import { LumberJack } from './utils/LumberJack';
const logger = new LumberJack();

program
    .version('0.0.1');

program
    .command('add [lang]')
    .description('Add new translation file')
    .option('-s, --source <source>', 'specify source directory.')
    .option('-d, --dest <dest>', 'specify lang directory.')
    .action((...args) => {
        command.run(...args);
    });

program
    .command('check [lang]')
    .description('Check translation file')
    .option('-s, --source <source>', 'specify soure directory.')
    .option('-d, --dest <dest>', 'specify lang directory.')
    .action((...args) => {
        let command = new Check();
        command.run(...args);
    });

program
    .command('*')
    .action(function(env) {
        console.log('huh? "%s" is not a valid command', env);
    });

program.parse(process.argv);
