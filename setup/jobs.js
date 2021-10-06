const { SimpleIntervalJob } = require('toad-scheduler')
const { settingsKeys } = require('../constants')
const db = require('../db')
const { autoPostMessage, getRepetitionPeriod } = require('../tasks/autoPostMessage')

function setupJobs (scheduler) {
  const autoPostMessageJob = new SimpleIntervalJob(getRepetitionPeriod(), autoPostMessage, 'auto_post_message')
  scheduler.addSimpleIntervalJob(autoPostMessageJob)
  const stmt = db.prepare(
    'SELECT * FROM settings WHERE key = ?'
  )
  const status = stmt.get(settingsKeys.automatic_message_status).value
  if (status === 'disabled') scheduler.stopById('auto_post_message')
}

module.exports = setupJobs
