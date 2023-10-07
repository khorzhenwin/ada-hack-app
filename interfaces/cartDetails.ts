import Cart from "./cart";
import FirebaseDoc from "./firebaseDoc";

export interface CartDetails {
  cart: FirebaseDoc<Cart>;
}
