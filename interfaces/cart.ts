import CartItem from "./cartItem";

class _Cart {
  id: string = "";
  chatId: string = "";
  userId: string = "";
  cartItems : CartItem[] = [];
}

export default interface Cart extends _Cart {}

type CartProps = Array<keyof Cart>;

export const cartProps: CartProps = Object.keys(new _Cart()) as CartProps;
