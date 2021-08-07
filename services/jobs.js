const { ToadScheduler, SimpleIntervalJob } = require("toad-scheduler");
const task = require("../task");
const db = require("../db");

const scheduler = new ToadScheduler();

let job = null;

const initAutomaticMessageScheduler = () => {
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

    job = new SimpleIntervalJob({ hours: repetition_period }, task);
    addJob(job);

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

const addJob = (job) => {
    scheduler.addSimpleIntervalJob(job);
};

const setJobPeriod = (period) => {
    stopJob();
    job = new SimpleIntervalJob({ hours: period }, task);
    scheduler.addSimpleIntervalJob(job);
};

const startJob = () => job.start();
const stopJob = () => job.stop();

const removeJob = () => {
    const jobId = getJob().id;
    scheduler.removeById(jobId);
};

const getJob = () => job;

exports.initAutomaticMessageScheduler = initAutomaticMessageScheduler;
exports.setJobPeriod = setJobPeriod;
exports.removeJob = removeJob;
exports.addJob = addJob;
exports.getJob = getJob;
exports.startJob = startJob;
exports.stopJob = stopJob;
