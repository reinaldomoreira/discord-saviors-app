require('cron')
const {CronJob} = require("cron");

function schedule(frequency, func) {
    return new CronJob(frequency, func, null, true);
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
