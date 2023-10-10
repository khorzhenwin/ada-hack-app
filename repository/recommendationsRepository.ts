import { recommendationsCoverter } from "../converters/recommendationsConverter";
import { db } from "../firebase";
import CartItem from "../interfaces/cartItem";
import Recommendations from "../interfaces/recommendations";
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

export const recommendationsCollectionPath = "recommendations";

export default class RecommendationsRepository {
  static ref = collection(db, recommendationsCollectionPath).withConverter(
    recommendationsCoverter
  );

  static snapshot = (
    callback: (snapshot: QuerySnapshot<DocumentData>) => void
  ) => onSnapshot(this.ref, callback);

  static findById = async (id: string) =>
    (await getDocs(query(this.ref, where("id", "==", id)))).docs.at(0);

  static findAllByChatId = async (id: string) =>
    await getDocs(query(this.ref, where("chatId", "==", id)));

  static findByUserId = async (id: string) =>
    (await getDocs(query(this.ref, where("id", "==", id)))).docs.at(0);

  static update = async (
    docRef: DocumentReference<Recommendations>,
    newValues: Partial<Recommendations>
  ) => {
    return runTransaction(db, async (txn) => {
      txn.update(docRef, newValues);
    });
  };

  static add = async (values: Recommendations) => {
    return await addDoc(RecommendationsRepository.ref, values);
  };

  static addItemsByUserId = async (userId: string, items: any) => {
    const docref = await RecommendationsRepository.findByUserId(userId);
    await RecommendationsRepository.update(docref!.ref, {
      iprice: items["iPrice"] ? items["iPrice"] : [],
      lazada: items["Lazada"] ? items["Lazada"] : [],
      mudah: items["Mudah.my"] ? items["Mudah.my"] : [],
      carousell: items["Carousell"] ? items["Carousell"] : [],
    });
  };

  // static addMessage = async (id: string, message: string) => {
  //   const docRef = await RecommendationsRepository.findById(id);
  //   const newMessage = {
  //     content: message,
  //   };
  //   await RecommendationsRepository.update(docRef!.ref, {
  //     messageHistory: [...docRef!.data().messageHistory, newMessage],
  //   });
  // };

  static findAll = async () => await getDocs(RecommendationsRepository.ref);
}
