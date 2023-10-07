const axios = require("axios");
const cheerio = require("cheerio");

// import axios from axios;
// import cheerio from cheerio;

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
  