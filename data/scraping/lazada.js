const puppeteer = require("puppeteer");

function generateLazadaURL(searchQuery) {
  const baseUrl = "https://www.lazada.com.my/tag/";
  const category = searchQuery;
  const isMultiWord = searchQuery.includes(" ");
  const encodedSearchQuery = isMultiWord
    ? encodeURIComponent(searchQuery)
    : searchQuery;
  const modifiedCategory = isMultiWord ? category.replace(/ /g, "-") : category;
  const url = `${baseUrl}${modifiedCategory}/?ajax=true&catalog_redirect_tag=true&from=filter_h5&isFirstRequest=true&page=1&q=${encodedSearchQuery}&spm=a2o4k.homepwa.searchbar.keyboard&rating=5`;
  return url;
}

export async function getLazadaProducts(userInput, pageNo = 1) {
  const productURL = generateLazadaURL(userInput);
  const browser = await puppeteer.launch({ headless: "new" }); // Set headless to true or false
  const page = await browser.newPage();

  // Navigate to the URL
  await page.goto(productURL, {
    waitUntil: ["domcontentloaded", "networkidle2"],
  });

  // Extract JSON data from the page
  const req = await page.evaluate(() => {
    return JSON.parse(document.body.innerText);
  });

  // Extract rows from the JSON data
  const rows = req.mods.listItems;
  const total_products = req.mainInfo.totalResults;
  const all_products = [];

  if (total_products === 0) {
    await browser.close();
    return [];
  }

  if (pageNo < 1) pageNo = 1;
  for (let i = (pageNo - 1) * 3; i < pageNo * 3; i++) {
    const name = rows[i].name;
    const price = rows[i].priceShow.replace("RM", "");
    const seller_name = rows[i].sellerName;
    const seller_location = rows[i].location;
    const image = rows[i].image;
    const url = "https:" + rows[i].itemUrl;
    const rating = rows[i].ratingScore;

    all_products.push({
      image,
      name,
      price,
      rating,
      seller_name,
      seller_location,
      url,
    });
  }

  await browser.close();
  return all_products;
}

getLazadaProducts("shoes", 2).then((product_arr) => {
  console.log(product_arr);
});
