const env = require("../../util/env.json");

// POST Method
export default async function handler(req, res) {
  const { text, to } = req.body;

  // Check bearer token
  const bearerToken = req.headers.authorization;
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

  if (!hasRecommendation) {
    // chat with LLM by calling /api/chat
    const body = {
      prompt: text,
      userId: to,
    };

    const chatEndpoint = `${env.path.production}/api/chat`;
    const chatResponse = await fetch(chatEndpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());

    // call /api/whatsapp to send message to user
    const message = {
      to: to,
      text: chatResponse.response,
    };
    const whatsappEndpoint = `${env.path.production}/api/whatsapp`;
    await fetch(whatsappEndpoint, {
      method: "POST",
      body: JSON.stringify(message),
    }).then((res) => res.json());

    return res.status(200).json({ message: "success" });
  } else {
    // get keywords from /api/keywords
    const keywordsEndpoint = `${env.path.production}/api/keywords`;
    const keywordsResponse = await fetch(keywordsEndpoint, {
      method: "POST",
      body: JSON.stringify({ input: text }),
    }).then((res) => res.json());

    const recommendations = [];
    let counter = 0;
    // fetch recommendations from /api/recommendations
    for (const keyword of keywordsResponse.keywords) {
      // push 1 recommendation from each source for each keyword
      const recommendationsEndpoint = `${env.path.production}/api/recommendations?category=${keyword}`;
      const recommendationsResponse = await fetch(recommendationsEndpoint, {
        method: "GET",
      }).then((res) => res.json());
      recommendations.push(recommendationsResponse.lazada[0]);
      recommendations.push(recommendationsResponse.carousell[0]);
      recommendations.push(recommendationsResponse.mudah[0]);
      recommendations.push(recommendationsResponse.iprice[0]);
      counter++;

      // if counter is 3, break. Failsafe from spam calling
      if (counter === 3) break;
    }

    // call /api/whatsapp to send message to user
    const message = {
      to: to,
      text: craftRecommendationsMessage(recommendations),
    };
    const whatsappEndpoint = `${env.path.production}/api/whatsapp`;
    await fetch(whatsappEndpoint, {
      method: "POST",
      body: JSON.stringify(message),
    }).then((res) => res.json());

    return res.status(200).json({ message: "success" });
  }
}

const craftRecommendationsMessage = (recommendations) => {
  let message = "Here are some recommendations for you:\n\n";
  for (const recommendation of recommendations) {
    message += `${recommendation.name}\n${recommendation.price}\n${recommendation.url}\n\n`;
  }
  return message;
};
