/* global process */
require("dotenv").config();
const { Task } = require("toad-scheduler");
const bot = require("./bot");
const db = require("./db");

const task = new Task("auto_post_message", () => {
    try {
        const stmt = db.prepare(
            `SELECT * FROM settings WHERE key = 'automatic_message_text'`
        );
        const message = stmt.get();
        if (message.value)
            bot.sendMessage(process.env.TELEGRAM_GROUP_ID, message.value);
    } catch (error) {
        //
    }
});

module.exports = task;
