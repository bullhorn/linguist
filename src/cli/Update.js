import _ from 'lodash';
import fs from 'fs';
import rc from 'rc';
import { Utils } from '../utils/Utils';
import { LumberJack } from '../utils/LumberJack';
import { Grep } from '../utils/Grep';
import { TRANSLATION } from './Templates';

const logger = new LumberJack();
const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

export class Update {
    run(lang, options) {
        //logger.clear();
        logger.spin('loading config...');
        let config = rc('linguist', Object.assign({
            source: './src/**/*',
            dest: './l10n',
            keys: [
                "{{[^']*[']([^|]+)['][^']*\s*\|\s*translate.*}}",
                '<[^>]*translate[^>]*>([^<]*)'
            ]
        }, options));
        logger.spin('checking files');
        let promises = [];
        for (let keys of config.keys) {
            promises.push(this.find(new RegExp(keys, 'gi'), config.source));
        }
        Promise
            .all(promises)
            .then((data) => {
                logger.spin('files checked.');
                let vals = _.uniq(flatten(data)).sort();
                logger.info(`found ${vals.length} keys`);
                let defaults = Utils.readJSON(`${config.dest}/${lang}.json`);
                let missing = {};
                for (let key of vals) {
                    if (!_.has(defaults, key)) {
                        missing[key] = '**NO TRANSLATION**';
                    }
                }
                logger.info(`missing ${Object.keys(missing).length} keys`);
                return missing;
            })
            .then((missing) => {
                let file = `${config.dest}/${lang}.json`;
                let final = Utils.deepen(missing);
                let current = Utils.readJSON(file);
                _.defaultsDeep(current, final);
                let tmp = TRANSLATION(Utils.sortByKeys(current));
                fs.writeFile(file, tmp, (err) => {
                    if (err) {
                        throw err;
                    }
                    logger.success(`✔︎ file written to ${file}`);
                });
            })
            .catch((err) => {
                logger.info('broke', err);
            });
    }

    find(expression, source) {
        return new Promise((resolve) => {
            let read = Grep(expression, source);
            read.on('end', (result) => {
                let keys = [];
                for (let file of result) {
                    for (let line of file.data) {
                        let match;
                        while ((match = expression.exec(line.content)) !== null) { //eslint-disable-line
                            if (match.index === expression.lastIndex) {
                                expression.lastIndex++;
                            }
                            if (match[1]) {
                                keys.push(match[1]);
                            }
                        }
                    }
                }
                resolve(keys);
            });
        });
    }
}
