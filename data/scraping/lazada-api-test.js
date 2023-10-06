const puppeteer = require('puppeteer');
const readline = require('readline');

function generateLazadaURL(searchQuery) {
    const baseUrl = 'https://www.lazada.com.my/tag/';

    const category = searchQuery;

    // Check if the searchQuery contains spaces
    const isMultiWord = searchQuery.includes(' ');

    // Encode the search query to make it URL-safe
    const encodedSearchQuery = isMultiWord ? encodeURIComponent(searchQuery) : searchQuery;

    // Modify the category based on whether it's a multi-word search query
    const modifiedCategory = isMultiWord ? category.replace(/ /g, '-') : category;

    // Construct the URL based on user inputs
    const url = `${baseUrl}${modifiedCategory}/?ajax=true&catalog_redirect_tag=true&from=filter_h5&isFirstRequest=true&page=1&q=${encodedSearchQuery}&spm=a2o4k.homepwa.searchbar.keyboard&rating=5`

    console.log(url)

    return url;
}

let userInput;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('What would you like to search ? ', (userInputResponse) => {
    userInput = userInputResponse;
    console.log(`Searching, ${userInput}!`);

    rl.close();

    scrapeProducts();
});

async function scrapeProducts() {
    const productURL = generateLazadaURL(userInput);
    const browser = await puppeteer.launch({ headless: 'new' }); // Set headless to true or false
    const page = await browser.newPage();

    // Navigate to the URL
    await page.goto(productURL, { waitUntil: 'domcontentloaded' });

    // Extract JSON data from the page
    const req = await page.evaluate(() => {
        return JSON.parse(document.body.innerText);
    });

    // Extract rows from the JSON data
    const rows = req.mods.listItems;
    const total_products = req.mainInfo.totalResults;
    const all_product = [];

    if (total_products === 0) {
        console.log('No products matching your search query were found.');
    } else {

        // Extract product details
        for (let i = 0; i < rows.length; i++) {
            const product_name = 'product name: ' + rows[i].name;
            const product_price = 'product price: ' + rows[i].priceShow;
            const seller_name = 'seller name: ' + rows[i].sellerName;
            const seller_location = 'location : ' + rows[i].location;
            const product_image = 'product image: ' + rows[i].image;
            const product_url = 'product link: https:' + rows[i].itemUrl;
            const product_rating = 'product rating: ' + rows[i].ratingScore;
            all_product.push([product_image, product_name, product_price, product_rating, seller_name, seller_location, product_url]);
        }

        console.log(all_product);
        console.log(total_products);
        console.log((all_product.length))
    }

    await browser.close();
}