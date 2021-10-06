require('dotenv').config()
const { Task } = require('toad-scheduler')
const { settingsKeys } = require('../constants')
const bot = require('../telegram-bot/bot')
const db = require('../db')

const task = new Task('auto_post_message', () => {
  let stmt = db.prepare('SELECT * FROM settings WHERE key = ?')
  const automaticMessageText = stmt.get(settingsKeys.automatic_message_text).value
  stmt = db.prepare('SELECT * FROM settings WHERE key = ?')
  const automaticImage = stmt.get(settingsKeys.automatic_image_id).value
  if (automaticImage) {
    if (automaticMessageText) bot.sendPhoto(process.env.TELEGRAM_GROUP_ID, automaticImage, { caption: automaticMessageText })
    else bot.sendPhoto(process.env.TELEGRAM_GROUP_ID, automaticImage)
  } else {
    if (automaticMessageText.length > 0) bot.sendMessage(process.env.TELEGRAM_GROUP_ID, automaticMessageText)
  }
})

function getRepetitionPeriod () {
  const stmt = db.prepare('SELECT * FROM settings WHERE key = ?')
  const repetitionPeriod = stmt.get(settingsKeys.automatic_message_repetition_period).value

  const options = {}
  options.hours = repetitionPeriod
  // if (process.env.NODE_ENV === 'production') options.hours = repetitionPeriod
  // else options.minutes = repetitionPeriod
  return options
}

exports.autoPostMessage = task
exports.getRepetitionPeriod = getRepetitionPeriod
