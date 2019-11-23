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
        let safeParams = [];
        let callback = undefined;
        
        if (params.length > 0) {
            log.debug('_safeParams: params:', params);

            if (params.length == 1) {
                if (params[0] instanceof Function && !functionFound && keepFunction) {
                    callback = params[0];
                } else {
                    safeParams = params[0];
                }
            } else {
                params.each((param: any) => {
                    if (param instanceof Function && !functionFound && keepFunction) {
                        callback = param;
                        functionFound = true;
                    } else {
                        safeParams.push(param);
                    }
                })
            }
        }
        
        return { params: safeParams, callback: callback };
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

        log.debug('Database.run: params:', params);

        return new Promise((resolve, reject) => {
            if (this._db != null && this._isOpen) {
                this._db.run(query, params.params,
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
                this._db.get(query, params.params, (err: Error | null, row: any) => {
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
                this._db.all(query, params.params, (err: Error | null, rows: any[]) => {
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

        return new Promise((resolve, reject) => {
            if (this._db != null && this._isOpen) {
                this._db.each(query, params.params, params.callback, 
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
    exec(query: string) {
        log.debug(`Database.exec("${query}")`);

        return new Promise((resolve, reject) => {
            if (this._db != null && this._isOpen) {
                this._db.exec(query, (err: Error | null) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this);
                    }
                });
            } else {
                reject(new Error(`Database.exec: Database is not open`));
            }
        });
    }

    // Database#prepare(query, [param, ...], [callback])
    prepare(query: string, ...params: any) {
        log.debug(`Database.prepare("${query}", ${params})`);

        params = this._safeParams(params);

        return new Promise((resolve, reject) => {
            if (this._db != null && this._isOpen) {
                let statement = this._db.prepare(query, params.params, (err: Error | null) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(statement);
                    }
                });
            } else {
                reject(new Error(`Database.prepare: Database is not open`));
            }
        });
    }
}