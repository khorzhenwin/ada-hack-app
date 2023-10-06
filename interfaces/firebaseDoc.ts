import { DocumentReference } from "firebase/firestore";

export default interface FirebaseDoc<T> {
  ref?: DocumentReference<T>;
  data?: T;
}
