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

export class Statement extends sqlite3.Statement {
    constructor(...args:any) {
        super();
    }

    // Statement#bind([param, ...], [callback])
    // Statement#reset([callback])
    // Statement#finalize([callback])
    // Statement#run([param, ...], [callback])
    // Statement#get([param, ...], [callback])
    // Statement#all([param, ...], [callback])
    // Statement#each([param, ...], [callback], [complete])
}