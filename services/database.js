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
        value TEXT
    )`);
    stmt.run();
};

const seedDB = (db) => {
    const settingsSeeds = [
        ["max_alerts", "3"],
        ["automatic_message_status", "disabled"],
        ["automatic_message_text", ""],
        ["automatic_message_repetition_period", "1"],
    ];
    for (let setting of settingsSeeds) {
        try {
            let stmt = db.prepare(
                `INSERT INTO settings (key, value) VALUES (?, ?)`
            );
            stmt.run(setting[0], setting[1]);
        } catch (error) {
            // Field already exists
        }
    }
};

exports.createDBConnection = createDBConnection;
exports.setupDB = setupDB;
