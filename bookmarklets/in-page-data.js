const letters = gameData.today.validLetters;
const allWords = window.gameData.today.answers;
let remainingWords = getRemainingWords();
const longestWordLength = allWords.reduce((acc, cur) => cur.length > acc ? cur.length : acc, 0)

// Create the column where the tables will be added
const sbContentBox = document.getElementsByClassName('sb-content-box')[0];
const newColumn = document.createElement('div');
newColumn.style.paddingTop = '18px';
newColumn.style.paddingleft = '10px';
sbContentBox.insertBefore(newColumn, sbContentBox.firstChild);

// Add the combo table
const comboTableH4 = document.createElement('h4');
comboTableH4.classList.add('sb-progress-rank');
comboTableH4.innerHTML = 'Letter Combos';
newColumn.appendChild(comboTableH4);
const comboHeader = letters.slice();
comboHeader.unshift(' ');
let comboTable = genTable(comboHeader, getLetterComboCounts(remainingWords));
newColumn.appendChild(comboTable);

// Add the length table
const lengthTableH4 = document.createElement('h4');
lengthTableH4.classList.add('sb-progress-rank');
lengthTableH4.style.marginTop = '20px';
lengthTableH4.innerHTML = 'Word Lengths';
newColumn.appendChild(lengthTableH4);
const lengthHeader = formatLengthTableHeader();
let lengthTable = genTable(lengthHeader, formatLengthCountsForTable(getLengthCounts(remainingWords)));
newColumn.appendChild(lengthTable);

// Add the remaining letter counts table
const countsTableH4 = document.createElement('h4');
countsTableH4.classList.add('sb-progress-rank');
countsTableH4.style.marginTop = '20px';
countsTableH4.innerHTML = 'Remaining Letters';
newColumn.appendChild(countsTableH4);
let countTable = genTable(comboHeader, getRemainingLetterCounts(remainingWords));
newColumn.appendChild(countTable);


// select the found word list
var target = document.querySelector('.sb-wordlist-items-pag');

// create an observer instance
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {

    remainingWords = getRemainingWords();

    // Very time the wordlist change update the combotable
    const newComboTable = genTable(comboHeader, getLetterComboCounts(remainingWords));
    comboTable.replaceWith(newComboTable);
    comboTable = newComboTable;

    const newLengthTable = genTable(lengthHeader, formatLengthCountsForTable(getLengthCounts(remainingWords)));
    lengthTable.replaceWith(newLengthTable);
    lengthTable = newLengthTable;

    const newCountTable = genTable(comboHeader, getRemainingLetterCounts(remainingWords));
    countTable.replaceWith(newCountTable);
    countTable = newCountTable;

  });    
});

// configuration of the observer and start it
var config = { attributes: true, childList: true, characterData: true };
observer.observe(target, config);



function genTable(headerData, tableData) {
    const table = document.createElement('table');
    table.style.display = 'block';
    table.style.fontFamily = 'nyt-franklin';
    table.style.borderSpacing = '2px';
    table.style.borderCollapse = 'initial';
    
    const headerRow = document.createElement('tr');

    // Header
    for (let col of headerData) {
        const th = document.createElement('th');
        applyCellStyle(th);
        th.innerHTML = col.toUpperCase();
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Body
    for (let row of tableData) {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        applyCellStyle(th);
        th.innerHTML = row.header.toUpperCase();
        tr.appendChild(th);

        for (let count of row.counts) {
            const td = document.createElement('td');
            applyCellStyle(td, count != '-');
            td.innerHTML = count;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    return table;
}

function applyCellStyle(elem, active = false) {
    elem.style.width = '1.2em';
    elem.style.height = '1.2em';
    elem.style.textAlign = 'center';
    elem.style.lineHeight = '1.2em';
    elem.style.fontSize = '1em';
    elem.borderRadius = '5px';

    if (active) {
        elem.style.backgroundColor = '#f7da21';
    }

    if (elem.tagName.toLowerCase() == 'th') {
        elem.style.fontWeight = 'bold';
    }
}

function getLengthCounts(remainingWords) {

    const countsByLetter = {};
    for (let word of remainingWords) {
        const firstLetter = word[0];

        if (!countsByLetter[firstLetter]) {
            countsByLetter[firstLetter] = [];
        }

        if (!countsByLetter[firstLetter][word.length]) {
            countsByLetter[firstLetter][word.length] = 1
        } else {
            countsByLetter[firstLetter][word.length]++;
        }
    }

    return countsByLetter;
}

function formatLengthTableHeader() {
    const cols = [" "];
    for (let i = 4; i <= longestWordLength; i++) {
        cols.push(i.toString());
    }
    return cols;
}

function formatLengthCountsForTable(lengthCounts) {
    
    const rows = [];

    // Build out the rows for each letter
    for (let letter of letters) {

        const rowCounts = [];
        let rowTotal = 0;
        for (let i = 4; i <= longestWordLength; i++) {
            const letterCount = lengthCounts[letter] ? lengthCounts[letter][i] : undefined;
            rowCounts.push(letterCount ? letterCount : '-');
        }

        rows.push({
            header: letter,
            counts: rowCounts
        })
    }

    return rows;

}

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

function getLetterComboCounts(remainingWords) {
    const letters = gameData.today.validLetters;

    const comboCounts = [];

    for (let letter1 of letters) {
        const counts = [];

        for (let letter2 of letters) {
            const count = remainingWords.filter(word => word.startsWith(letter1 + letter2)).length;
            counts.push(count > 0 ? count : '-');
        }

        comboCounts.push({
            header: letter1,
            counts
        });
    }

    return comboCounts;
}

function getRemainingLetterCounts(remainingWords) {

    const letters = gameData.today.validLetters;

    const remainingLetterCounts = remainingWords.reduce((letters, word) => {
        return [...word.split(''), ...letters] 
    }, []).reduce((counts, letter) => {
        counts[letter] = (counts[letter] || 0) + 1;
        return counts;
    }, {})

    const counts = [];

    for (let letter of letters) {
        counts.push([remainingLetterCounts[letter]])
    }

    return [{
        header: '#', 
        counts
    }];

}