import {
  getCarousellProducts,
  getIpriceProducts,
  getMudahMyProducts,
  getLazadaProducts,
} from "../../data/scraping/";
import { v4 as uuidv4 } from "uuid";
import RecommendationsRepository from "../../repository/recommendationsRepository";
import Recommendations from "../../interfaces/recommendations";

// POST Method
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { category, pageNo } = req.body;

  const lazada = await getLazadaProducts(category, pageNo);
  const carousell = await getCarousellProducts(category);
  const iprice = await getIpriceProducts(category);
  const mudah = await getMudahMyProducts(category);
  // currently, recommendations does not need to be stored as they will be added directly to the cart after user selects them

  const response = {
    lazada,
    carousell,
    iprice,
    mudah,
  };

  res.status(200).json(response);
}
