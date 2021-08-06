const { ToadScheduler, SimpleIntervalJob } = require("toad-scheduler");
const task = require("../task");
const db = require("../db");

const scheduler = new ToadScheduler();

let job = null;

const initScheduler = () => {
    let repetition_period = 1; // every 1 hour
    try {
        let stmt = db.prepare(
            `SELECT value from settings WHERE key = 'automatic_message_repetition_period'`
        );
        let rep_p = stmt.get();
        repetition_period = parseInt(rep_p.value);
    } catch (error) {
        //
    }

    job = new SimpleIntervalJob({ minutes: repetition_period }, task);
    scheduler.addSimpleIntervalJob(job);

    let isEnabled = false;
    try {
        let stmt = db.prepare(
            `SELECT value from settings WHERE key = 'automatic_message_status'`
        );
        let status = stmt.get();
        isEnabled = status.value == "enabled";
    } catch (error) {
        //
    }

    if (!isEnabled) job.stop();
};

const setJobPeriod = (period) => {
    stopJob();
    job = new SimpleIntervalJob({ minutes: period }, task);
    scheduler.addSimpleIntervalJob(job);
};

const startJob = () => job.start();
const stopJob = () => job.stop();

const removeJob = () => {
    const jobId = getJob().id;
    scheduler.removeById(jobId);
};

const getJob = () => job;

exports.initScheduler = initScheduler;
exports.setJobPeriod = setJobPeriod;
exports.removeJob = removeJob;
exports.getJob = getJob;
exports.startJob = startJob;
exports.stopJob = stopJob;
