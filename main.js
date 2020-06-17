const FS = require("fs");

// Dimensions for GitHub contributions bar.
const BAR = {
    WIDTH: 52,
    HEIGHT: 7
};

const [, , BASELINE, MESSAGE] = process.argv;

if (!(BASELINE && MESSAGE)) {
    console.log();
    console.log("Should be called with two arguments.");
    console.log("  baseline - the highest number of commits in your contributions bar");
    console.log("  message  - the message you want to create");
    console.log("For example: node main.js 30 \"Hello World\"");
    console.log();
    throw Error("Missing command line arguments - see above.");
}

main();

function main() {

    let messageWidth = calculateMessageWidth();
    if (BAR.WIDTH < messageWidth) {
        throw Error("Message is wider than contributions bar");
    }

    let startDate = calculateStartDate(messageWidth);

}

function calculateMessageWidth() {

    let width = 0;

    for (c of MESSAGE) {
        if ('w' === c || 'm' === c) {
            width += 5;
        } else if ('i' === c) {
            width += 1;
        } else {
            width += 3;
        }
    }

    width += MESSAGE.length - 1; // Add spaces between characters

    return width;

}

function calculateStartDate(messageWidth) {

    let startDate = new Date();

    startDate.setHours(12, 0, 0, 0); // set time to 12:00.
    startDate.setDate(startDate.getDate() - startDate.getDay()); // go to last Sunday.
    startDate.setDate(startDate.getDate() - (messageWidth * BAR.HEIGHT)); // Go back [messageWidth] weeks.

    return startDate;

}
