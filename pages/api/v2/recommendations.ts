import {
  getCarousellProducts,
  getIpriceProducts,
  getMudahMyProducts,
  getLazadaProducts,
} from "../../../data/scraping";
import { getLazadaProductsFromAPI } from "../../../data/api";
import { v4 as uuidv4 } from "uuid";
import RecommendationsRepository from "../../../repository/recommendationsRepository";

// POST Method
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { category, pageNo = 1 } = req.query;
  if (!category) {
    res.status(400).json({ message: "Missing query parameters" });
    return;
  }

  const to = req.body.to.toString();
  res.status(200).json({ message: "success" });

  const keywords = req.body.keywords.split(",");

  const recommendations = [];
  let counter = 0;

  // fetch recommendations from /api/recommendations
  for (const keyword of keywords) {
    // push 1 recommendation from each source for each keyword
    const carousell = await getCarousellProducts(keyword, pageNo);
    const iprice = await getIpriceProducts(keyword, pageNo);
    const mudah = await getMudahMyProducts(keyword, pageNo);

    if (carousell.length > 0) {
      carousell[0]["source"] = "Carousell";
      recommendations.push(carousell[0]);
    }
    if (mudah.length > 0) {
      mudah[0]["source"] = "Mudah.my";
      recommendations.push(mudah[0]);
    }
    if (iprice.length > 0) {
      iprice[0]["source"] = "iPrice";
      recommendations.push(iprice[0]);
    }
    counter++;

    // if counter is 3, break. Failsafe from spam calling
    if (counter === 3) break;
  }

  if (recommendations.length === 0) {
    await callWhatsAppAPI(
      to,
      "Sorry, we couldn't find any recommendations for you. Please try again."
    );
    return;
  }

  // testing group by source
  const groupedBySource = {};
  recommendations.forEach((recommendation) => {
    const source = recommendation.source;
    groupedBySource[source] = groupedBySource[source] || [];
    groupedBySource[source].push(recommendation);
  });

  RecommendationsRepository.addItemsByUserId(to, groupedBySource);
  await callWhatsAppAPI(to, craftRecommendationsMessage(recommendations));
}

const callWhatsAppAPI = async (to, response) => {
  const message = {
    to: to.toString(),
    text: response.toString(),
  };

  const whatsappEndpoint = "https://ada-hack-app.vercel.app/api/whatsapp";
  const res = await fetch(whatsappEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  return Promise.resolve(res.json());
};

const craftRecommendationsMessage = (recommendations: Array<any>) => {
  let message = "Here are some recommendations for you:\n\n";
  const groupedBySource = {};
  recommendations.forEach((recommendation) => {
    const source = recommendation.source;
    groupedBySource[source] = groupedBySource[source] || [];
    groupedBySource[source].push(recommendation);
  });
  const resultArray: Array<Array<any>> = Object.values(groupedBySource);

  let count = 1;
  resultArray.forEach((recommendations) => {
    message += `===== *Source: ${recommendations[0].source}* =====\n`;
    recommendations.forEach((recommendation) => {
      message += `${count++}. *${recommendation.name}*\nRM ${
        recommendation.price
      }\n${recommendation.url}\n\n`;
    });
  });

  return message;
};
