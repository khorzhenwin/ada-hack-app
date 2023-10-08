const { TextServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/text-bison-001";
const API_KEY = "AIzaSyB6HpoBsj72rQ0-2S37DtBC4JSVtGXGhbc";

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const input = '';
const promptString = `Pretend you are a consultant chatbot that helps in researching and recommending what the user should purchase, give a list of possible keywords for them to use and search. 
For example:
User: I feel decorating for my desk in my bed room for better study vibes or environment.

From the input above, possible keyword to search and purchase is : desk organizer, desk lamp, bulletin board, study chair, etc.
So provide back a keyword in array like:
["Desk Organizer", "Desk Lamp", "Bulletin Board", "Study Chair"]

Another Example:
User: I want to purchase something for my newly decorated kitchen.
output: ["Refrigerator", "Oven", "Plates", "Dish Towel", "Utensils"]

Provide whats commonly purchased based on your knowledge. Maximum different 5 items.
${input}`;
const stopSequences = [];

  // this is a POST method
  export default async function handler(req, res) {
    if (req.method !== "POST") {
      res.status(405).json({ message: "Method not allowed" });
      return;
    }

    
client.generateText({
  // required, which model to use to generate the result
  model: MODEL_NAME,
  // optional, 0.0 always uses the highest-probability result
  temperature: 0.7,
  // optional, how many candidate results to generate
  candidateCount: 1,
  // optional, number of most probable tokens to consider for generation
  top_k: 40,
  // optional, for nucleus sampling decoding strategy
  top_p: 0.95,
  // optional, maximum number of output tokens to generate
  max_output_tokens: 40,
  // optional, sequences at which to stop model generation
  stop_sequences: stopSequences,
  // optional, safety settings
  safety_settings: [{"category":"HARM_CATEGORY_DEROGATORY","threshold":1},{"category":"HARM_CATEGORY_TOXICITY","threshold":1},{"category":"HARM_CATEGORY_VIOLENCE","threshold":2},{"category":"HARM_CATEGORY_SEXUAL","threshold":2},{"category":"HARM_CATEGORY_MEDICAL","threshold":2},{"category":"HARM_CATEGORY_DANGEROUS","threshold":2}],
  prompt: {
    text: promptString,
  },
}).then(res => {
  console.log(JSON.stringify(res, null, 2));
});
  }