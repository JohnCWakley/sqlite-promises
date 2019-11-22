import { name, version } from './package.json';

import sqlite3, {
    OPEN_READONLY,
    OPEN_READWRITE,
    OPEN_CREATE,
    OPEN_SHAREDCACHE,
    OPEN_PRIVATECACHE,
    OPEN_URI
} from 'sqlite3';

import { Database } from './src/database';
import { Statement } from './src/statement';

import Logger from './src/logger';

export {
    sqlite3,
    Logger,
    Database,
    Statement,
    OPEN_READONLY,
    OPEN_READWRITE,
    OPEN_CREATE,
    OPEN_SHAREDCACHE,
    OPEN_PRIVATECACHE,
    OPEN_URI
};

Logger(name).info(`version: ${version}`);
