const db = require("../db");

/**
 *
 * Returns whether a string contains a telegram URL or not
 *
 * @param {TelegramBot.Message} msg
 * @returns {boolean}
 */
const containsTelegramURL = (msg) => {
    const entities = msg.entities ? msg.entities : [];
    const regex = /([https]+?:\/+)?[a-z0-9]*?\.?(telegram|t)\.me/i;
    for (let entity of entities) {
        if (entity.type === "url") {
            const messageText = msg.text;
            const link = messageText.slice(
                entity.offset,
                entity.offset + entity.length
            );
            if (regex.test(link)) {
                const stmt = db.prepare(
                    `SELECT * FROM accepted_links WHERE link LIKE ?`
                );
                const result = stmt.get(`%${link}%`);
                if (result) return false;
                else return true;
            }
        }
    }
    return false;
};

/**
 *
 * @param {string} s
 * @returns {number}
 */
const containsProhibited = (s) => {
    const stmt = db.prepare(`SELECT * FROM prohibited_words`);
    const words = stmt.all();
    for (let wordObj of words) {
        if (s.indexOf(wordObj.word) > -1) {
            if (wordObj.punishment === "alert") return 1;
            else if (wordObj.punishment === "kick") return 2;
        }
    }
    return 0;
};

/**
 *
 * Returns whether the message contain a mention or not
 *
 * @param {TelegramBot.Message} msg The message object
 * @returns {boolean}
 */
const containsMention = (msg) => {
    const entities = msg.entities ? msg.entities : [];
    for (let entity of entities) {
        if (entity.type.indexOf("mention") > -1) return true;
    }
    return false;
};

exports.containsTelegramURL = containsTelegramURL;
exports.containsProhibited = containsProhibited;
exports.containsMention = containsMention;
