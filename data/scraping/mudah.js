const axios = require("axios");
const cheerio = require("cheerio");

// import axios from axios;
// import cheerio from cheerio;

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
  