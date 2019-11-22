import { inspect } from 'util';
import { gray, green, white, yellow, red } from 'chalk';

const DEBUG = ((process.env.NODE_ENV || 'production').toLowerCase() !== 'production');

export default function Logger(scope?: string, debug: boolean = false) {
    function _log(color: Function, args: any[]) {
        args = args.map(arg => {
            return (typeof arg === 'string') ? arg : inspect(arg);
        });

        args.unshift(':');
        args.unshift(scope);
        args.unshift((new Date()).toISOString());
        
        console.log(color(args.join(' ')));
    }

    return {
        debug: (...args: any) => {
            if (DEBUG || debug) { _log(gray, args); }
        },
        hero: (...args: any) => _log(green, args),
        info: (...args: any) => _log(white, args),
        warn: (...args: any) => _log(yellow, args),
        error: (...args: any) => _log(red, args)
    };
}