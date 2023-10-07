import ChatRepository from "../../repository/chatRepository";
import Chat from "../../interfaces/chat";
import { Query, QueryDocumentSnapshot } from "firebase/firestore";
import Context from "../../interfaces/context";
import { v4 as uuidv4 } from "uuid";

const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = "AIzaSyBmScMvJjskCvG2kEeDTvtCkBegdAK4zXY ";

const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const context = "";
const examples = [];

const createNewChat = (userId: string) => {
  const newChat: Chat = {
    id: uuidv4(),
    userId: userId,
    status: "ACTIVE",
    messageHistory: [],
  };
  // add a new chat
  ChatRepository.add(newChat);
  return newChat;
};

const findActiveChatByUserId = async (userId: string) => {
  const chatSnapshot = await ChatRepository.findAllByUserId(userId);

  // find the first active chat or create new chat
  for (const chat of chatSnapshot.docs) {
    if (chat.data() && chat.data().status === "ACTIVE") {
      return chat.data();
    }
    return createNewChat(userId);
  }
  return createNewChat(userId);
};

const updateChatToInactive = async (chatId: string) => {
  const doc = await ChatRepository.findById(chatId);
  await ChatRepository.update(doc!.ref, {
    status: "INACTIVE",
  });
};

// this is a POST method
export default async function handler(req, res) {
  const prompt = req.body.prompt;
  const userId = req.body.userId ? req.body.userId : "default";
  const signal: string = req.body.signal ? req.body.signal : "NEXT REQUEST";
  const chat: Chat = await findActiveChatByUserId(userId);
  const messages: Context[] | any = chat.messageHistory;

  messages.push({
    content: signal,
  });

  if (signal === "NEXT REQUEST") {
    messages.push({
      content: prompt,
    });
  } else {
    messages.push({
      content: signal,
    });
    updateChatToInactive(chat.id);
  }

  client
    .generateMessage({
      model: MODEL_NAME,
      temperature: 0.25,
      candidateCount: 1,
      top_k: 30,
      top_p: 0.95,
      prompt: {
        context: context,
        examples: examples,
        messages: messages,
      },
    })
    .then((result) => {
      // replace any <br>, \n, etc. with a space
      const response = result[0].candidates[0].content.replace(
        /(<([^>]+)>)/gi,
        " "
      );

      res.status(200).json({
        prompt: prompt,
        response: response,
      });

      // save in database
      ChatRepository.addMessage(chat.id, prompt).then(() =>
        ChatRepository.addMessage(chat.id, response)
      );
    });
}
