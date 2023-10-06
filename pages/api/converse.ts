import ChatRepository from "../../repository/chatRepository";
import Chat from "../../interfaces/chat";
import { QueryDocumentSnapshot } from "firebase/firestore";
import Context from "../../interfaces/context";

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
export default async function handler(req, res) {
  const signal: string = req.body.signal ? req.body.signal : "NEXT REQUEST";
  const TEST_CHAT = await ChatRepository.findAll().then((snapshot) => {
    const first = snapshot.docs[0] as QueryDocumentSnapshot<Chat>;

    if (first === undefined || (!first.exists && snapshot.empty)) {
      const newChat: Chat = {
        id: "1",
        userId: "1",
        status: "ACTIVE",
        messageHistory: [],
      };
      // add a new chat
      ChatRepository.add(newChat);
      return newChat;
    } else {
      return first.data();
    }
  });

  const messages: Context[] | any = TEST_CHAT.messageHistory;

  const prompt = req.body.prompt;

  if (signal === "NEXT REQUEST") {
    messages.push({
      content: signal,
    });

    messages.push({
      content: prompt,
    });
  } else {
    messages.push({
      content: signal,
    });

    // update status to INACTIVE
    const doc = await ChatRepository.findById(TEST_CHAT.id);
    await ChatRepository.update(doc.ref, {
      status: "INACTIVE",
    });
  }

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
      // replace any <br>, \n, etc. with a space
      const response = result[0].candidates[0].content.replace(
        /(<([^>]+)>)/gi,
        " "
      );
      // save in database
      ChatRepository.addMessage(TEST_CHAT.id, prompt).then(() =>
        ChatRepository.addMessage(TEST_CHAT.id, response)
      );

      res.status(200).json({
        prompt: prompt,
        response: response,
      });
    });
}
