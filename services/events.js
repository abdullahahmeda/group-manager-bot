const EventEmitter = require("events");
const { insertAlert } = require("./database");

const myEmitter = new EventEmitter();

myEmitter.on("add_alert_to_member", ({ senderId, db, reason }) => {
    insertAlert(db, senderId, reason);
});

module.exports = myEmitter;
