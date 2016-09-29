import readLine from 'fs-readline';
import glob from 'glob';
import Event from 'events';

class Searcher {

    static get options() {
        return {
            encoding: 'utf8',
            maxResultLength: null
        };
    }

    constructor(options) {
        this.options = Object.assign(Searcher.options, options);
        this._event = new Event();

        this._init();
    }

    _init() {
        let options = this.options;
        let read = glob(options.files, {
            nodir: true
        });

        let result = [];

        let resultLength = 0;

        let filter;

        if (typeof options.pattern === 'string') {
            filter = line => line.indexOf(options.pattern) > -1;
        } else {
            filter = line => options.pattern.test(line);
        }

        // 监听匹配事件
        read.on('match', filepath => {
            let temp = {
                path: filepath,
                data: []
            };

            let rl = readLine(filepath, {
                blankLine: false
            });

            resultLength += 1;

            rl.on('line', (line, index) => {
                line = line.toString(options.encoding);
                if (filter(line)) {
                    this._emit('line', filepath, index, line);

                    temp.data.push({
                        index,
                        content: line
                    });
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

    on(name, callback) {
        this._event.on(name, callback);
        return this;
    }

    _emit(name, ...args) {
        this._event.emit(name, ...args);
    }
}

/**
 * name Grep
 */
export function Grep(pattern, files) {
    if (pattern === '') {
        throw new Error('pattern is empty');
    }

    if (typeof pattern !== 'string' && !(pattern instanceof RegExp)) {
        throw new Error('pattern is not string and RegExp');
    }

    if (typeof files !== 'string') {
        throw new Error('files is not string');
    }

    return new Searcher({
        pattern,
        files
    });
}
