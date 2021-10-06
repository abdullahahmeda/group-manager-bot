const bot = require('../bot')
const { settingsKeys } = require('../../constants')
const db = require('../../db')
const scheduler = require('../../scheduler')

function disableAutomaticMessage (chatId) {
  try {
    const stmt = db.prepare(
      'UPDATE settings SET value = ? WHERE key = ?'
    )
    stmt.run('disabled', settingsKeys.automatic_message_status)
    scheduler.stopById('auto_post_message')
    bot.sendMessage(chatId, 'تم إيقاف الرسالة التلقائية')
  } catch (error) {
    console.log(error)
    bot.sendMessage(chatId, 'حدث خطأ ما. يرجى إعادة المحاولة')
  }
}

module.exports = disableAutomaticMessage
