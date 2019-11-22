import { Logger, Database } from '../index';

const log = Logger('test');

let db = new Database();
db.open()
    .then(() => {
        log.hero('db.open: SUCCESS');
        
        db.close()
            .then(() => {
                log.hero('db.close: SUCCESS');

                db.open()
                    .then(() => {
                        log.hero('db.open (reopen): SUCCESS');

                        db.run('CREATE TABLE test_table (test VARCAHR(255))')
                            .then((result: any) => {
                                log.hero('dp.run:', result.sql, ': SUCCESS');
                            })
                            .catch(log.error);
                    })
                    .catch(log.error);
            })
            .catch(log.error);
    })
    .catch(log.error);
