const setupDB = (db) => {
  createTables(db)
  seedDB(db)
}

const createTables = (db) => {
  let stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS prohibited_words (
        word VARCHAR UNIQUE,
        punishment VARCHAR DEFAULT 'alert'
    )`)
  stmt.run()

  stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telegram_id VARCHAR,
        reason VARCHAR
    )`)
  stmt.run()

  stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS accepted_links (
        link VARCHAR
    )`)
  stmt.run()

  stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR UNIQUE,
        value TEXT
    )`)
  stmt.run()

  stmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS allowed_forwards (
        username VARCHAR PRIMARY KEY
    )`)
  stmt.run()
}

const seedDB = (db) => {
  const settingsSeeds = [
    ['max_alerts', '3'],
    ['automatic_message_status', 'disabled'],
    ['automatic_message_text', ''],
    ['automatic_image_id', ''],
    ['automatic_message_repetition_period', '1'],
    ['delete_enter_and_leave_messages', 'disabled']
  ]
  for (const setting of settingsSeeds) {
    try {
      const stmt = db.prepare(
        'INSERT INTO settings (key, value) VALUES (?, ?)'
      )
      stmt.run(setting[0], setting[1])
    } catch (error) {
      // Field already exists
    }
  }
}

module.exports = setupDB
