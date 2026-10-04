const missingWords = getRemainingWords();
alert (missingWords.join('\n'))

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