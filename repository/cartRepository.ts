import { cartCoverter } from "../converters/cartConverter";
import { db } from "../firebase";
import Cart from "../interfaces/cart";
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

export const cartCollectionPath = "cart";

export default class CartRepository {
  static ref = collection(db, cartCollectionPath).withConverter(cartCoverter);

  static snapshot = (
    callback: (snapshot: QuerySnapshot<DocumentData>) => void
  ) => onSnapshot(this.ref, callback);

  static findById = async (id: string) =>
    (await getDocs(query(this.ref, where("id", "==", id)))).docs.at(0);

  static findAllByUserId = async (id: string) =>
    await getDocs(query(this.ref, where("userId", "==", id)));

  // this should always only return 1 chat
  static findAllActiveByUserId = async (id: string) =>
    await getDocs(
      query(
        this.ref,
        where("userId", "==", id),
        where("status", "==", "ACTIVE")
      )
    );

  static update = async (
    docRef: DocumentReference<Cart>,
    newValues: Partial<Cart>
  ) => {
    return runTransaction(db, async (txn) => {
      txn.update(docRef, newValues);
    });
  };

  static add = async (values: Cart) => {
    return await addDoc(CartRepository.ref, values);
  };

  static addMessage = async (id: string, message: string) => {
    const docRef = await CartRepository.findById(id);
    const newMessage = {
      content: message,
    };
    await CartRepository.update(docRef!.ref, {
        // cartItems: [...docRef!.data().cartItems, newMessage],
    });
  };

  static findAll = async () => await getDocs(CartRepository.ref);
}
