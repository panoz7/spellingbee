// var apiUrl = 'http://localhost:8888/spellingbee/compare/api/v1.php';
var apiUrl = 'https://griffinfriedman.com/spelling-bee/api/v1.php';

// Divs
var container = document.getElementById('comparison');
var dateDiv = document.getElementById('date');

// Update the date field
const date = new Date();
dateDiv.innerHTML = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

// Build the comparison table
buildComparison();



async function getWords() {

    console.log(apiUrl);
    const response = await fetch(apiUrl)
    const data = await response.json();

    return data;

}

async function buildComparison() {

    container.innerHTML = "";

    // Get the words
    const userWords = await getWords();


    // Build a combined set of all the found words
    const wordSet = new Set()
    for (let user of userWords) {
        for (let word of user.words) {
            wordSet.add(word);
        }
    }

    // Convert the set to an array and sort alphabetically 
    const words = [...wordSet].sort();  


    // Output each user's words
    for (let user of userWords) {

        // Get the other user's words
        // We'll use these later to visually differentiate unique words
        const otherUserWords = userWords
            .filter(otherUser => otherUser != user)
            .reduce((acc, cur) => {
                return [...acc, ...cur.words]
            }, [])

        // Create a column
        const div = document.createElement('div');
        container.appendChild(div);

        
        // Add the header
        const h2 = document.createElement('h2');
        h2.innerHTML = user.user_name;
        div.appendChild(h2);

        // Create the delete button
        const button = document.createElement('button');
        button.innerHTML = "X";
        
        // Have it send the delete call
        button.addEventListener('click', () => {
            deleteUser(user.user_name, div)
        })

        div.appendChild(button);

        // Create the UL
        const ul = document.createElement('ul');
        div.appendChild(ul);

        // Add entries for each word
        for (let word of words) {
            const li = document.createElement('li');
            li.innerHTML = word;
            ul.appendChild(li);

            // Gray out missing words
            if (!user.words.includes(word)) {
                li.classList.add('missing');
            }

            // Emphasize words that are unique
            if (otherUserWords.length && !otherUserWords.includes(word)) {
                li.classList.add('unique');
            }

        }
    }
}

async function deleteUser(user_name, userDiv) {

    if (window.confirm(`Are you sure you want to remove ${user_name}`)) {
        
        try {
            // Delete the entry
            const response = await fetch(apiUrl + "?" + new URLSearchParams({user_name: user_name}), {
                method: 'DELETE'
            })
    
            await buildComparison();
        } catch (e) {
            console.log(e);
        }
    }

}