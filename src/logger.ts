import { inspect } from 'util';
import { gray, green, white, yellow, red } from 'chalk';
import chalk = require('chalk');

export function Logger(scope?: string, debug: boolean = false) {
    function _log(color: Function, args: any[]) {
        args = args.map(arg => {
            return (typeof arg === 'string') ? arg : inspect(arg);
        });

        args.unshift(':');
        args.unshift(scope);
        args.unshift((new Date()).toISOString());
        
        console.log(color(args.join(' ')));
    }

    if (debug) {
        console.log(chalk.gray((new Date()).toISOString(), 'Logger : showing debug logs'));
    }

    return {
        debug: (...args: any) => { if (debug) _log(gray, args); },
        hero: (...args: any) => _log(green, args),
        info: (...args: any) => _log(white, args),
        warn: (...args: any) => _log(yellow, args),
        error: (...args: any) => _log(red, args)
    };
}