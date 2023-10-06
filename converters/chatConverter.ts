import Chat, { chatProps } from "../interfaces/chat";
import { pick } from "../util/propertyHelper";
import {
  DocumentData,
  FirestoreDataConverter,
  WithFieldValue,
} from "firebase/firestore";

export const chatCoverter: FirestoreDataConverter<Chat> = {
  toFirestore(chat: WithFieldValue<Chat>): DocumentData {
    return pick<DocumentData>(chat, chatProps);
  },
  fromFirestore(snapshot, options): Chat {
    const data = snapshot.data(options)!;
    return pick<Chat>(data, chatProps);
  },
};
