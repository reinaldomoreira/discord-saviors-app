function schedule(frequency, func) {
    const cron = require('node-cron');
    return cron.schedule(frequency, func);
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
