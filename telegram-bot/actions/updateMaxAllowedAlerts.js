const bot = require('../bot')
const db = require('../../db')
const { settingsKeys } = require('../../constants')

function updateMaxAllowedAlerts (msg) {
  const chatId = msg.chat.id
  const messageText = msg.text

  const maxAllowedAlerts = parseInt(messageText)
  if (isNaN(maxAllowedAlerts) || maxAllowedAlerts < 1) {
    bot.sendMessage(chatId, 'يجب أن يتم ادخال رقم أكبر من 1')
  } else {
    try {
      const stmt = db.prepare(
        'UPDATE settings SET value = ? WHERE key = ?'
      )
      stmt.run(maxAllowedAlerts + '', settingsKeys.max_alerts)
      bot.sendMessage(chatId, 'تم التحديث بنجاح')
    } catch (error) {
      console.log(error)
      bot.sendMessage(chatId, 'حدث خطأ ما. يرجى إعادة المحاولة')
    }
  }
}

module.exports = updateMaxAllowedAlerts
