const bot = require('../bot')
const { settingsKeys } = require('../../constants')
const db = require('../../db')
const scheduler = require('../../scheduler')

function enableAutomaticMessage (chatId) {
  try {
    const stmt = db.prepare(
      'UPDATE settings SET value = ? WHERE key = ?'
    )
    stmt.run('enabled', settingsKeys.automatic_message_status)
    scheduler.startById('auto_post_message')
    bot.sendMessage(chatId, 'تم تفعيل الرسالة التلقائية')
  } catch (error) {
    console.log(error)
    bot.sendMessage(chatId, 'حدث خطأ ما. يرجى إعادة المحاولة')
  }
}

module.exports = enableAutomaticMessage
