import {
  getCarousellProducts,
  getIpriceProducts,
  getMudahMyProducts,
  // getLazadaProducts,
} from "../../data/scraping";
// import { getLazadaProductsFromAPI } from "../../data/api";
import { v4 as uuidv4 } from "uuid";

// GET Method
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { category, pageNo = 1 } = req.query;
  if (!category) {
    res.status(400).json({ message: "Missing query parameters" });
    return;
  }

  // let lazada;
  let carousell;
  let iprice;
  let mudah;

  // try {
  //   lazada = await getLazadaProductsFromAPI(category, pageNo);
  // } catch (error) {
  //   try {
  //     lazada = await getLazadaProducts(category, pageNo);
  //   } catch (error) {
  //     lazada = [];
  //   }
  // }
  carousell = await getCarousellProducts(category, pageNo);
  iprice = await getIpriceProducts(category, pageNo);
  mudah = await getMudahMyProducts(category, pageNo);
  // currently, recommendations does not need to be stored as they will be added directly to the cart after user selects them

  const response = {
    // lazada,
    carousell,
    iprice,
    mudah,
  };

  res.status(200).json(response);
}
