import { scrapeLazadaProducts } from "../../data/scraping/lazada";
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

  const lazada = await scrapeLazadaProducts(category, pageNo);
  // currently, recommendations does not need to be stored as they will be added directly to the cart after user selects them

  const response = {
    lazada,
  };

  res.status(200).json(response);
}
