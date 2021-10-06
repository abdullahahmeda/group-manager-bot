const bot = require('../bot')
const { settingsKeys } = require('../../constants')
const db = require('../../db')

function updateRemoveEnterAndLeaveMessages (chatId, status) {
  try {
    const stmt = db.prepare(
      'UPDATE settings SET value = ? WHERE key = ?'
    )
    stmt.run(status, settingsKeys.delete_enter_and_leave_messages)
    bot.sendMessage(chatId, `تم ${status === 'enabled' ? 'تفعيل' : 'إيقاف'} حذف رسائل الدخول والخروج.`)
  } catch (error) {
    console.log(error)
    bot.sendMessage(chatId, 'حدث خطأ ما. يرجى إعادة المحاولة')
  }
}

module.exports = updateRemoveEnterAndLeaveMessages
