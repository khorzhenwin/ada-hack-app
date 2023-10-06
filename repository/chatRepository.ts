import { chatCoverter } from "../converters/chatConverter";
import { db } from "../firebase";
import Chat from "../interfaces/chat";
import {
  DocumentData,
  DocumentReference,
  QuerySnapshot,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  where,
} from "firebase/firestore";

export const chatCollectionPath = "chat";

export default class ChatRepository {
  static ref = collection(db, chatCollectionPath).withConverter(chatCoverter);

  static snapshot = (
    callback: (snapshot: QuerySnapshot<DocumentData>) => void
  ) => onSnapshot(this.ref, callback);

  static findById = async (id: string) =>
    (await getDocs(query(this.ref, where("id", "==", id)))).docs.at(0);

  static update = async (
    docRef: DocumentReference<Chat>,
    newValues: Partial<Chat>
  ) => {
    return runTransaction(db, async (txn) => {
      txn.update(docRef, newValues);
    });
  };

  static add = async (values: Chat) => {
    return await addDoc(ChatRepository.ref, values);
  };

  static addMessage = async (id: string, message: string) => {
    const docRef = await ChatRepository.findById(id);
    const newMessage = {
      content: message,
    };
    await ChatRepository.update(docRef!.ref, {
      messageHistory: [...docRef!.data().messageHistory, newMessage],
    });
  };

  static findAll = async () => await getDocs(ChatRepository.ref);
}
