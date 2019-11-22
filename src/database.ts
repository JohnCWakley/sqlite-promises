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
    private _db: sqlite3.Database | null = null;
    private _isOpen: boolean = false;

    constructor() { }

    isOpen() {
        return (this._isOpen);
    }

    open(filename: string = ':memory:', mode: number = OPEN_READWRITE | OPEN_CREATE) {
        log.debug(`Database.open("${filename}", ${mode})`);

        return new Promise((resolve, reject) => {
            if (!this._isOpen) {
                this._db = new sqlite3.Database(filename, mode,
                    (err: Error | null) => {
                        if (err) {
                            reject(err);
                        } else {
                            this._isOpen = true;
                            resolve();
                        }
                    });
            } else {
                reject(new Error('Database.open: Database is already open'));
            }
        });
    }

    // Database#close([callback])
    close() {
        log.debug(`Database.close()`);

        return new Promise((resolve, reject) => {
            if (this._db != null) {
                if (this._isOpen) {
                    this._db.close((err: Error | null) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                            this._isOpen = false;
                        }
                    });
                } else {
                    log.warn(`Database.close: Database is not currently open`);
                    resolve();
                }
            } else {
                log.warn(`Database.close: Database was never opened`);
                resolve();
            }
        });
    }

    // Database#configure(option, value)
    configure(option: "busyTimeout", value: number) {
        log.debug(`Database.configure("${option}", ${value})`);

        if (this._db && this._isOpen) {
            this._db.configure(option, value);
        } else {
            log.warn(`Database.configure: Database is not open`);
        }
    }

    // Database#run(sql, [param, ...], [callback])
    run(query: string, ...params: any) {
        log.debug(`Database.run("${query}", ${params})`);

        const safeParams = (typeof params !== undefined && params.length > 0) ? params.map((param: any) => {
            if (typeof param !== 'function') {
                return param;
            }
        }) : undefined;

        return new Promise((resolve, reject) => {
            if (this._db != null && this._isOpen) {
                this._db.run(query, safeParams,
                    function (this: any, err: Error | null) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(this);
                        }
                    });
            } else {
                reject(new Error(`Database.run: Database is not open`));
            }
        });
    }

    // Database#get(sql, [param, ...], [callback])
    get(sql: string, ...params: any) {

    }

    // Database#all(sql, [param, ...], [callback])
    all(sql: string, ...params: any) {

    }

    // Database#each(sql, [param, ...], [callback], [complete])
    each(sql: string, ...params: any) {

    }

    // Database#exec(sql, [callback])
    exec(sql: string, ...params: any) {

    }

    // Database#prepare(sql, [param, ...], [callback])
    prepare(sql: string, ...params: any) {

    }
}