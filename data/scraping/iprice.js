const axios = require("axios");
const cheerio = require("cheerio");

// import axios from axios;
// import cheerio from cheerio;

/**
 * @param {string} product - product to be searched
 * @returns json object containing the products
 */
async function getIpriceProducts(product = "") {
  try {
    console.log(
      "Starting scraping process from iprice for '+ " + product + "' ......"
    );

    const search_url =
      "https://iprice.my/search/?term=" +
      product.replace(/\s+/g, " ").trim().replace(" ", "+");
    console.log("Search URL used: " + search_url);

    const response_request = await axios.request({
      method: "GET",
      url: search_url,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0",
      },
    });

    var product_json = {};
    const $ = cheerio.load(response_request.data);

    // checking if there are any products found
    if ($(".zE.zF.qB").length == 0) {
      console.log(`==> No products of '${product}' found on iprice`);
      return {};
    }

    // The product names
    $(".zE.zF.qB").each((i, e) => {
      product_json[(i + 1).toString()] = {};
      product_json[(i + 1).toString()]["name"] = $(e)
        .text()
        .replace(/(\s+)/g, " ")
        .trim();
    });

    // The product prices
    $(".z4.nW.e7").each((i, e) => {
      product_json[(i + 1).toString()]["price"] = $(e)
        .text()
        .replace(/(\s+)/g, " ")
        .replace("RM ", "")
        .replace(",", "")
        .trim();
    });

    // The product store name
    $(".zM.lc.qB.g").each((i, e) => {
      product_json[(i + 1).toString()]["store"] = $(e)
        .text()
        .replace(/(\s+)/g, " ")
        .trim();
    });

    // The product original ecommerce store
    $(".zO").each((i, e) => {
      product_json[(i + 1).toString()]["ecommerce"] = $(e)
        .text()
        .replace(/(\s+)/g, " ")
        .trim();
    });

    // The product rating
    $(".g.b.t.e5.l").each((i, e) => {
      product_json[(i + 1).toString()]["rating"] = $(e)
        .text()
        .replace(/(\s+)/g, " ")
        .trim();
    });
    // console.log(product_json);
    console.log(`Done scraping iprice for '${product}'`);
    console.log("==> Products found: ", Object.keys(product_json).length);

    return product_json;
  } catch (error) {
    console.log(error);
    return {};
  }
}
