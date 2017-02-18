import * as chalk from 'chalk';
import clear from 'clear';
import mark from './MarkedRenderer';
import { Spinner } from './Spinner';

export class LumberJack {
    private spinner: Spinner = new Spinner();

    log (message: string, ...params) {
        this.stop();
        console.log(message, ...params);
    }

    info (message: string, ...params) {
        this.stop();
        console.log(chalk.cyan(message), ...params);
    }

    warn (message: string, ...params) {
        this.stop();
        console.log(chalk.yellow(message), ...params);
    }

    error (message: string, ...params) {
        this.stop();
        console.log(chalk.red(message), ...params);
    }

    success (message: string, ...params) {
        this.stop();
        console.log(chalk.green(message), ...params);
    }

    spin (message: string) {
        this.stop();
        this.spinner.start(message);
    }

    stop () {
        this.spinner.stop();
    }

    mark (message) {
        this.stop();
        console.log(mark(message));
    }

    clear () {
        return clear();
    }
}

export const Logger: LumberJack = new LumberJack();
