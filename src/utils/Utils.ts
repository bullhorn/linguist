import * as fs from 'fs';
import * as ts from 'typescript';
import { CommandOptions } from './CommandOptions';

export const DEFAULT_OPTIONS: CommandOptions = {
    prefix: 'messages.',
    locale: 'en-US',
    sources: ['./src'],
    dest: './l10n',
    patterns: [
        '/**/*.html',
        '/**/*.ts'
    ],
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
    let resolver;
    let rejecter;
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
