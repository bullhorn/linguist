import log from 'log-update';
import chalk from 'chalk';

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
//	['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

//frames = '▁▂▃▄▅▆▇█▇▆▄▂▁'.split('');


/**
 * name elegantSpinner
 */
function elegantSpinner(pattern = 0) {
    let frames = PATTERNS[pattern], i = 0;
    return () => {
        return frames[i = ++i % frames.length];
    };
}

export class Spinner {
    constructor() {
        this.interval = null;
    }

    start(message, pattern, clear) {
        let frame = elegantSpinner(pattern);
        this.stop(clear);
        this.interval = setInterval(() => {
            log(chalk.cyan(`${frame()} ${message}`));
        }, 50);
    }

    stop(clear) {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            if (clear) {
                log.clear();
            }
        }
    }
}
