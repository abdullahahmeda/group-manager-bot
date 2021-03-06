const db = require('../db')
const jsonfile = require('jsonfile')
const { paths } = require('../constants')
const bot = require('../telegram-bot/bot')

/**
 *
 * Returns whether a string contains a telegram URL or not
 *
 * @param {TelegramBot.Message} msg
 * @returns {boolean}
 */
const containsTelegramURL = (msg) => {
  const entities = msg.entities ? msg.entities : []
  const regex = /(telegram|t)\.me\/[a-z0-9_]+/i
  for (const entity of entities) {
    if (entity.type === 'url') {
      const messageText = msg.text
      let link = messageText.slice(
        entity.offset,
        entity.offset + entity.length
      )
      link = link.match(regex)
      if (link === null) continue
      link = link[0]
      const stmt = db.prepare(
        'SELECT * FROM accepted_links WHERE link LIKE ?'
      )
      const result = stmt.get(`%${link}%`)
      if (result) return false
      else return true
    }
  }
  return false
}

/**
 *
 * @param {string} s
 * @returns {number}
 */
const containsProhibited = (s) => {
  if (typeof s !== 'string') return 0
  const stmt = db.prepare('SELECT * FROM prohibited_words')
  const words = stmt.all()
  for (const wordObj of words) {
    if (s.indexOf(wordObj.word) > -1) {
      if (wordObj.punishment === 'alert') return 1
      else if (wordObj.punishment === 'kick') return 2
    }
  }
  return 0
}

const containsAutomaticReply = (msg) => {
  const messageText = msg.text

  return jsonfile.readFile(paths.automaticReplies)
    .then(replies => {
      for (const [index, reply] of replies.entries()) {
        const repliesContains = reply.contains.split('.')
        for (const replyContain of repliesContains) {
          if (messageText && replyContain && containsWords(messageText, replyContain)) return index
        }
      }
      return null
    })
}

/**
 *
 * Returns whether the message contain a mention or not
 *
 * @param {TelegramBot.Message} msg The message object
 * @returns {boolean}
 */
const containsMention = (msg) => {
  const entities = msg.entities ? msg.entities : []
  for (const entity of entities) {
    if (entity.type.indexOf('mention') > -1) return true
  }
  return false
}

const containsMentionReply = async (msg) => {
  const messageText = msg.text
  const username = (await bot.getMe()).username
  if ((messageText && messageText.indexOf(`@${username}`) === -1) && !msg.reply_to_message) return null
  if (msg.reply_to_message && msg.reply_to_message.from?.username !== username) return null
  return jsonfile.readFile(paths.mentionReplies)
    .then(replies => {
      for (const [index, reply] of replies.entries()) {
        const repliesContains = reply.contains.split('.')
        for (const replyContain of repliesContains) {
          if (messageText && replyContain && containsWords(messageText, replyContain)) return index
        }
      }
      return null
    })
}

const containsWords = (string, w) => {
  const words = string.split(/[\s,\?\,\.!]+/)
  w = w.split(' ')
  let j = 0
  for (let i = 0; i < words.length; i++) {
    if (words[i] === w[j]) {
      if (j === w.length - 1) return true
      if (i === words.length - 1) return false
      j++
    } else {
      j = 0
      if (words[i] === w[j]) {
        if (j === w.length - 1) return true
        if (i === words.length - 1) return false
        j++
      }
    }
  }
  return false
}

exports.containsTelegramURL = containsTelegramURL
exports.containsProhibited = containsProhibited
exports.containsMention = containsMention
exports.containsAutomaticReply = containsAutomaticReply
exports.containsMentionReply = containsMentionReply
