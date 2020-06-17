const FS = require("fs");

// Dimensions for GitHub contributions bar.
const BAR = {
    WIDTH: 52,
    HEIGHT: 7
};

const MESSAGE = process.argv[2];
if (undefined === MESSAGE) {
    throw Error("Message must be defined - node main.js \"Message\"");
}

main();

function main() {

    let messageWidth = calculateMessageWidth();
    if (BAR.WIDTH < messageWidth) {
        throw Error("Message is wider than contributions bar");
    }

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
