import fs from 'fs';

export class Utils {

    static readJSON(file){
        let data = {};
        try {
            data = JSON.parse(fs.readFileSync(file, 'utf8'));
        } catch(err) {
            //Do Nothing
        }
        return data;
    }

    static series(promises, threads=1) {
        let results = null;
        promises = promises.slice();
        return new Promise((resolve, reject) => {
            /**
             * [next description]
             * @param  {[type]}   result [description]
             * @return {Function}        [description]
             */
            function next(result) {
                if (!results) {
                    results = [];
                } else {
                    results = results.concat(result);
                }

                if (promises.length) {
                    let concurrent = promises.splice(0, threads);
                    Promise
                        .all(concurrent)
                        .then(next)
                        .catch(reject);
                } else {
                    resolve(results);
                }
            }

            next();
        });
    }

    static sortByKeys(unordered) {
        const ordered = {};
        Object.keys(unordered).sort().forEach((key) => {
            let value = unordered[key];
            if (value instanceof Object) {
                value = this.sortByKeys(value);
            }
            ordered[key] = value;
        });
        return ordered;
    }

    static flattenObject(ob) {
        let toReturn = {};
        let flatObject;
        for (let i in ob) {
            if (!ob.hasOwnProperty(i)) {
                continue;
            }
            if ((typeof ob[i]) === 'object') {
                flatObject = this.flattenObject(ob[i]);
                for (let x in flatObject) {
                    if (!flatObject.hasOwnProperty(x)) {
                        continue;
                    }
                    toReturn[`${i}.${x}`] = flatObject[x];
                }
            } else {
                toReturn[i] = ob[i];
            }
        }
        return toReturn;
    }

    static deepen(o) {
        let oo = {}, t, parts, part;
        for (let k in o) { //eslint-disable-line
            t = oo;
            parts = k.split('.');
            let key = parts.pop();
            while (parts.length) {
                part = parts.shift();
                t = t[part] = t[part] || {};
            }
            t[key] = o[k];
        }
        return oo;
    }
}

/**
 * [Lazy description]
 * @param {Function} fn [description]
 */
export function Lazy(fn) {
    let resolver, rejecter;
    const promise = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
    });
    promise.__then = promise.then;
    promise.then = function factory(success, failure) {
        setImmediate(() => {
            fn(resolver, rejecter);
        });
        this.__then(success, failure);
    };

    return promise;
}

/**
 * [sortByField description]
 * @param  {[type]} field [description]
 * @return {[type]}       [description]
 */
export function sortByField(field) {
    return function compare(a, b) {
        return (a[field] < b[field]) ? 1 : (a[field] > b[field]) ? -1 : 0; // eslint-disable-line
    };
}

/**
 * [Plural description]
 * @param  {string} data - string to be pluralized
 * @return {string} Pluralized string using defined rules
 */
export function Plural(data) {
    let rules = [
        [/s?$/i, 's'],
        [/([^aeiou]ese)$/i, '$1'],
        [/(ax|test)is$/i, '$1es'],
        [/(alias|[^aou]us|tlas|gas|ris)$/i, '$1es'],
        [/(e[mn]u)s?$/i, '$1s'],
        [/([^l]ias|[aeiou]las|[emjzr]as|[iu]am)$/i, '$1'],
        [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
        [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
        [/(seraph|cherub)(?:im)?$/i, '$1im'],
        [/(her|at|gr)o$/i, '$1oes'],
        [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
        [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, '$1a'],
        [/sis$/i, 'ses'],
        [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
        [/([^aeiouy]|qu)y$/i, '$1ies'],
        [/([^ch][ieo][ln])ey$/i, '$1ies'],
        [/(x|ch|ss|sh|zz)$/i, '$1es'],
        [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
        [/(m|l)(?:ice|ouse)$/i, '$1ice'],
        [/(pe)(?:rson|ople)$/i, '$1ople'],
        [/(child)(?:ren)?$/i, '$1ren'],
        [/eaux$/i, '$0'],
        [/m[ae]n$/i, 'men'],
        ['thou', 'you']
    ];

    let len = rules.length;
    while (len--) {
        let rule = rules[len],
            exp = new RegExp(rule[0]);
        if (exp.test(this)) {
            return data.replace(exp, rule[1]);
        }
    }
    return data;
}
