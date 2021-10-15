const bot = require('../bot')
const db = require('../../db')

function handleForwardedMessage (msg) {
  const chatId = msg.chat.id
  const messageId = msg.message_id
  const forwardId = msg?.forward_from?.id || msg?.forward_from_chat?.id

  const stmt = db.prepare('SELECT * FROM allowed_forwards WHERE username = ?')
  const user = stmt.get(`${forwardId}`)
  if (!user) bot.deleteMessage(chatId, messageId)
}

module.exports = handleForwardedMessage
