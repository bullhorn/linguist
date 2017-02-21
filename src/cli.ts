#!/usr/bin/env node
import * as program from 'commander';
import { Translate } from './commands/Translate';
import { Check } from './commands/Check';
import { Update } from './commands/Update';
import { Extract } from './commands/Extract';
import { Convert } from './commands/Convert';
import { LumberJack } from './utils/LumberJack';
const logger = new LumberJack();

program
    .version('0.0.1');

program
    .command('translate [lang]')
    .description('Translate source file to new language')
    .option('-d, --dest <dest>', 'specify localization resources directory.')
    .option('-f, --format <format>', 'specify output format. (json, xliff)')
    .action((...args) => {
        let command: Translate = new Translate();
        command.run(...args);
    });

program
    .command('convert [lang] [to]')
    .description('Convert translations to new format')
    .option('-d, --dest <dest>', 'specify localization resources directory.')
    .option('-f, --format <format>', 'specify output format. (json, namespaced-json, pot, xliff, xliff2)')
    .action((...args) => {
        let command: Convert = new Convert();
        command.run(...args);
    });


program
    .command('check [lang]')
    .description('Check for missing translation keys')
    .option('-s, --sources [sources]', 'specify source directories.')
    .option('-d, --dest <dest>', 'specify output directory.')
    .option('-v, --verbose', 'list all keys found.')
    .action((...args) => {
        let command: Check = new Check();
        command.run(...args);
    });

program
    .command('update [lang]')
    .description('Updates translation file with missing keys')
    .option('-s, --sources [sources]', 'specify source directories.')
    .option('-d, --dest <dest>', 'specify output directory.')
    .action((...args) => {
        let command: Update = new Update();
        command.run(...args);
    });

// const options = cli.parse({
// 	dir: ['d', 'Path you would like to extract strings from', 'dir', process.env.PWD],
// 	output: ['o', 'Path you would like to save extracted strings to', 'dir', process.env.PWD],
// 	format: ['f', 'Output format', ['json', 'namespaced-json', 'pot'], 'json'],
// 	replace: ['r', 'Replace the contents of output file if it exists (Merges by default)', 'boolean', false],
// 	sort: ['s', 'Sort translations in the output file in alphabetical order', 'boolean', false],
// 	clean: ['c', 'Remove obsolete strings when merging', 'boolean', false],
// 	experimental: ['e', 'Use experimental AST Service Parser', 'boolean', false]
// });

program
    .command('extract [lang]')
    .description('Updates translation file with missing keys')
    .option('-s, --sources [sources]', 'specify source directories.')
    .option('-d, --dest <dest>', 'specify lang directory.')
    .option('-f, --format <format>', 'specify output format. (json, namespaced-json, pot, xliff, xliff2)')
    .option('-r, --replace', 'Replace the contents of output file if it exists (Merges by default).')
    .option('-c, --clean', 'Remove obsolete strings when merging.')
    .action((...args) => {
        let command: Extract = new Extract();
        command.run(...args);
    });

program
    .command('*')
    .action(function (env) {
        console.log('huh? "%s" is not a valid command', env);
    });

program.parse(process.argv);
