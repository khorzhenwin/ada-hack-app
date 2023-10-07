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

/**
 * @param {string} product - product to be searched
 * @returns json object containing the products
 */
async function getCarousellProducts(product = "") {
  try {
    console.log(
      "Starting scraping process from Carousell for '+ " + product + "' ......"
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

    var product_json = {};
    const $ = cheerio.load(response_request.data);

    // checking if there are any products found
    if ($(".D_oy.D_ov.D_oz.D_oC.D_oG.D_oJ.D_oL.D_oH.D_oP").length == 0) {
      console.log(`==> No products of '${product}' found on Carousell`);
      return {};
    }
    // The product names
    $(".D_oy.D_ov.D_oz.D_oC.D_oG.D_oJ.D_oL.D_oH.D_oP").each((i, e) => {
      product_json[(i + 1).toString()] = {};
      product_json[(i + 1).toString()]["name"] = $(e)
        .text()
        .replace(/(\s+)/g, " ")
        .trim();
    });

    // The product prices
    $(".D_oy.D_ov.D_oz.D_oC.D_oF.D_oJ.D_oM.D_oO").each((i, e) => {
      product_json[(i + 1).toString()]["price"] = $(e)
        .text()
        .replace(/(\s+)/g, " ")
        .replace("RM", "")
        .replace(",", "")
        .trim();
    });

    // The product condition
    var temp = 0;
    $(".D_oy.D_ot.D_oz.D_oC.D_oF.D_oJ.D_oL.D_oP").each((_, e) => {
      let row = $(e).text().replace(/(\s+)/g, " ").trim();
      if (row != "Free delivery" && row.length != 0) {
        product_json[(temp + 1).toString()]["condition"] = row;
        temp++;
      }
    });

    // The product likes/hearts
    $(".D_oy.D_ot.D_oz.D_oC.D_oG.D_oJ.D_oL.D_oP").each((i, e) => {
      let row = $(e).text().replace(/(\s+)/g, " ").trim();
      row == " "
        ? (product_json[(i + 1).toString()]["likes"] = "0")
        : (product_json[(i + 1).toString()]["likes"] = row);
    });
    // console.log(product_json);
    console.log(`Done scraping Carousell for '${product}'`);
    console.log("==> Products found: ", Object.keys(product_json).length);

    return product_json;
  } catch (error) {
    console.log(error);
    return {};
  }
}

/**
 * @param {string} product - product to be searched
 * @returns json object containing the products
 */
async function getMudahMyProducts(product = "") {
  try {
    console.log(
      "Starting scraping process from mudah.my for '+ " + product + "' ......"
    );

    const search_url =
      "https://www.mudah.my/malaysia/all?q=" +
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

    // mudah.my shuffles between multiple html class names on each reload randomly

    // The product names
    var name_html_class = "";
    if ($(".sc-cqCuEk.iMqSjF").length != 0)
      name_html_class = ".sc-cqCuEk.iMqSjF";
    else if ($(".sc-dqBHgY.IdWpP").length != 0)
      name_html_class = ".sc-dqBHgY.IdWpP";
    else if ($(".sc-eInJlc.iCLkHj").length != 0)
      name_html_class = ".sc-eInJlc.iCLkHj";
    else if ($(".sc-jwKygS.BZRPK").length != 0)
      name_html_class = ".sc-jwKygS.BZRPK";
    else {
      // checking if there are any products found
      console.log(`==> No products of '${product}' found on mudah.my`);
      return {};
    }
    // console.log(name_html_class + " : " + $(name_html_class).length);
    $(name_html_class).each((i, e) => {
      product_json[(i + 1).toString()] = {};
      product_json[(i + 1).toString()]["name"] = $(e)
        .attr()
        .title.replace(/(\s+)/g, " ")
        .trim();
    });

    // The product prices
    var price_html_class = "";
    if ($(".sc-bYSBpT.kwGkYp").length != 0)
      price_html_class = ".sc-bYSBpT.kwGkYp";
    else if ($(".sc-qrIAp.hXuQJX").length != 0)
      price_html_class = ".sc-qrIAp.hXuQJX";
    else price_html_class = ".sc-hzDEsm.ftGocf";
    // console.log(price_html_class + " : " + $(price_html_class).length);
    $(price_html_class).each((i, e) => {
      product_json[(i + 1).toString()]["price"] = $(e)
        .text()
        .replace(/(\s+)/g, " ")
        .replace("RM ", "")
        .trim();
    });

    // The product condition
    var condition_html_class = "";
    if ($(".sc-bGbJRg.dXZAHJ").length != 0)
      condition_html_class = ".sc-bGbJRg.dXZAHJ";
    else if ($(".sc-iGrrsa.csUzpc").length != 0)
      condition_html_class = ".sc-iGrrsa.csUzpc";
    else condition_html_class = ".sc-kTUwUJ.kIMHDB";
    // console.log(condition_html_class + " : " + $(condition_html_class).length / 2);
    var temp = 0;
    $(condition_html_class).each((_, e) => {
      if ($(e).attr().title == "Condition") {
        product_json[(temp + 1).toString()]["condition"] = $(e)
          .children("div")
          .text()
          .replace(/(\s+)/g, " ")
          .trim();
        temp++;
      }
    });

    // console.log(product_json);
    console.log(`Done scraping mudah.my for '${product}'`);
    console.log("==> Products found: ", Object.keys(product_json).length);

    return product_json;
  } catch (error) {
    console.log(error);
    return {};
  }
}

// ==> To check codes in console
// getIpriceProducts("monitor stand");
// getCarousellProducts("monitor stand");
// getMudahMyProducts("monitor stand");
