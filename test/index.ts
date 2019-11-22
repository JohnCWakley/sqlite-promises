import { Logger, Database } from '../index';

const log = Logger('test');

let db = new Database();
db.open()
    .then(() => {
        log.info('db.open: SUCCESS');
        
        
    })
    .catch(log.error);
