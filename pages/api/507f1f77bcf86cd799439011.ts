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
    message += `===== *Source: ${recommendations[0].source}* =====\n`;
    recommendations.forEach((recommendation) => {
      message += `${count++}. *${recommendation.name}*\nRM ${
        recommendation.price
      }\n${recommendation.url}\n\n`;
    });
  });

  return message;
};

const craftCartMessage = (cartItems: CartItem[]) => {
  var message = "This is the overall view of your cart:\n\n";
  var source = cartItems[0].source;
  var count = 1;
  var subtotal = 0;
  var total = 0;

  message += `===== *Platform: ${source}* =====`;

  cartItems.forEach((item, i) => {
    message += `${count}. *${item.name}*\nPrice: RM ${item.price}\nQuantity: ${item.quantity}\n\n`;

    subtotal += parseFloat(item.price) * parseInt(item.quantity);

    if (source !== cartItems[i + 1].source) {
      total += subtotal;
      subtotal = 0;
      message += `*===> Subtotal: RM ${subtotal}*\n\n===== Platform: ${
        cartItems[i + 1].source
      } =====`;
      source = cartItems[i + 1].source;
    }
  });

  total += subtotal;

  message += `*===> Subtotal: RM ${subtotal}*\n\n========\n*Total: RM ${total}*\n========`;
};

const callWhatsAppAPI = async (to, response) => {
  const message = {
    to: to,
    text: response,
  };

  const whatsappEndpoint = "https://b1a0-192-228-206-41.ngrok-free.app/api/whatsapp";
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

  const chatEndpoint = "https://b1a0-192-228-206-41.ngrok-free.app/api/chat";
  const chatResponse = await fetch(chatEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return Promise.resolve(chatResponse.json());
};

const callKeywordsAPI = async (text) => {
  const keywordsEndpoint = "https://b1a0-192-228-206-41.ngrok-free.app/api/keywords";
  const keywordsResponse = await fetch(keywordsEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: text }),
  });
  return Promise.resolve(keywordsResponse.json());
};

const callRecommendationsAPI = async (keyword) => {
  const recommendationsEndpoint = `https://b1a0-192-228-206-41.ngrok-free.app/api/recommendations?category=${keyword}`;
  const recommendationsResponse = await fetch(recommendationsEndpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (recommendationsResponse) {
    return Promise.resolve(recommendationsResponse.json());
  } else {
    return null;
  }
};

const isAddToShoppingCart = (text: string) => {
  let sampleWordsForCart = [
    "cart",
    "buy",
    "buying",
    "order",
    "ordering",
    "list",
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

const addChoicesToCart = async (text: string, userId: string) => {
  // assume the user says "I want to buy number 1-2,2-5,5,6" like that
  // format: (product_number)-(quantity)

  var productChoices = [];

  const words = text.split(/[ ,]/).filter((word) => word != "");

  words.forEach((word) => {
    if (!isNaN(Number(word.split("-")[0]))) {
      let choice = word.split("-");
      productChoices.push(choice);
    }
  });

  const sortedChoices = productChoices.sort(
    (a, b) => parseInt(a[0]) - parseInt(b[0])
  );

  const recommendedProducts = (
    await RecommendationsRepository.findByUserId(userId)
  ).data();

  const sortedRecommendedProducts = [
    ...recommendedProducts.lazada,
    ...recommendedProducts.carousell,
    ...recommendedProducts.mudah,
    ...recommendedProducts.iprice,
  ];

  var cart: CartItem[] = [];
  sortedChoices.forEach((choice) => {
    let product = sortedRecommendedProducts[parseInt(choice[0]) - 1];
    product["quantity"] = choice[1] ? choice[1] : "1";

    cart.push(product as any);
  });

  await callPostCartItemsAPI(cart, userId);

  return "Items selected have been added to your cart!";
};

const callPostCartItemsAPI = async (item: CartItem[], userId: string) => {
  const postCartItemsEndpoint = `https://b1a0-192-228-206-41.ngrok-free.app/api/cart/items`;
  const postCartItemsResponse = await fetch(postCartItemsEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item: item, userId: userId }),
  });
  return Promise.resolve(postCartItemsResponse.json());
};

const isViewShoppingCart = (text: string) => {
  let sampleInitialWordsForViewCart = ["view", "see", "look"];

  let sampleDeterminerWordsForViewCart = [
    "cart",
    "product",
    "products",
    "item",
    "items",
  ];

  var indicator = 0;
  text.split(" ").forEach((word) => {
    let cleaned = word.toLowerCase().replace(",", "").replace(".", "");
    if (sampleInitialWordsForViewCart.includes(cleaned)) indicator++;

    if (sampleDeterminerWordsForViewCart.includes(cleaned) && indicator === 1)
      return true;
  });

  return false;
};

const callGetCartItemsAPI = async (userId: string) => {
  const getCartItemsEndpoint = `https://b1a0-192-228-206-41.ngrok-free.app/api/cart/items?userId=${userId}`;
  const getCartItemsResponse = await fetch(getCartItemsEndpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return Promise.resolve(getCartItemsResponse.json());
};

// Keyword detection for checkout (can check)
const isCheckout = (text: string) => {
  let sampleWordsForCheckout = ["checkout"];
  return text.split(" ").some((word) => {
    return sampleWordsForCheckout.includes(
      word.toLowerCase().replace(",", "").replace(".", "")
    );
  });
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
    const keywords = keywordsResponse.keywords.split(",");

    const recommendations = [];
    let counter = 0;

    // fetch recommendations from /api/recommendations
    for (const keyword of keywords) {
      // push 1 recommendation from each source for each keyword
      const recommendationsResponse = await callRecommendationsAPI(
        keyword.toLowerCase().replace(/\s+/g, "-").trim()
      );

      // if (recommendationsResponse.lazada.length > 0) {
      //   recommendationsResponse.lazada[0].source = "Lazada";
      //   recommendations.push(recommendationsResponse.lazada[0]);
      // }
      if (recommendationsResponse.carousell && recommendationsResponse.carousell.length > 0) {
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
    RecommendationsRepository.addItemsByUserId(to, groupedBySource);

    // call /api/whatsapp to send message to user
    await callWhatsAppAPI(to, craftRecommendationsMessage(recommendations));
    return;
  } else if (isAddToShoppingCart(text)) {
    res.status(200).json({ message: "success at add to cart" });
    const result = await addChoicesToCart(text, to);

    // call /api/whatsapp to send message to user
    await callWhatsAppAPI(to, result);
    return;
  } else if (isViewShoppingCart(text)) {
    res.status(200).json({ message: "success at view cart" });
    const cart = await callGetCartItemsAPI(to);
    const cartItems = cart.cartItems;

    // call /api/whatsapp to send message to user
    await callWhatsAppAPI(to, craftCartMessage(cartItems));
    return;
  } else if (isCheckout(text)) {
    res.status(200).json({ message: "success at checkout" });

    await callWhatsAppAPI(
      to,
      "Proceeding to checkout now.\n[insert link to checkout screenshot here]"
    );
    return;
  } else {
    res.status(200).json({ message: "success" });
    // chat with LLM by calling /api/chat
    const chatResponse = await callChatAPI(text, to);

    // call /api/whatsapp to send message to user
    await callWhatsAppAPI(to, chatResponse.response);
    return;
  }
}
