const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = "AIzaSyBmScMvJjskCvG2kEeDTvtCkBegdAK4zXY ";

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const context = "";
const examples = [];

// this is a POST method
export default function handler(req, res) {
  const prompt = req.body.prompt;

  addMessage({
    content: prompt,
    isUser: true,
  });

  addMessage({
    content: "NEXT REQUEST",
    isUser: false,
  });

  client
    .generateMessage({
      // required, which model to use to generate the result
      model: MODEL_NAME,
      // optional, 0.0 always uses the highest-probability result
      temperature: 0.25,
      // optional, how many candidate results to generate
      candidateCount: 1,
      // optional, number of most probable tokens to consider for generation
      top_k: 40,
      // optional, for nucleus sampling decoding strategy
      top_p: 0.95,
      prompt: {
        // optional, sent on every request and prioritized over history
        context: context,
        // optional, examples to further finetune responses
        examples: examples,
        // required, alternating prompt/response messages
        messages: messages,
      },
    })
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
      res.status(200).json({
        prompt: result[0].messages[0].content.replace(/<br>/g, "\n"),
        response: result[0].candidates[0].content.replace(/<br>/g, "\n"),
      });
    });
}
