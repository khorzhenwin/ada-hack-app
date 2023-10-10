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

const callChatAPI = async (text, to) => {
  const body = {
    prompt: text,
    userId: to,
  };

  const chatEndpoint = "https://ada-hack-app.vercel.app/v2/api/chat";
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

const callRecommendationsAPI = async (keywords, to) => {
  const body = {
    keywords: keywords,
    to: to,
  };

  const recommendationsEndpoint = `https://ada-hack-app.vercel.app/api/v2/recommendations`;
  const recommendationsResponse = await fetch(recommendationsEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  try {
    const resp = recommendationsResponse.json();
    return Promise.resolve(resp);
  } catch {
    return null;
  }
};

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
    return sampleWordsForCart.includes(
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

  const recommendedProducts = await RecommendationsRepository.findByUserId(
    userId
  );

  if (
    recommendedProducts.data() !== (null || undefined) &&
    recommendedProducts.exists()
  ) {
    // const sortedRecommendedProducts = [
    //   ...recommendedProducts.data().lazada,
    //   ...recommendedProducts.data().carousell,
    //   ...recommendedProducts.data().mudah,
    //   ...recommendedProducts.data().iprice,
    // ];

    // var cart = [];
    // sortedChoices.forEach((choice) => {
    //   let product = sortedRecommendedProducts[parseInt(choice[0]) - 1];
    //   product["quantity"] = choice[1] ? choice[1] : "1";

    //   cart.push(product);
    // });

    // await callPostCartItemsAPI(cart, userId);

    // return "Items selected have been added to your cart!";
    return recommendedProducts.data();
  }

  return { text: "Your recommendation products are corrupted!" };
};

const callPostCartItemsAPI = async (item: CartItem[], userId: string) => {
  const postCartItemsEndpoint = `https://ada-hack-app.vercel.app/api/cart/items`;
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
  return text.split(" ").some((word) => {
    let cleaned = word.toLowerCase().replace(",", "").replace(".", "");
    if (sampleInitialWordsForViewCart.includes(cleaned)) indicator++;

    if (sampleDeterminerWordsForViewCart.includes(cleaned) && indicator === 1)
      return true;
  });
};

const callGetCartItemsAPI = async (userId: string) => {
  const getCartItemsEndpoint = `https://ada-hack-app.vercel.app/api/cart/items?userId=${userId}`;
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

  const words = text.split(" ");
  const hasRecommendation = words.some((word) => chatWithLLM.includes(word));

  if (hasRecommendation) {
    res.status(200).json({ message: "success at recommendation" });
    // get keywords from /api/keywords
    const keywordsResponse = await callKeywordsAPI(text);
    await callRecommendationsAPI(keywordsResponse.keywords, to);

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
      "Proceeding to checkout now.\nhttps://i.postimg.cc/wjhj8xDB/check-out-995885ujjrj.jpg"
    );
    return;
  } else {
    res.status(200).json({ message: "success at error" });
    // chat with LLM by calling /api/chat
    await callChatAPI(text, to);
    return;
  }
}
