const puppeteer = require('puppeteer');
const http = require('http');
const { parse } = require('querystring');

function generateLazadaURL(searchQuery) {
    const baseUrl = 'https://www.lazada.com.my/tag/';
    const category = searchQuery;
    const isMultiWord = searchQuery.includes(' ');
    const encodedSearchQuery = isMultiWord ? encodeURIComponent(searchQuery) : searchQuery;
    const modifiedCategory = isMultiWord ? category.replace(/ /g, '-') : category;
    const url = `${baseUrl}${modifiedCategory}/?ajax=true&catalog_redirect_tag=true&from=filter_h5&isFirstRequest=true&page=1&q=${encodedSearchQuery}&spm=a2o4k.homepwa.searchbar.keyboard&rating=5`;
    return url;
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        collectRequestData(req, result => {
            console.log(result);
            const userInput = result.user_input;
            console.log(`Searching, ${userInput}!`);
            scrapeProducts(userInput, res);
        });
    } else {
        res.end(`
            <!doctype html>
            <html>
            <body>
                <form action="/" method="post">
                    <label for="user_input">What would you like to search:</label>
                    <input type="text" name="user_input" /><br />
                    <button type="submit">Submit</button>
                </form>
            </body>
            </html>
        `);
    }
});

server.listen(3000);

async function scrapeProducts(userInput, response) {
    const productURL = generateLazadaURL(userInput);
    const browser = await puppeteer.launch({ headless: 'new' }); // Set headless to true or false
    const page = await browser.newPage();

    try {
        await page.goto(productURL, { waitUntil: 'domcontentloaded' });
        const req = await page.evaluate(() => {
            return JSON.parse(document.body.innerText);
        });
        const rows = req.mods.listItems;
        const total_products = req.mainInfo.totalResults;
        const all_product = [];

        if (total_products === 0) {
            console.log('No products matching your search query were found.');
        } else {
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
            console.log(all_product.length);
        }

        response.end(JSON.stringify({ products: all_product, totalProducts: total_products }));
    } catch (error) {
        console.error(error);
        response.end('Error occurred while scraping data.');
    } finally {
        await browser.close();
    }
}

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if (request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    } else {
        callback(null);
    }
}

