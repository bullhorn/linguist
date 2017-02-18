import * as fs from 'fs';
import * as ts from 'typescript';
import { CommandOptions } from './CommandOptions';
import { TRANSLATION, XLIFF } from './Templates';

export const DEFAULT_OPTIONS: CommandOptions = {
    prefix: 'messages.',
    locale: 'en-US',
    sources: ['./src'],
    dest: './l10n',
    patterns: [
        '/**/*.html',
        '/**/*.ts'
    ],
    useFlatKeys: false,
    format: 'json',
    verbose: false,
    replace: false,
    clean: false,
    keys: []
};

// keys: [
//     "{{[^']*[']([^|]+)['][^']*\s*\|\s*translate.*}}",
//     '<[^>]*translate[^>]*>([^<]*)'
// ]

export class Utils {

    static readConfig (options) {
        let rc = Utils.readJSON(`.linguistrc`);
        return Object.assign({}, DEFAULT_OPTIONS, rc, options);
    }

    static readJSON (file: string): any {
        let data: any = {};
        try {
            data = JSON.parse(fs.readFileSync(file, 'utf8'));
        } catch (err) {
            // Do Nothing
        }
        return data;
    }

    static writeJSON (file, data): Promise<any> {
        try {
            let tmp = TRANSLATION(data);
            fs.writeFile(file, tmp, (err) => {
                if (err) {
                    return Promise.reject(err);
                }
                return Promise.resolve(file);
            });
        } catch (err) {
            return Promise.reject(err);
        } finally {
            return Promise.reject('Unknown Error');
        }
    }

    static writeXLIFF (file, source, translated, config): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                let src = Utils.flattenObject(source);
                let tgt = Utils.flattenObject(translated);
                let pkg = Utils.readJSON('./package.json');
                let packet = {
                    from: config.from,
                    to: config.to,
                    name: pkg.name || 'app',
                    timestamp: Date.now(),
                    translations: Object.keys(src).map((key) => {
                        return {
                            key: key,
                            source: src[key],
                            target: tgt[key]
                        };
                    })
                };
                let tmp = XLIFF(packet);
                fs.writeFile(file, tmp, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(translated);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    static series (promises: Array<Promise<any>>, threads: number = 1): Promise<any> {
        let results: Array<any>;
        promises = promises.slice();
        return new Promise((resolve, reject) => {
            /**
             * [next description]
             * @param  {[type]}   result [description]
             * @return {Function}        [description]
             */
            function next (result?: any) {
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

    static sortByKeys (unordered: Array<any>) {
        const ordered: any = {};
        Object.keys(unordered).sort().forEach((key) => {
            let value = unordered[key];
            if (value instanceof Object) {
                value = this.sortByKeys(value);
            }
            ordered[key] = value;
        });
        return ordered;
    }

    static flattenObject (ob: any): any {
        let toReturn: any = {};
        let flatObject: any;
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

    static deepen (o) {
        let oo = {}, t, parts, part;
        for (let k in o) { // eslint-disable-line
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

export interface LazyPromise<T> extends Promise<T> {
    __then (onfulfilled?: ((value: T) => T | PromiseLike<T>) | undefined | null, onrejected?: ((reason: any) => T | PromiseLike<T>) | undefined | null): Promise<T>;
    __then<TResult> (onfulfilled: ((value: T) => T | PromiseLike<T>) | undefined | null, onrejected: (reason: any) => TResult | PromiseLike<TResult>): Promise<T | TResult>;
    __then<TResult> (onfulfilled: (value: T) => TResult | PromiseLike<TResult>, onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<TResult>;
    __then<TResult1, TResult2> (onfulfilled: (value: T) => TResult1 | PromiseLike<TResult1>, onrejected: (reason: any) => TResult2 | PromiseLike<TResult2>): Promise<TResult1 | TResult2>;
}
/**
 * [Lazy description]
 * @param {Function} fn [description]
 */
export function Lazy (fn): LazyPromise<any> {
    let resolver, rejecter;
    const promise: any = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
    });
    promise.__then = promise.then;
    promise.then = function factory (success: Function, failure: Function) {
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
export function sortByField (field: string): Function {
    return function compare (a: any, b: any) {
        return (a[field] < b[field]) ? 1 : (a[field] > b[field]) ? -1 : 0; // eslint-disable-line
    };
}

/**
 * [Plural description]
 * @param  {string} data - string to be pluralized
 * @return {string} Pluralized string using defined rules
 */
export function Plural (data: string): string {
    let rules: Array<any> = [
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
        let rule: Array<any> = rules[len];
        let exp = new RegExp(rule[0]);
        if (exp.test(this)) {
            return data.replace(exp, rule[1]);
        }
    }
    return data;
}

export function printAllChildren (sourceFile: ts.SourceFile, node: ts.Node, depth = 0) {
    console.log(
        new Array(depth + 1).join('----'),
        `[${node.kind}]`,
        syntaxKindToName(node.kind),
        `[pos: ${node.pos}-${node.end}]`,
        ':\t\t\t',
        node.getFullText(sourceFile).trim()
    );

    depth++;
    node.getChildren(sourceFile).forEach(childNode => printAllChildren(sourceFile, childNode, depth));
}

export function syntaxKindToName (kind: ts.SyntaxKind) {
    return ts.SyntaxKind[kind];
}
