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

    private _safeParams(params: any, keepFunction: boolean = false) {
        let functionFound = false;

        return (typeof params !== undefined && params.length > 0) ? params.map((param: any) => {
            if (
                (!keepFunction && typeof param !== 'function') ||
                (keepFunction && !functionFound && typeof param === 'function')
            ) {
                if (typeof param === 'function') {
                    functionFound = true;
                }

                return param;
            }
        }) : undefined;
    }

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
                    reject(new Error(`Database.close: Database is not currently open`));
                }
            } else {
                reject(new Error(`Database.close: Database was never opened`));
            }
        });
    }

    // Database#configure(option, value)
    configure(option: "busyTimeout", value: number) {
        return new Promise((resolve, reject) => {
            log.debug(`Database.configure("${option}", ${value})`);

            if (this._db && this._isOpen) {
                this._db.configure(option, value);
                resolve();
            } else {
                reject(new Error(`Database.configure: Database is not open`));
            }
        })
    }

    // Database#run(query, [param, ...], [callback])
    run(query: string, ...params: any) {
        log.debug(`Database.run("${query}", ${params})`);

        params = this._safeParams(params);

        return new Promise((resolve, reject) => {
            if (this._db != null && this._isOpen) {
                this._db.run(query, params,
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

    // Database#get(query, [param, ...], [callback])
    get(query: string, ...params: any) {
        log.debug(`Database.get("${query}", ${params})`);

        params = this._safeParams(params);

        return new Promise((resolve, reject) => {
            if (this._db != null && this._isOpen) {
                this._db.get(query, params, (err: Error | null, row: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            } else {
                reject(new Error(`Database.get: Database is not open`));
            }
        });
    }

    // Database#all(query, [param, ...], [callback])
    all(query: string, ...params: any) {
        log.debug(`Database.all("${query}", ${params})`);

        params = this._safeParams(params);

        return new Promise((resolve, reject) => {
            if (this._db != null && this._isOpen) {
                this._db.all(query, params, (err: Error | null, rows: any[]) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            } else {
                reject(new Error(`Database.get: Database is not open`));
            }
        });
    }

    // Database#each(query, [param, ...], [callback], [complete])
    each(query: string, ...params: any) {
        log.debug(`Database.each("${query}", ${params})`);

        params = this._safeParams(params, true);

        const rowFunction = params.find((param: any) => (typeof param === 'function')) ? params.pop() : undefined;

        return new Promise((resolve, reject) => {
            if (this._db != null && this._isOpen) {
                this._db.each(query, params, rowFunction, 
                    (err: Error | null, row: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            } else {
                reject(new Error(`Database.get: Database is not open`));
            }
        });
    }

    // Database#exec(query, [callback])
    exec(query: string, ...params: any) {

    }

    // Database#prepare(query, [param, ...], [callback])
    prepare(query: string, ...params: any) {

    }
}