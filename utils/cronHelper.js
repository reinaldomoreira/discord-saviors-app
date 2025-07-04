require('cron')
const {CronJob} = require("cron");

function schedule(frequency, func) {
    const job = new CronJob(frequency, func, null, true);
    job.start();
    return job;
}

function everyMinute() {
    return "* * * * *";
}

function everySecond() {
    return "* * * * * *";
}

function everyFifteenSecond() {
    return "*/15 * * * * *";
}

module.exports = {
    everyMinute: everyMinute,
    everySecond: everySecond,
    everyFifteenSecond: everyFifteenSecond,
    schedule: schedule
}
