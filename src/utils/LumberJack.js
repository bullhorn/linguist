import chalk from 'chalk';
import clear from 'clear';
import mark from './MarkedRenderer';
import { Spinner } from './Spinner';

export class LumberJack {
    constructor() {
        this.spinner = new Spinner();
    }

    log(message, ...params) {
        this.stop();
        console.log(message, ...params);
    }

    info(message, ...params) {
        this.stop();
        console.log(chalk.cyan(message), ...params);
    }

    warn(message, ...params) {
        this.stop();
        console.log(chalk.yellow(message), ...params);
    }

    error(message, ...params) {
        this.stop();
        console.log(chalk.red(message), ...params);
    }

    success(message, ...params) {
        this.stop();
        console.log(chalk.green(message), ...params);
    }

    spin(message) {
        this.stop();
        this.spinner.start(message);
    }

    stop() {
        this.spinner.stop();
    }

    mark(message) {
        this.stop();
        console.log(mark(message));
    }

    clear() {
        return clear();
    }
}
