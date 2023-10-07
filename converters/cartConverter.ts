import Cart, { cartProps } from "../interfaces/cart";
import { pick } from "../util/propertyHelper";
import {
  DocumentData,
  FirestoreDataConverter,
  WithFieldValue,
} from "firebase/firestore";

export const cartCoverter: FirestoreDataConverter<Cart> = {
  toFirestore(cart: WithFieldValue<Cart>): DocumentData {
    return pick<DocumentData>(cart, cartProps);
  },
  fromFirestore(snapshot, options): Cart {
    const data = snapshot.data(options)!;
    return pick<Cart>(data, cartProps);
  },
};
