
const { TextServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/text-bison-001";
const API_KEY = "AIzaSyB6HpoBsj72rQ0-2S37DtBC4JSVtGXGhbc";

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const promptString = `what is the weather today in malaysia?`;
const stopSequences = [];

function sendPrompt(promptString) {
    return client.generateText({
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
  max_output_tokens: 1024,
  // optional, sequences at which to stop model generation
  stop_sequences: stopSequences,
  // optional, safety settings
  safety_settings: [{"category":"HARM_CATEGORY_DEROGATORY","threshold":1},{"category":"HARM_CATEGORY_TOXICITY","threshold":1},{"category":"HARM_CATEGORY_VIOLENCE","threshold":2},{"category":"HARM_CATEGORY_SEXUAL","threshold":2},{"category":"HARM_CATEGORY_MEDICAL","threshold":2},{"category":"HARM_CATEGORY_DANGEROUS","threshold":2}],
  prompt: {
    text: promptString,
  },
});
}

export default async function handler(req, res) {
    try {
        const response = await sendPrompt(promptString);
    
        console.log(JSON.stringify(response, null, 2));
    
        res.status(200).json(response);
      } catch (error) {
       console.log(error);
      }
    }
    