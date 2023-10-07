const axios = require("axios");
const cheerio = require("cheerio");

// import axios from axios;
// import cheerio from cheerio;

/**
 * @param {string} product - product to be searched
 * @param {number} pageNo - get the data of the top (x) to top (x + 2) products, x = pageNo
 * @returns {Array<JSON>} array object containing the products
 */
export async function getIpriceProducts(product = "", pageNo = 1) {
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

    var product_array = [];
    const $ = cheerio.load(response_request.data);

    // checking if there are any products found
    if ($(".zE.zF.qB").length == 0) {
      console.log(`==> No products of '${product}' found on iprice`);
      return [];
    }

    // The product image url
    $(".z9.z7").each((i, e) => {
      let temp = {};
      temp["image"] = $(e).attr().src.replace(/(\s+)/g, " ").trim();
      product_array.push(temp);
    });

    // The product names
    $(".zE.zF.qB").each((i, e) => {
      product_array[i]["name"] = $(e).text().replace(/(\s+)/g, " ").trim();
    });

    // The product prices
    $(".z4.nW.e7").each((i, e) => {
      product_array[i]["price"] = $(e)
        .text()
        .replace(/(\s+)/g, " ")
        .replace("RM ", "")
        .replace(",", "")
        .trim();
    });

    // The product rating
    $(".g.b.t.e5.l").each((i, e) => {
      product_array[i]["rating"] = $(e).text().replace(/(\s+)/g, " ").trim();
    });

    // The product store name (seller name)
    $(".zM.lc.qB.g").each((i, e) => {
      product_array[i]["seller_name"] = $(e)
        .text()
        .replace(/(\s+)/g, " ")
        .trim();
      product_array[i]["seller_location"] = "";
    });

    // The product page url
    $(".zA.l4.pu.rg.zC.le").each((i, e) => {
      product_array[i]["url"] =
        "https://iprice.my" + $(e).attr().on.split("'")[1].trim();
    });

    // The product original ecommerce store
    $(".zO").each((i, e) => {
      product_array[i]["ecommerce"] = $(e).text().replace(/(\s+)/g, " ").trim();
    });

    // console.log(product_array);
    console.log(`Done scraping iprice for '${product}'`);
    console.log("==> Products found: ", Object.keys(product_array).length);

    if (product_array.length < pageNo * 3) {
      if (product_array.length < pageNo * 3 - 2) {
        console.log("No more products available for the required page number");
        return [];
      } else {
        return product_array.slice(pageNo * 3 - 3);
      }
    } else {
      return product_array.slice(pageNo * 3 - 3, pageNo * 3);
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

// getIpriceProducts("monitor stand", 2).then((product_arr) => {
//   console.log(product_arr);
// });
