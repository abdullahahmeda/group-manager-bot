const Database = require('better-sqlite3')
require('dotenv').config()

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
    fileMustExist: false
  }

  const db = new Database(path, options)
  return db
}

const db = createDBConnection('database.db')

module.exports = db
