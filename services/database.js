const Database = require("better-sqlite3");

/**
 *
 * Returns a database from the connection
 *
 * @param {string} path
 * @returns {Database.Database} The database
 */
const createDBConnection = (path) => {
    const options = {
        readonly: false,
        fileMustExist: false,
    };

    const db = new Database(path, options);
    return db;
};

const setupDB = (db) => {
    createTables(db);
    seedDB(db);
};

const createTables = (db) => {
    let stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS prohibited_words (
        word VARCHAR UNIQUE
    )`);
    stmt.run();

    stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS alerts (
        telegram_id VARCHAR,
        reason VARCHAR
    )`);
    stmt.run();

    stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR UNIQUE,
        value VARCHAR
    )`);
    stmt.run();
};

const seedDB = (db) => {
    try {
        let stmt = db.prepare(
            `INSERT INTO settings (key, value) VALUES (?, ?)`
        );
        stmt.run("max_alerts", "3");
    } catch (error) {
        /**/
    } // Field already exists
};

exports.createDBConnection = createDBConnection;
exports.setupDB = setupDB;
