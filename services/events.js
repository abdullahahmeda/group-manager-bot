const EventEmitter = require("events");
const db = require("../db");
const bot = require("../bot");

const myEmitter = new EventEmitter();

myEmitter.on("add_alert_to_member", ({ msg, reason }) => {
    const senderId = msg.from.id + "";
    const chatId = msg.chat.id;

    let stmt = db.prepare(
        `INSERT INTO alerts (telegram_id, reason) VALUES (?, ?)`
    );
    stmt.run(senderId, reason);

    stmt = db.prepare(`SELECT * FROM alerts WHERE telegram_id = ?`);
    const alerts = stmt.all(senderId);

    stmt = db.prepare(`SELECT * FROM settings WHERE key = ?`);
    const maxAllowedAlerts = stmt.get("max_alerts").value;

    if (alerts.length >= maxAllowedAlerts) {
        try {
            bot.kickChatMember(chatId, senderId);
        } catch (error) {
            console.log(`Couldn't kick the member`);
            console.log(error);
        }
    }
});

module.exports = myEmitter;
