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
const CHARACTERS = JSON.parse(FS.readFileSync("./characters.json", "utf8"));

main();

async function main() {

    GIT.init(() => {});

    let messageWidth = calculateMessageWidth();
    if (BAR.WIDTH < messageWidth) {
        throw Error("Message is wider than contributions bar");
    }

    let startDate = calculateStartDate(messageWidth);

    for (char of MESSAGE) {
        let charWidth = calculateCharacterWidth(char);
        await makeCommits(char, startDate, charWidth);
        incrementStartDate(charWidth, startDate);
        console.log("Completed:", char);
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

async function makeCommits(char, startDate, charWidth) {
    return new Promise(async (resolve, reject) => {

        let currentDate = new Date(startDate);
        let totalDays = BAR.HEIGHT * charWidth;

        let filenames = [];

        for (let day = 0; day < totalDays; day++) {

            if (CHARACTERS[char].includes(day)) {
                for (let i = 0; i < BASELINE; i++) {

                    let filename = Math.floor(1000000 * Math.random()).toString();
                    FS.writeFileSync("./output/" + filename,
                        Math.random().toString());

                    await GIT.add("./*");
                    await GIT.commit("", filenames, {
                        "--allow-empty-message": true,
                        "--date": Math.round(currentDate.getTime() / 1000).toString()
                    });

                    FS.unlinkSync("./output/" + filename);
                }
            }

            currentDate.setDate(currentDate.getDate() + 1); // increment

        }

        resolve();

    });
}
