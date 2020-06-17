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

    FS.mkdirSync("./output/");
    FS.mkdirSync("./output/.git/");

    for (char in MESSAGE) {
        let charWidth = calculateCharacterWidth(char);
        makeCommits(char, startDate, charWidth);
        incrementStartDate(charWidth, startDate);
    }



}

function calculateMessageWidth() {

    let width = 0;

    for (c of MESSAGE) {
        width += calculateCharacterWidth(c);
    }

    width += MESSAGE.length - 1; // Add spaces between characters

    return width;

}

function calculateCharacterWidth(c) {

    if ('w' === c || 'm' === c) {
        return 5;

    } else if ('i' === c) {
        return 1;
    }

    return  3;

}

function calculateStartDate(messageWidth) {

    let startDate = new Date();

    startDate.setHours(12, 0, 0, 0); // set time to 12:00.
    startDate.setDate(startDate.getDate() - startDate.getDay()); // go to last Sunday.
    startDate.setDate(startDate.getDate() - (messageWidth * BAR.HEIGHT)); // Go back [messageWidth] weeks.

    return startDate;

}

function incrementStartDate(characterWidth, startDate) {

    // Add one for the space after the character.
    startDate.setDate(startDate.getDate() + (BAR.HEIGHT * (characterWidth + 1)));

    return startDate;

}

function makeCommits(char, startDate, charWidth) {



}
