const bot = require('../bot')
const getArReason = require('../../utils/getArReason')

function handleExtraProhibitedWord (msg) {
  const chatId = msg.chat.id
  const messageId = msg.message_id
  const senderId = msg.from.id + ''
  const senderName = msg.from.last_name ? `${msg.from.first_name} ${msg.from.last_name}` : msg.from.first_name
  const reason = 'prohibited_word'
  const arReason = getArReason(reason)

  bot.deleteMessage(chatId, messageId)

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
}

module.exports = handleExtraProhibitedWord
