import { inspect } from 'util';
import { gray, green, white, yellow, red } from 'chalk';
import chalk = require('chalk');

export function Logger(scope?: string, initialVerbose: boolean = false) {
    let verbose = initialVerbose;

    function _log(color: Function, args: any[]) {
        args = args.map(arg => {
            return (typeof arg === 'string') ? arg : inspect(arg);
        });

        args.unshift(':');
        args.unshift(scope);
        args.unshift((new Date()).toISOString());
        
        console.log(color(args.join(' ')));
    }
    
    const methods = {
        debug: (...args: any) => { if (verbose) _log(gray, args); },
        hero: (...args: any) => _log(green, args),
        info: (...args: any) => _log(white, args),
        warn: (...args: any) => _log(yellow, args),
        error: (...args: any) => _log(red, args),
        verbose: (_verbose: boolean = true) => {
            if (_verbose) {
                verbose = _verbose;
                methods.debug('Logger: verbose: true');
            } else {
                methods.debug('Logger: verbose: false');
                verbose = _verbose;
            }
        }
    };

    if (verbose) {
        methods.debug('Logger: verbose: true');
    }

    return methods;
}