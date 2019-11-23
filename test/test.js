const assert = require('assert')
const { Database, Statement, Logger } = require('../dist/index.js')
const { existsSync, unlinkSync } = require('fs')

const TABLE = 'test_table'
const DATABASE = 'test.sqlite'

var db

before(function () {
    if (existsSync(DATABASE)) {
        unlinkSync(DATABASE)
    }

    db = new Database()
})

describe('#Database', function () {
    describe('#Open', function () {
        it('should open without error', async function () {
            await db.open(DATABASE)
            assert(true, db.isOpen())
        })
    })

    describe('#Run', function () {
        it('should create a table', async function () {
            let result = await db.run(`CREATE TABLE IF NOT EXISTS ${TABLE} (name VARCHAR(255) DEFAULT NULL)`)
        })
    })

    describe('#Get', function() {
        it('should find the created table', async function () {
            let result = await db.get(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = $tableName`, { $tableName: TABLE })
            assert.deepEqual({ name: 'test_table' }, result)
        })
    })

    describe('#Insert', function () {
        it('should insert rows', async function () {
            let result = await db.run(`INSERT INTO ${TABLE} (name) VALUES ($name1), ($name2), ($name3)`, { $name1: 'test', $name2: 'john', $name3: 'rob' })
        })
    })

    describe('#All', function () {
        it('should query multiple rows', async function () {
            let result = (await db.all(`SELECT * FROM ${TABLE} WHERE name != 'rob'`)).map(it => { return it.name })
            assert.deepEqual(['test', 'john'], result)
        })
    })

    describe('#Each', function () {
        it('should run a callback on each row in query', async function () {
            let result = []
            await db.each(`SELECT * FROM ${TABLE}`, function (err, row) { result.push(row.name) })
            assert.deepEqual(['test', 'john', 'rob'], result)
        })
    })

    describe('#Exec', function () {
        it('should run all queries', async function () {
            await db.exec(`UPDATE ${TABLE} SET name = 'TEST' WHERE name = 'test'; UPDATE ${TABLE} SET name = 'JOHN' WHERE name = 'john'; UPDATE ${TABLE} SET name = 'ROB' WHERE name = 'rob';`)
            let result = (await db.all(`SELECT * FROM ${TABLE}`)).map(it => { return it.name })
            assert.deepEqual(['TEST', 'JOHN', 'ROB'], result)
        })
    })

    describe('#Prepare', function() {
        it('successfully prepare a statement', async function() {
            let result = await db.prepare(`SELECT * FROM ${TABLE} WHERE name = $name`, { $name: 'test' })
        })
    })
})
