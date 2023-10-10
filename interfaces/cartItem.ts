class _CartItem {
  id: string = "";
  image: string = "";
  name: string = "";
  price: string = "";
  rating: string = "";
  seller_name: string = "";
  seller_location: string = "";
  url: string = "";
  source: string = "";
  quantity: string = "";
}

export default interface CartItem extends _CartItem {}

type CartItemProps = Array<keyof CartItem>;

export const cartItemProps: CartItemProps = Object.keys(
  new _CartItem()
) as CartItemProps;
