
main();


async function main() {

    let increment;

    // Determine if we're in dev mode
    const params = new URLSearchParams(window.location.search);
    if (params.get('dev') == 'true') {
        
        // Load the increment from local storage and increment it
        increment = localStorage.getItem('bookmarklet-increment') || 0;
        increment++;

        // Save it back to local storage
        localStorage.setItem('bookmarklet-increment', increment);

        // Update the link in the footer
        const devModeLink = document.getElementById('dev-mode-link');
        devModeLink.innerHTML = 'Std Mode';
        devModeLink.href = "?dev=false";

    }


    // Load the bookmarklet's JSON and add them to the page
    const response = await fetch('bookmarklets.json');
    const bookmarklets = await response.json();

    for (let bookmarklet of bookmarklets) {

        const ul = document.getElementById('bookmarklets');

        // Li
        const li = document.createElement('li');

        // title
        const title = document.createElement('h2');
        title.innerHTML = bookmarklet.name;
        li.appendChild(title);

        // Description
        const desc = document.createElement('p');
        desc.innerHTML = bookmarklet.description;
        li.appendChild(desc);

        // Link
        const a = document.createElement('a');
        a.href = bookmarklet.encoded;
        
        
        let linkName = `SB - ${bookmarklet.name}`;

        if (increment != null) {
            linkName += ` - ${increment }`
        }

        const textSpan = document.createElement('span');
        textSpan.classList.add('text');
        textSpan.innerHTML = linkName;

        a.appendChild(textSpan);

        li.appendChild(a);
        ul.appendChild(li);

        a.addEventListener('click', e => {
            e.preventDefault();
            copyLink(a, bookmarklet.encoded);
        })

    }

}

async function copyLink(button, bookmarkletCode) {
    try {
        console.log(button);

        await navigator.clipboard.writeText(bookmarkletCode)
        
        const width = button.offsetWidth;
        button.style.width = width;
        button.classList.add('copied')

        const copiedSpan = document.createElement('span');
        copiedSpan.innerHTML = "Code Copied!";

        button.appendChild(copiedSpan);

        setTimeout(() => {
            button.removeChild(copiedSpan);
            button.classList.remove('copied');
            button.style.width = 'fit-content'
        }, 1000)

    } catch(e) {
        console.log(e);
    }
}