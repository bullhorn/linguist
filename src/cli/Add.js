import _ from 'lodash';
import mkdirp from 'mkdirp';
import fs from 'fs';
import program from 'commander';
import prompt from 'inquirer';
import { LumberJack } from '../utils/LumberJack';

const logger = new LumberJack();

export class Add {
    run(tutorial, options) {
        logger.clear();
        logger.spin(`loading lesson...`);

        logger.stop();
        //logger.mark(QUESTIONS[0]);
    }
}
