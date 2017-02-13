import _ from 'lodash';
import rc from 'rc';
import fetch from 'node-fetch';
import { Utils, Lazy } from '../utils/Utils';
import { LumberJack } from '../utils/LumberJack';

const logger = new LumberJack();
const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

export class Add {
    run(from, to, options) {
        //logger.clear();
        logger.spin('loading configuration...');
        let config = rc('linguist', Object.assign({
            dest: './l10n',
            useFlatKeys: false,
        }, options));
        logger.spin('initializing...');
        let defaults = Utils.readJSON(`${config.dest}/${from}.json`);
        let vals = Object.keys(Utils.flattenObject(defaults));
        logger.info(`found ${vals.length} keys`);
        let existing = Utils.readJSON(`${config.dest}/${to}.json`);
        let exists = Object.keys(Utils.flattenObject(existing));
        let remaining = _.xor(vals, exists);
        let obj = {};
        let promises = [];
        for (let key of remaining) {
            promises.push(
                new Lazy((resolve, reject) => {
                    this.translate(_.get(defaults, key, '**NO TRANSLATION**'), from.slice(0, 2), to.slice(0, 2))
                        .then(translation => {
                            logger.spin(`translating...${remaining.indexOf(key)} of ${remaining.length}`);
                            obj[key] = translation;
                        })
                        .then(resolve)
                        .catch(reject);
                })
            );
        }
        logger.spin('translating...');
        return Utils.series(promises, 1)
        .then(() => {
            logger.info(`translated ${remaining.length} keys`);
            let file = `${config.dest}/${to}.json`;
            let final = config.useFlatKeys ? obj : Utils.deepen(obj);
            let current = Utils.readJSON(file);
            _.defaultsDeep(current, final);
            current = Utils.sortByKeys(current);

            return Utils.writeJSON(file, current);
        })
        .then((saved) => {
            logger.success(`✔︎ translations added to ${saved}`);
            return saved;
        })
        .catch((err) => {
            logger.error('✗ An error occurred', err);
        });
    }

    translate(phrase, source = 'en', target = 'de') {
        //let uri = `https://www.googleapis.com/language/translate/v2?q=${phrase}&source=${source}&target=${target}`
        let uri = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURI(phrase)}`;
        return fetch(uri)
        .then(response => {
            return response.text();
        })
        .then(result => {
            //logger.info(result);
            try {
                let data = JSON.parse(String(result).replace(/(,+)/gi, ','));
                return data[0][0][0];
            } catch (err) {
                return 'No translation found';
            }
        });
    }

}
