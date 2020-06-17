const FS = require("fs");

const OUTPUT = "./output/";
FS.mkdirSync(OUTPUT);
const GIT = (require("simple-git"))(OUTPUT);

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

/*
    Representation of which 'pixels' are on for each character.
    Reference Map:

    0  7 14
    1  8 15
    2  9 16
    3 10 17
    4 11 18
    5 12 19
    6 13 20

*/
const CHARACTERS = {
    a: [1,2,3,4,5, 8,10, 15,16,17,18,19],
    b: [1,2,3,4,5, 8,10,12, 16,18],
    c: [2,3,4, 8,12, 15,19]
};

main();

function main() {

    GIT.init(() => {});

    let messageWidth = calculateMessageWidth();
    if (BAR.WIDTH < messageWidth) {
        throw Error("Message is wider than contributions bar");
    }

    let startDate = calculateStartDate(messageWidth);

    for (char of MESSAGE) {
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

    let currentDate = new Date(startDate);
    let totalDays = BAR.HEIGHT * charWidth;

    for (let day = 0; day < totalDays; day++) {

        if (CHARACTERS[char].includes(day)) {
            for (let i = 0; i < BASELINE; i++) {

            }
        }

        currentDate.setDate(currentDate.getDate() + 1); // increment

    }

}
