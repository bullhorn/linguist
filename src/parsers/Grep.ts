import * as readLine from 'fs-readline';
import * as glob from 'glob';
import * as Event from 'events';

export interface GrepOptions {
    pattern: RegExp | string;
    files?: string;
    encoding?: string;
    maxResultLength?: number | null;
}

export class Searcher {
    static options: GrepOptions = {
        pattern: 'test',
        encoding: 'utf8',
        maxResultLength: null
    };

    private options: GrepOptions;
    private _event = new Event();

    constructor (options: GrepOptions) {
        this.options = Object.assign({}, Searcher.options, options);
        this._init();
    }

    _init () {
        let options: any = this.options;
        let read = glob(options.files, {
            nodir: true
        });

        let result: Array<any> = [];
        let resultLength: number = 0;

        read.on('match', filepath => {
            let temp: any = {
                path: filepath,
                data: []
            };

            let rl = readLine(filepath, {
                blankLine: false
            });

            resultLength += 1;

            rl.on('line', (line: any, index: number) => {
                line = line.toString(options.encoding);
                let test = this.filter(line);
                if (test) {
                    this._emit('line', filepath, index, line);
                    temp.data.push({ index: index, content: line });
                }
            });

            rl.on('end', () => {
                resultLength -= 1;
                if (temp.data.length) {
                    result.push(temp);
                }

                if (resultLength === 0) {
                    this._emit('end', result);
                }
            });
        });

        read.on('end', () => {
            if (resultLength === 0) {
                this._emit('end', result);
            }
        });
    }

    filter (line) {
        if (typeof this.options.pattern === 'string') {
            return line.indexOf(this.options.pattern) > -1;
        } else {
            return new RegExp(this.options.pattern).test(line);
        }
    }

    on (name, callback) {
        this._event.on(name, callback);
        return this;
    }

    _emit (name, ...args) {
        this._event.emit(name, ...args);
    }
}

/**
 * name Grep
 */
export function Grep (pattern: string | RegExp, files: string) {
    if (pattern === '') {
        throw new Error('pattern is empty');
    }
    if (typeof pattern !== 'string' && !(pattern instanceof RegExp)) {
        throw new Error('pattern is not string and RegExp');
    }
    if (typeof files !== 'string') {
        throw new Error('files is not string');
    }
    return new Searcher({ pattern, files });
}
