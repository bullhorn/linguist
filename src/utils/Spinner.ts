import * as log from 'log-update';
import * as chalk from 'chalk';

const PATTERNS = [
    '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏',
    '⠋⠙⠚⠞⠖⠦⠴⠲⠳⠓',
    '⠄⠆⠇⠋⠙⠸⠰⠠⠰⠸⠙⠋⠇⠆',
    '⠋⠙⠚⠒⠂⠂⠒⠲⠴⠦⠖⠒⠐⠐⠒⠓⠋',
    '⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠴⠲⠒⠂⠂⠒⠚⠙⠉⠁',
    '⠈⠉⠋⠓⠒⠐⠐⠒⠖⠦⠤⠠⠠⠤⠦⠖⠒⠐⠐⠒⠓⠋⠉⠈',
    '⠁⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠠⠠⠤⠦⠖⠒⠐⠐⠒⠓⠋⠉⠈⠈',
    '|/-\\',
    '◴◷◶◵',
    '◰◳◲◱',
    '◐◓◑◒',
    '▉▊▋▌▍▎▏▎▍▌▋▊▉',
    '▌▄▐▀',
    '╫╪',
    '■□▪▫',
    '←↑→↓',
    '0123456789'
    // 'basic'	: '|/—\\',
    // 'circle-light' 	: ['◜ ',' ◝',' ◞','◟ '],
    // 'circle-cross' 	: '⊕⊗',
    // 'circle'		: '◐◓◑◒',
    //
    // 'square-light'	: ['⌜ ',' ⌝',' ⌟','⌞ '],
    // 'square-corner' : '◢◣◤◥',
    // 'square-line' 	: '▤▧▥▨',
    //
    // 'bar-v'	: '▁▂▃▄▅▆▇█▇▆▄▂▁',
    // 'bar-h'	: '▏▎▍▌▋▋▊▋▌▍▎▏',
    //
    // 'triangle-bold' : '▲▶▼◀',
    //
    // 'arrow-barrel': '➮➱➯➭➫━',
    // 'warning' : '░▒▓▓▒'
];

// let frames = process.platform === 'win32' ?
//    ['-', '\\', '|', '/'] :
// 	['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

// frames = '▁▂▃▄▅▆▇█▇▆▄▂▁'.split('');

/**
 * name elegantSpinner
 */
function elegantSpinner (pattern: number = 0) {
    let frames: string = PATTERNS[pattern];
    let i = 0;
    return () => {
        return frames[i = ++i % frames.length];
    };
}

export class Spinner {
    private interval: NodeJS.Timer;

    start (message: string, pattern: number = 0, clear: boolean = false) {
        let frame = elegantSpinner(pattern);
        this.stop(clear);
        this.interval = setInterval(() => {
            log(chalk.cyan(`${frame()} ${message}`));
        }, 50);
    }

    stop (clear: boolean = false) {
        if (this.interval) {
            clearInterval(this.interval);
            if (clear) {
                log.clear();
            }
        }
    }
}
