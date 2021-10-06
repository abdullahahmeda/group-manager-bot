const bot = require('../bot')
const getArReason = require('../../utils/getArReason')

function handleProhibitedWord (msg) {
  const chatId = msg.chat.id
  const messageId = msg.message_id
  const senderId = msg.from.id + ''
  const senderName = msg.from.last_name ? `${msg.from.first_name} ${msg.from.last_name}` : msg.from.first_name
  const reason = 'prohibited_word'
  const arReason = getArReason(reason)

  bot.deleteMessage(chatId, messageId)

  try {
    bot.restrictChatMember(chatId, senderId, {
      can_send_messages: false,
      until_date: (new Date().getTime() / 1000) + 24 * 60 * 60
    })
  } catch (error) {
    console.log("Couldn't restrict member, probably it is not a supergroup.")
    console.log(error)
  }

  const message = `
  ⛔ إنذار للعضو <strong>${senderName}</strong>
السبب: <strong>${arReason}</strong>
العقوبة: تقييد من المجموعة
`
  bot.sendMessage(chatId, message, { parse_mode: 'html' })
}

module.exports = handleProhibitedWord
