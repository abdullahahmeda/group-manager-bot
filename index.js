/* global process */
require("dotenv").config();
const { setupDB } = require("./services/database");
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

const bot = require("./bot");
const db = require("./db");
const myEmitter = require("./services/events");
const { initAutomaticMessageScheduler } = require("./services/jobs");

try {
    setupDB(db);
} catch (error) {
    console.log("ERROR: couldn't initialize the database");
    console.log(error);
    process.exit(1);
}

initAutomaticMessageScheduler();

console.log("Bot has started");
bot.on("text", (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    if (chatId == process.env.TELEGRAM_GROUP_ID) {
        const prohibitedPriority = containsProhibited(messageText);
        if (containsTelegramURL(msg)) onURLViolation(msg);
        else if (prohibitedPriority)
            onProhibitedViolation(msg, prohibitedPriority);
        //else if (containsMention(msg)) onMentionViolation(msg);
    } else if (chatId == process.env.TELEGRAM_ADMIN_ID) {
        myEmitter.emit("admin_message", { msg });
    }
});

process.on("exit", () => db.close());

bot.on("polling_error", (err) => console.log(err));
