const bot = require('../bot')
const db = require('../../db')

function handleForwardedMessage (msg) {
  const chatId = msg.chat.id
  const messageId = msg.message_id
  const forwardUsername = msg?.forward_from?.username || msg?.forward_from_chat?.username

  if (!forwardUsername) return bot.deleteMessage(chatId, messageId)

  const stmt = db.prepare('SELECT * FROM allowed_forwards WHERE username = ?')
  const user = stmt.get(forwardUsername)
  if (!user) bot.deleteMessage(chatId, messageId)
}

module.exports = handleForwardedMessage
