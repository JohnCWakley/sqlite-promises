const assert = require('assert')
const { Database, Statement, Logger } = require('../dist/index.js')

const log = Logger('test', true)

var db

before(function () {
    db = new Database('test.db')
})

describe('#Database', function () {
    describe('#Open', function () {
        it('should open without error', async function () {
            await db.open()
            assert(true, db.isOpen())
        })
    })

    describe('#Create', function () {
        it('should create a table named `test`', async function () {
            assert(Statement, typeof await db.run('CREATE TABLE test_table (name VARCHAR(255) DEFAULT NULL)'))
        })

        it('should find the created table', async function () {
            assert({ name: 'test_table' }, await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='test_table'`))
        })
    })

    describe('#Insert', function () {
        it('should insert a row', async function () {
            assert(Statement, typeof await db.run(`INSERT INTO test_table (name) VALUES ('test'), ('john'), ('rob')`))
        })
    })

    describe('#Select', function () {
        it('should query a row where name = `test`', async function () {
            assert('test', (await db.get(`SELECT * FROM test_table WHERE name = 'test'`)).name)
        })

        it('should query multiple rows', async function () {
            let names = await db.all(`SELECT * FROM test_table`).map(it => { return it.name })
            assert(['test', 'john', 'rob'], names)
        })
    })

    describe('#Each', function () {
        it('should run a callback on each row in query', async function () {
            let names = []
            await db.each(`SELECT * FROM test_table`, function (err, row) {
                names.push(row)
            })
            assert(['test', 'john', 'rob'], names)
        })
    })
})













// import { Logger, Database } from '../index';

// const log = Logger('test');

// let db = new Database();
// db.open()
//     .then(() => {
//         log.hero('db.open: SUCCESS');

//         db.close()
//             .then(() => {
//                 log.hero('db.close: SUCCESS');

//                 db.open()
//                     .then(() => {
//                         log.hero('db.open (reopen): SUCCESS');

//                         db.run('CREATE TABLE test_table (test VARCAHR(255))')
//                             .then((result: any) => {
//                                 log.hero('dp.run:', result.sql, ': SUCCESS');
//                             })
//                             .catch(log.error);
//                     })
//                     .catch(log.error);
//             })
//             .catch(log.error);
//     })
//     .catch(log.error);
