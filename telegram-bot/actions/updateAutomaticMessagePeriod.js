const { SimpleIntervalJob } = require('toad-scheduler')
const bot = require('../bot')
const { settingsKeys } = require('../../constants')
const db = require('../../db')
const scheduler = require('../../scheduler')
const { autoPostMessage, getRepetitionPeriod } = require('../../tasks/autoPostMessage')

function updateAutomaticMessagePeriod (msg) {
  const chatId = msg.chat.id
  const messageText = msg.text

  const period = parseInt(messageText)
  if (isNaN(period) || period > 24 || period < 1) {
    bot.sendMessage(chatId, 'يجب أن يتم ادخال رقم بين 1 و 24')
  } else {
    try {
      const stmt = db.prepare(
        'UPDATE settings SET value = ? WHERE key = ?'
      )
      stmt.run(period, settingsKeys.automatic_message_repetition_period)
      scheduler.removeById('auto_post_message')
      const autoPostMessageJob = new SimpleIntervalJob(getRepetitionPeriod(), autoPostMessage, 'auto_post_message')
      scheduler.addSimpleIntervalJob(autoPostMessageJob)
      bot.sendMessage(chatId, 'تم التحديث بنجاح')
    } catch (error) {
      console.log(error)
      bot.sendMessage(chatId, 'حدث خطأ ما. يرجى إعادة المحاولة')
    }
  }
}

module.exports = updateAutomaticMessagePeriod
