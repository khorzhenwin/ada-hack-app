const axios = require("axios");
const cheerio = require("cheerio");

// import axios from axios;
// import cheerio from cheerio;

/**
 * @param {string} product - product to be searched *
 * @param {number} pageNo - get the data of the top (x) to top (x + 2) products, x = pageNo
 * @returns {Promise<JSON[]>} array object containing the products
 */
export async function getCarousellProducts(product = "", pageNo = 1) {
  try {
    console.log(
      `Starting scraping process from Carousell for '${product}' ......`
    );

    const search_url =
      "https://www.carousell.com.my/search/" +
      product.replace(/\s+/g, " ").trim().replace(" ", "+") +
      "?addRecent=false&canChangeKeyword=false&includeSuggestions=false&is_bp_enabled=true";
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
    if ($(".D_oy.D_ov.D_oz.D_oC.D_oG.D_oJ.D_oL.D_oH.D_oP").length == 0) {
      console.log(`==> No products of '${product}' found on Carousell`);
      return [];
    }

    // The product image url
    $(".D_yQ.D_Zj").each((i, e) => {
      product_array.push({
        image: $(e).attr().src.replace(/(\s+)/g, " ").trim(),
      });
    });

    // The product names
    $(".D_oy.D_ov.D_oz.D_oC.D_oG.D_oJ.D_oL.D_oH.D_oP").each((i, e) => {
      product_array[i]["name"] = $(e).text().replace(/(\s+)/g, " ").trim();
    });

    // The product prices
    $(".D_oy.D_ov.D_oz.D_oC.D_oF.D_oJ.D_oM.D_oO").each((i, e) => {
      product_array[i]["price"] = $(e)
        .text()
        .replace(/(\s+)/g, " ")
        .replace("RM", "")
        .replace(",", "")
        .trim();
      product_array[i]["rating"] = "";
    });

    // The product store name (seller name)
    $(".D_oy.D_ov.D_oz.D_oC.D_oF.D_oJ.D_oM.D_oP").each((i, e) => {
      product_array[i]["seller_name"] = $(e)
        .text()
        .replace(/(\s+)/g, " ")
        .trim();
      product_array[i]["seller_location"] = "";
    });

    // The product page url
    $(".D_AB a:not(.D_AH.D_oS)").each((i, e) => {
      product_array[i]["url"] =
        "https://www.carousell.com.my" + $(e).attr().href.trim();
    });

    // The product condition
    // var temp = 0;
    // $(".D_oy.D_ot.D_oz.D_oC.D_oF.D_oJ.D_oL.D_oP").each((_, e) => {
    //   let row = $(e).text().replace(/(\s+)/g, " ").trim();
    //   if (row != "Free delivery" && row.length != 0) {
    //     product_array[temp]["condition"] = row;
    //     temp++;
    //   }
    // });

    // The product likes/hearts
    // $(".D_oy.D_ot.D_oz.D_oC.D_oG.D_oJ.D_oL.D_oP").each((i, e) => {
    //   let row = $(e).text().replace(/(\s+)/g, " ").trim();
    //   row == " "
    //     ? (product_array[i]["likes"] = "0")
    //     : (product_array[i]["likes"] = row);
    // });

    // console.log(product_array);
    console.log(`Done scraping Carousell for '${product}'`);
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

// getCarousellProducts("monitor stand", 3).then((arr) => {
//   console.log(arr);
// });
