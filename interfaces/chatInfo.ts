import Chat from "./chat";
import FirebaseDoc from "./firebaseDoc";

export interface ChatInfo {
  chat: FirebaseDoc<Chat>;
}
