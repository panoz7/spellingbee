const letters = gameData.today.validLetters;

let foundWords = [];
const lis = document.getElementsByClassName('sb-wordlist-items-pag')[0].getElementsByTagName('li');
for (let li of lis) {
    foundWords.push(li.textContent);
}
const allWords = window.gameData.today.answers;
const remainingWords = getRemainingWords();

let strings = [];

strings.push('\t' + letters.map(letter => letter.toUpperCase()).join('\t'));

for (let letter1 of letters) {
    let string = letter1.toUpperCase() + '\t';

    for (let letter2 of letters) {

        const count = remainingWords.filter(word => word.startsWith(letter1 + letter2)).length;

        string += count > 0 ? count : '-';
        string += "\t";

    }

    strings.push(string);
}

alert(strings.join("\n"));


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