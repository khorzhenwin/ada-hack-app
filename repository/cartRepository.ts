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
import CartItem from "../interfaces/cartItem";

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

  static findByChatId = async (id: string) =>
    (await getDocs(query(this.ref, where("chatId", "==", id)))).docs.at(0);

  static findByUserId = async (id: string) =>
    (await getDocs(query(this.ref, where("userId", "==", id)))).docs.at(0);

  static findCartItemsByChatId = async (id: string) =>
    (await getDocs(query(this.ref, where("chatId", "==", id)))).docs
      .at(0)
      .data().cartItems;

  static findCartItemsById = async (id: string) =>
    (await getDocs(query(this.ref, where("id", "==", id)))).docs.at(0).data()
      .cartItems;

  static findCartItemsByUserId = async (id: string) =>
    (await getDocs(query(this.ref, where("userId", "==", id)))).docs
      .at(0)
      .data().cartItems;

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

  static addItemByChatId = async (chatId: string, item: CartItem) => {
    const docRef = await CartRepository.findByChatId(chatId);
    await CartRepository.update(docRef!.ref, {
      cartItems: [...docRef!.data().cartItems, item],
    });
  };

  static addItemByUserId = async (userId: string, item: CartItem) => {
    const docRef = await CartRepository.findByChatId(userId);
    await CartRepository.update(docRef!.ref, {
      cartItems: [...docRef!.data().cartItems, item],
    });
  };

  static removeItemByChatId = async (chatId: string, itemId: string) => {
    const docRef = await CartRepository.findByChatId(chatId);
    const newCartItems = docRef!
      .data()
      .cartItems.filter((item) => item.id !== itemId);
    await CartRepository.update(docRef!.ref, {
      cartItems: newCartItems,
    });
  };

  static removeItemById = async (id: string, itemId: string) => {
    const docRef = await CartRepository.findById(id);
    const newCartItems = docRef!
      .data()
      .cartItems.filter((item) => item.id !== itemId);
    await CartRepository.update(docRef!.ref, {
      cartItems: newCartItems,
    });
  };

  static removeItemByUserId = async (id: string, itemId: string) => {
    const docRef = await CartRepository.findByUserId(id);
    const newCartItems = docRef!
      .data()
      .cartItems.filter((item) => item.id !== itemId);
    await CartRepository.update(docRef!.ref, {
      cartItems: newCartItems,
    });
  };

  static wildcardRemoveItemByUserId = async (
    userId: string,
    itemName: string
  ) => {
    const docRef = await CartRepository.findByUserId(userId);
    const newCartItems = docRef!
      .data()
      .cartItems.filter((item) => !item.name.includes(itemName));
    await CartRepository.update(docRef!.ref, {
      cartItems: newCartItems,
    });
  };

  static wildcardRemoveItemByChatId = async (
    chatId: string,
    itemName: string
  ) => {
    const docRef = await CartRepository.findByChatId(chatId);
    const newCartItems = docRef!
      .data()
      .cartItems.filter((item) => !item.name.includes(itemName));
    await CartRepository.update(docRef!.ref, {
      cartItems: newCartItems,
    });
  };

  static findAll = async () => await getDocs(CartRepository.ref);
}
