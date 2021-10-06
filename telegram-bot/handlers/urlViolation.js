const bot = require('../bot')
const { settingsKeys } = require('../../constants')
const db = require('../../db')
const getArReason = require('../../utils/getArReason')

function handleUrlViolation (msg) {
  const chatId = msg.chat.id
  const messageId = msg.message_id
  const senderId = msg.from.id + ''
  const senderName = msg.from.last_name ? `${msg.from.first_name} ${msg.from.last_name}` : msg.from.first_name
  const reason = 'prohibited_word'
  const arReason = getArReason(reason)

  console.log('URL violation, trying to delete the message')
  bot.deleteMessage(chatId, messageId)

  let stmt = db.prepare('SELECT * FROM settings WHERE key = ?')
  const maxAllowedAlerts = parseInt(stmt.get(settingsKeys.max_alerts).value)
  stmt = db.prepare(
    'INSERT INTO alerts (telegram_id, reason) VALUES (?, ?)'
  )
  const { lastInsertRowid } = stmt.run(senderId, reason)
  setTimeout(() => {
    try {
      const stmt = db.prepare('DELETE FROM alerts WHERE id = ?')
      stmt.run(lastInsertRowid)
    } catch (error) {
      console.log('I faced an error', error)
    }
  }, 1000 * 60 * 60 * 24)

  stmt = db.prepare('SELECT * FROM alerts WHERE telegram_id = ?')
  const alerts = stmt.all(senderId)

  if (alerts.length % maxAllowedAlerts === 0) {
    try {
      bot.kickChatMember(chatId, senderId)
    } catch (error) {
      console.log("Couldn't kick the member")
      console.log(error)
    }
    const message = `
    ⛔ إنذار للعضو <strong>${senderName}</strong>
السبب: <strong>${arReason}</strong>
العقوبة: حظر من المجموعة
    `
    bot.sendMessage(chatId, message, { parse_mode: 'html' })
    return
  }

  const punishment = `تحذير (${
        alerts.length % maxAllowedAlerts
    }/${maxAllowedAlerts})`
  const message = `
    ⛔ إنذار للعضو <strong>${senderName}</strong>
السبب: <strong>${arReason}</strong>
العقوبة: ${punishment}
    `
  bot.sendMessage(chatId, message, { parse_mode: 'html' })
}

module.exports = handleUrlViolation
