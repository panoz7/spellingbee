const fs = require('fs')
const path = require('path');
const { minify } = require("terser");
 

async function main() {
    // Load the json with the metadata about each bookmarklet 
    const metadata = JSON.parse(fs.readFileSync(path.join('bookmarklets', '_metadata.json'), 'utf-8'));

    const bookmarkletPromises = metadata.map(async bookmarkletData => {

        const bookmarkletJS = fs.readFileSync(path.join('bookmarklets', `${bookmarkletData.id}.js`), 'utf-8');
        const minified = await minify(bookmarkletJS);
        const encoded = `javascript:(function(){${encodeURIComponent(minified.code)}}());`

        return {
            id: bookmarkletData.id,
            name: bookmarkletData.name,
            description: bookmarkletData.description,
            encoded: encoded
        }

    });



    const bookmarklets = await Promise.all(bookmarkletPromises);

    // Write the results to a json 
    fs.writeFileSync('site/bookmarklets.json', JSON.stringify(bookmarklets, undefined, 2))


}





main();