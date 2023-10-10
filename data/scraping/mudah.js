const axios = require("axios");
const cheerio = require("cheerio");

// import axios from axios;
// import cheerio from cheerio;

/**
 * @param {string} product - product to be searched
 * @param {number} pageNo - get the data of the top (x) to top (x + 2) products, x = pageNo
 * @returns {Promise<JSON[]>} array object containing the products
 */
export async function getMudahMyProducts(product = "", pageNo = 1) {
  try {
    console.log(
      `Starting scraping process from mudah.my for '${product}' ......`
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

    var product_array = [];
    const $ = cheerio.load(response_request.data);

    // mudah.my shuffles between multiple html class names on each reload randomly

    // The product image url
    var image_html_class = "";
    if ($(".mw1291").length != 0) image_html_class = ".mw1291";
    else if ($(".mw357").length != 0) image_html_class = ".mw357";
    else {
      // checking if there are any products found
      console.log(`==> No products of '${product}' found on mudah.my`);
      return [];
    }
    // console.log(image_html_class + " : " + $(image_html_class).length);
    $(image_html_class).each((i, e) => {
      product_array.push({
        image: "",
        // image: $(e).attr().src.replace(/(\s+)/g, " ").trim(),
      });
    });

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
    // console.log(name_html_class + " : " + $(name_html_class).length);
    $(name_html_class).each((i, e) => {
      product_array[i]["name"] = $(e)
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
      product_array[i]["price"] = $(e)
        .text()
        .replace(/(\s+)/g, " ")
        .replace("RM ", "")
        .trim();
      product_array[i]["rating"] = "";
      product_array[i]["seller_name"] = "";
    });

    // The product seller location
    var location_html_class = "";
    if ($(".sc-dNLxif.eWZRuS").length != 0)
      location_html_class = ".sc-dNLxif.eWZRuS";
    else if ($(".sc-TFwJa.eHevBI").length != 0)
      location_html_class = ".sc-TFwJa.eHevBI";
    else location_html_class = ".sc-kxynE.jyeGVA";
    // console.log(location_html_class + " : " + $(location_html_class).length);
    $(location_html_class).each((i, e) => {
      product_array[i]["seller_location"] = $(e)
        .text()
        .replace(/(\s+)/g, " ")
        .trim();
    });

    // The product page url
    var productURL_html_class = "";
    if ($(".sc-giadOv.dOjdcz").length != 0)
      productURL_html_class = ".sc-giadOv.dOjdcz";
    else if ($(".sc-cIShpX.jvoCyo").length != 0)
      productURL_html_class = ".sc-cIShpX.jvoCyo";
    else productURL_html_class = ".sc-etwtAo.jTnCIh";
    // console.log(productURL_html_class + " : " + $(productURL_html_class).length);
    $(productURL_html_class).each((i, e) => {
      product_array[i]["url"] = $(e).attr().href.trim();
    });

    // The product condition
    // var condition_html_class = "";
    // if ($(".sc-bGbJRg.dXZAHJ").length != 0)
    //   condition_html_class = ".sc-bGbJRg.dXZAHJ";
    // else if ($(".sc-iGrrsa.csUzpc").length != 0)
    //   condition_html_class = ".sc-iGrrsa.csUzpc";
    // else condition_html_class = ".sc-kTUwUJ.kIMHDB";
    // // console.log(condition_html_class + " : " + $(condition_html_class).length / 2);
    // var temp = 0;
    // $(condition_html_class).each((_, e) => {
    //   if ($(e).attr().title == "Condition") {
    //     product_array[temp]["condition"] = $(e)
    //       .children("div")
    //       .text()
    //       .replace(/(\s+)/g, " ")
    //       .trim();
    //     temp++;
    //   }
    // });

    // console.log(product_json);
    console.log(`Done scraping mudah.my for '${product}'`);
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

// getMudahMyProducts("monitor stand", 2).then((arr) => {
//   console.log(arr);
// });
