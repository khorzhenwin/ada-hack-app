const { TextServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/text-bison-001";
const API_KEY = "AIzaSyB6HpoBsj72rQ0-2S37DtBC4JSVtGXGhbc";

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

// this is a POST method
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const input = req.body.input;

  const promptString = `Pretend you are a consultant chatbot that helps in researching and recommending what the user from Malaysia should purchase through e-commerce website, give a list of possible keywords for them to use and search. 
    For example:
    User: I feel decorating for my desk in my bed room for better study vibes or environment.
  
    From the input above, possible keyword to search and purchase is : desk organizer, desk lamp, bulletin board, study chair, etc.
    So provide back a pure sentence split with comma like:
    Desk Organizer,Desk Lamp,Bulletin Board,Study Chair
  
    Another Example:
    User: I want to purchase something for my newly decorated kitchen.
    output: Refrigerator,Oven,Plates,Dish Towel,Utensils

    Rules:
    1. Provide whats commonly purchased based on your knowledge. 
    2. Provide between 1 - 5 different type of items. 
    3. Every comma should not have any blank spaces. 
    4. If user mention brand, make sure to add the product's type like "Adidas Sneakers".
    5. If you can't understand, just return empty response.

    ${input}`;

  const stopSequences = [];

  client
    .generateText({
      model: MODEL_NAME,
      temperature: 0.75,
      candidateCount: 1,
      top_k: 40,
      top_p: 0.8,
      max_output_tokens: 40,
      stop_sequences: stopSequences,
      safety_settings: [
        { category: "HARM_CATEGORY_DEROGATORY", threshold: 1 },
        { category: "HARM_CATEGORY_TOXICITY", threshold: 1 },
        { category: "HARM_CATEGORY_VIOLENCE", threshold: 2 },
        { category: "HARM_CATEGORY_SEXUAL", threshold: 2 },
        { category: "HARM_CATEGORY_MEDICAL", threshold: 2 },
        { category: "HARM_CATEGORY_DANGEROUS", threshold: 2 },
      ],
      prompt: {
        text: promptString,
      },
    })
    .then((result) => {
      const output = result[0].candidates[0].output;
      res.status(200).json({ keywords: output });
    });
}
