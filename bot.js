/* global process */
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { createDBConnection, setupDB } = require("./services/database");
const {
    onURLViolation,
    onProhibitedViolation,
    onMentionViolation,
} = require("./services/violations");
const {
    containsTelegramURL,
    containsProhibited,
    containsMention,
} = require("./utils/checker");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

const DB_PATH = process.env.DB_PATH || "database.db";

let db;
try {
    db = createDBConnection(DB_PATH);
    setupDB(db);
} catch (error) {
    console.log("ERROR: couldn't initialize the database");
    console.log(error);
    process.exit(1);
}

console.log("Bot has started");
bot.on("text", (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    if (chatId == process.env.TELEGRAM_GROUP_ID) {
        if (containsTelegramURL(messageText)) onURLViolation(bot, msg, db);
        else if (containsProhibited(messageText))
            onProhibitedViolation(bot, msg, db);
        else if (containsMention(msg)) onMentionViolation(bot, msg, db);
    }
});

bot.on("polling_error", (err) => console.log(err));
