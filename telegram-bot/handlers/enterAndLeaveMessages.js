const bot = require('../bot')
const { settingsKeys } = require('../../constants')
const db = require('../../db')

function handleEnterAndLeaveMessages (msg) {
  const chatId = msg.chat.id
  if (`${chatId}` === `${process.env.TELEGRAM_GROUP_ID}`) {
    const stmt = db.prepare(
      'SELECT * FROM settings WHERE key = ?'
    )
    const result = stmt.get(settingsKeys.delete_enter_and_leave_messages)
    const shouldDelete = result.value === 'enabled'
    if (shouldDelete) {
      bot.deleteMessage(chatId, msg.message_id)
    }
  }
}

module.exports = handleEnterAndLeaveMessages
