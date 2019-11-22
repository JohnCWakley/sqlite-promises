import sqlite3, {
    OPEN_READONLY,
    OPEN_READWRITE,
    OPEN_CREATE,
    OPEN_SHAREDCACHE,
    OPEN_PRIVATECACHE,
    OPEN_URI
} from 'sqlite3';

import Logger from './logger';

const log = Logger('Database');

export class Database {
    private db: sqlite3.Database | null = null;

    constructor() { }
    
    open(filename: string = ':memory:', mode: number = OPEN_READWRITE | OPEN_CREATE) {
        log.debug(`Database.open("${filename}", ${mode})`);

        return new Promise((resolve, reject) => {
            if (this.db !== null) {
                reject(new Error('A database has already been opened'));
            } else {
                this.db = new sqlite3.Database(filename, mode, function(err: Error | null) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            }
        })
    }

    // Database#close([callback])
    close(callback?: Function) {

    }

    // Database#configure(option, value)
    configure(option: string, value: any) {

    }

    // Database#run(sql, [param, ...], [callback])
    run(sql: string, ...params: any) {

    }

    // Database#get(sql, [param, ...], [callback])
    get(sql: string, ...params: any) {

    }

    // Database#all(sql, [param, ...], [callback])
    all(sql: string, ...params: any) {

    }

    // Database#each(sql, [param, ...], [callback], [complete])
    each(sql:string, ...params: any) {

    }

    // Database#exec(sql, [callback])
    exec(sql:string, ...params: any) {

    }

    // Database#prepare(sql, [param, ...], [callback])
    prepare(sql: string, ...params: any) {

    }
}