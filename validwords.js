// Grab the words list
var fs = require('fs');
const wordsListDir = '/usr/share/dict/words';
const words = fs.readFileSync(wordsListDir, 'utf8').split("\n");

// Do the cascading calculations for each category
// All spelling bees are at least 4 letters long
const fourLettersOrLonger = words.filter(word => word.length >= 4)
// Spelling bee doesn't accept proper nouns so remove all the words that start with capitals
const noCapitals = fourLettersOrLonger.filter(word => word[0] !== word[0].toUpperCase());
// Spelling bees will never contain certain letters
const forbiddenLetters = 'sqj'.split('');
const noForbiddenLetters = noCapitals.filter(word => doesNotContain(word, forbiddenLetters))
// In general spelling bees will never contain more than two vowels
const lessThanOrTwoVowels = noForbiddenLetters.filter(word => numVowels(word) <= 2)

// Output the results
console.log(`All words:\t${words.length}
> 4 letters:\t${fourLettersOrLonger.length},\t${fourLettersOrLonger.length - words.length}
No capitals:\t${noCapitals.length},\t${noCapitals.length - fourLettersOrLonger.length}
No ${forbiddenLetters.join(',')}:\t${noForbiddenLetters.length},\t${noForbiddenLetters.length - noCapitals.length}
<= 2 vowels:\t${lessThanOrTwoVowels.length},\t${lessThanOrTwoVowels.length - noForbiddenLetters.length}`)


function numVowels(word) {
    const vowels = 'aeiou'.split('');
    let vowelCount = 0; 

    for (let vowel of vowels) {
        if (word.indexOf(vowel) >= 0) vowelCount++
    }
    return vowelCount;
}

function doesNotContain(word, forbiddenLetters) {
    for (let letter of forbiddenLetters) {
        if (word.indexOf(letter) >= 0) return false;
    }
    return true;
}