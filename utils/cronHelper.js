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
    everyFifteenSecond: everyFifteenSecond
}
