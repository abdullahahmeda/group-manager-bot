const Database = require("better-sqlite3");

const prohibitedWordsTable = "prohibited_words";
const alertsTable = "alerts";
const settingsTable = "settings";

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
    CREATE TABLE IF NOT EXISTS ${prohibitedWordsTable} (
        word VARCHAR UNIQUE
    )`);
    stmt.run();

    stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS ${alertsTable} (
        telegram_id VARCHAR,
        reason VARCHAR
    )`);
    stmt.run();

    stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS ${settingsTable} (
        key VARCHAR UNIQUE,
        value VARCHAR
    )`);
    stmt.run();
};

const seedDB = (db) => {
    try {
        let stmt = db.prepare(
            `INSERT INTO ${settingsTable} (key, value) VALUES (?, ?)`
        );
        stmt.run("max_alerts", "3");
    } catch (error) {} // Field already exists
};

const insertAlert = (db, senderId, reason) => {
    senderId = "" + senderId;
    let stmt = db.prepare(
        `INSERT INTO ${alertsTable} (telegram_id, reason) VALUES (?, ?)`
    );
    stmt.run(senderId, reason);
};

exports.createDBConnection = createDBConnection;
exports.setupDB = setupDB;
exports.insertAlert = insertAlert;
