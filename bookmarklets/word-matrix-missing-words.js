const letters = gameData.today.validLetters;

const validWords = getRemainingWords();

let counts = {};
letters.forEach(letter => counts[letter] = []);
let longestWordLength = 0; 

validWords.forEach(word => {
    let letterCounts = counts[word[0]];
    if (letterCounts[word.length]) letterCounts[word.length] += 1;
    else letterCounts[word.length] = 1; 
    if (counts[word.length]) counts[word.length] += 1;
    else counts[word.length] = 1; 
    if (word.length > longestWordLength) longestWordLength = word.length;
});

let strings = [];
let heading = '\t';
for (let i = 4; i <= longestWordLength; i++) {
    heading += i +'\t';
};
strings.push(heading);

letters.forEach(letter => {
    let string = letter.toUpperCase() + '\t';
    for (let i = 4; i <= longestWordLength; i++) {
        string += counts[letter][i] ? counts[letter][i] : '-';
        string += "\t";
    }
    string += counts[letter].reduce((cur, acc) => cur + acc, 0);
    strings.push(string);
});

let string = '\t';
for (let i = 4; i <= longestWordLength; i++) {
    string += counts[i] ? counts[i] : '0';
    string += "\t";
};
string += validWords.length;
strings.push(string);

alert (strings.join("\n"));

function getRemainingWords() {
    let foundWords = [];
    const lis = document.getElementsByClassName('sb-wordlist-items-pag')[0].getElementsByTagName('li');
    for (let li of lis) {
        const span = li.getElementsByTagName('span')[0]
        foundWords.push(span.textContent);
    }
    const allWords = window.gameData.today.answers;
    const remainingWords = allWords.filter(word => foundWords.indexOf(word) < 0);

    return remainingWords;
}