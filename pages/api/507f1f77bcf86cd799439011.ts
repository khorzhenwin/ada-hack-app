import { is } from "cheerio/lib/api/traversing";
import CartItem from "../../interfaces/cartItem";
import RecommendationsRepository from "../../repository/recommendationsRepository";

const craftRecommendationsMessage = (recommendations: Array<any>) => {
  let message = "Here are some recommendations for you:\n\n";
  // for (const recommendation of recommendations) {
  //   message += `${recommendation.name}\nRM ${recommendation.price}\n${recommendation.url}\nSource: ${recommendation.source}\n\n`;
  // }

  // testing group by source
  const groupedBySource = {};
  recommendations.forEach((recommendation) => {
    const source = recommendation.source;
    groupedBySource[source] = groupedBySource[source] || [];
    groupedBySource[source].push(recommendation);
  });
  const resultArray: Array<Array<any>> = Object.values(groupedBySource);

  let count = 1;
  resultArray.forEach((recommendations) => {
    message += `=== *Source: ${recommendations[0].source}* ===\n`;
    recommendations.forEach((recommendation) => {
      message += `${count++}. *${recommendation.name}*\nRM ${
        recommendation.price
      }\n${recommendation.url}\n\n`;
    });
  });

  return message;
};

const callWhatsAppAPI = async (to, response) => {
  const message = {
    to: to,
    text: response,
  };

  const whatsappEndpoint = "https://ada-hack-app.vercel.app/api/whatsapp";
  const res = await fetch(whatsappEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });
  return Promise.resolve(res.json());
};

const callChatAPI = async (text, to) => {
  const body = {
    prompt: text,
    userId: to,
  };

  const chatEndpoint = "https://ada-hack-app.vercel.app/api/chat";
  const chatResponse = await fetch(chatEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return Promise.resolve(chatResponse.json());
};

const callKeywordsAPI = async (text) => {
  const keywordsEndpoint = "https://ada-hack-app.vercel.app/api/keywords";
  const keywordsResponse = await fetch(keywordsEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: text }),
  });
  return Promise.resolve(keywordsResponse.json());
};

const callRecommendationsAPI = async (keyword) => {
  const recommendationsEndpoint = `https://ada-hack-app.vercel.app/api/recommendations?category=${keyword}`;
  const recommendationsResponse = await fetch(recommendationsEndpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return Promise.resolve(recommendationsResponse.json());
};

const isAddToShoppingCart = (text: string) => {
  let sampleWordsForCart = [
    "cart",
    "buy",
    "buying",
    "order",
    "ordering",
    "shopping list",
    "purchase",
    "purchasing",
    "basket",
  ];
  return text.split(" ").some((word) => {
    sampleWordsForCart.includes(
      word.toLowerCase().replace(",", "").replace(".", "")
    );
  });
};

const getRecommendationFromDB = (text: string, userId: string) => {};

const callPostCartItemsAPI = async (item: CartItem) => {
  const postCartItemsEndpoint = `https://ada-hack-app.vercel.app/api/cart/items`;
  const postCartItemsResponse = await fetch(postCartItemsEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item: item, chatId: "" }),
  });
  return Promise.resolve(postCartItemsResponse.json());
};

const isCheckout = (text: String) => {
  let sampleWordsForCheckout = ["checkout"];
};

// POST Method
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not supported" });
    return;
  }

  const text = req.body.text.toString();
  const to = req.body.to.toString();

  // Check bearer token
  const bearerToken = req.headers.Authorization
    ? req.headers.Authorization
    : req.headers.authorization;
  if (!bearerToken || bearerToken !== "Ada@2023") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // check if text contains "recommend", "recommendations", "recommendation" or "suggestion" or "suggestions" or "suggestion" or "suggest" or "suggests" or "suggested"
  const chatWithLLM = [
    "recommend",
    "recommendations",
    "recommendation",
    "suggestion",
    "suggestions",
    "suggestion",
    "suggest",
    "suggests",
    "suggested",
    "e-commerce",
    "ecommerce",
    "platforms",
    "Malaysia",
  ];

  const words = text.split(" ");
  const hasRecommendation = words.some((word) => chatWithLLM.includes(word));

  if (hasRecommendation) {
    res.status(200).json({ message: "success" });
    // get keywords from /api/keywords
    const keywordsResponse = await callKeywordsAPI(text);
    // const keywords = keywordsResponse.keywords.split(",");

    const recommendations = [];
    let counter = 0;

    const keywords = ["party"];

    // fetch recommendations from /api/recommendations
    for (const keyword of keywords) {
      // push 1 recommendation from each source for each keyword
      const recommendationsResponse = await callRecommendationsAPI(
        keyword.toLowerCase().replace(/\s+/g, "-")
      );

      if (recommendationsResponse.lazada.length > 0) {
        recommendationsResponse.lazada[0].source = "Lazada";
        recommendations.push(recommendationsResponse.lazada[0]);
      }
      if (recommendationsResponse.carousell.length > 0) {
        recommendationsResponse.carousell[0].source = "Carousell";
        recommendations.push(recommendationsResponse.carousell[0]);
      }
      if (recommendationsResponse.mudah.length > 0) {
        recommendationsResponse.mudah[0].source = "Mudah.my";
        recommendations.push(recommendationsResponse.mudah[0]);
      }
      if (recommendationsResponse.iprice.length > 0) {
        recommendationsResponse.iprice[0].source = "iPrice";
        recommendations.push(recommendationsResponse.iprice[0]);
      }
      counter++;

      // if counter is 3, break. Failsafe from spam calling
      if (counter === 3) break;
    }

    // testing group by source
    const groupedBySource = {};
    recommendations.forEach((recommendation) => {
      const source = recommendation.source;
      groupedBySource[source] = groupedBySource[source] || [];
      groupedBySource[source].push(recommendation);
    });

    // testing implementing adding recommendations to db so it can be accessed when adding to cart
    // RecommendationsRepository.addItemsByUserId(to, groupedBySource);

    // call /api/whatsapp to send message to user
    await callWhatsAppAPI(to, craftRecommendationsMessage(recommendations));
    return;
  } else if (isAddToShoppingCart(text)) {
    res.status(200).json({ message: "success" });
    // await callPostCartItemsAPI(item);
  } else {
    res.status(200).json({ message: "success" });
    // chat with LLM by calling /api/chat
    const chatResponse = await callChatAPI(text, to);

    // call /api/whatsapp to send message to user
    await callWhatsAppAPI(to, chatResponse.response);
    return;
  }
}
