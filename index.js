#!/usr/bin/env node

var fs = require('fs');

const wordsListDir = '/usr/share/dict/words';
const words = fs.readFileSync(wordsListDir, 'utf8').split("\n");

const allLetters = process.argv[2];
const requiredLetter = allLetters[0];
const otherLetters = allLetters.slice(1);

// Get all possible matching words
const matches = words.filter(word => {
    // Must be at least 4 letters long
    if (word.length <= 3) return false;

    // Must contain required letter
    if (word.indexOf(requiredLetter) === -1) return false;

    // Must not contain any letters outside of the required letter and the other letters
    for (const letter of word) {
        if (allLetters.indexOf(letter) === -1) return false;
    }

    return true;
})

let pangramIndex = [];

// Get just the panagrams
const panagrams = matches.filter((word, k) => {
    console.log(k, word);

    for (const letter of otherLetters) {
        if (word.indexOf(letter) === -1) return false;
    }

    pangramIndex.push(k);
    return true
})

// Remove the pangrams from matches
for (index of pangramIndex) {
    matches.splice(index, 1);
}



console.log("----------------------\n")
console.log(`Required Letter: ${requiredLetter}`)
console.log(`Other Letters: ${otherLetters}\n`)


console.log("----------------------\n")
console.log(`${panagrams.length} Panagram${panagrams.length == 1 ? '' : 's'}:\n`);

panagrams.forEach((match, k) => {
    console.log(`${k + 1}:\t ${match}`)
})

console.log("\n----------------------\n")
console.log(`${matches.length} Other Word${panagrams.length == 1 ? '' : 's'}:\n`);

matches.forEach((match, k) => {
    console.log(`${k + 1}:\t ${match}`)
})

