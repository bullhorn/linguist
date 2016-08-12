#!/usr/bin/env node
import program from 'commander';
import { Add } from './cli/Add';
import { Check } from './cli/Check';
import { Update } from './cli/Update';
import { LumberJack } from './utils/LumberJack';
const logger = new LumberJack();

program
    .version('0.0.1');

program
    .command('translate [from] [to]')
    .description('Add new translation file')
    .option('-d, --dest <dest>', 'specify localization resources directory.')
    .action((...args) => {
        let command = new Add();
        command.run(...args);
    });

program
    .command('check [lang]')
    .description('Check for missing translation keys')
    .option('-s, --source <source>', 'specify soure directory.')
    .option('-d, --dest <dest>', 'specify lang directory.')
    .action((...args) => {
        let command = new Check();
        command.run(...args);
    });

program
    .command('update [lang]')
    .description('Updates translation file with missing keys')
    .option('-s, --source <source>', 'specify soure directory.')
    .option('-d, --dest <dest>', 'specify lang directory.')
    .action((...args) => {
        let command = new Update();
        command.run(...args);
    });

program
    .command('*')
    .action(function(env) {
        console.log('huh? "%s" is not a valid command', env);
    });

program.parse(process.argv);
