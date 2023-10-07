class _Product {
  image: string = "";
  name: string = "";
  price: string = "";
  rating: string = "";
  seller_name: string = "";
  seller_location: string = "";
  url: string = "";
}

export default interface Product extends _Product {}

type ProductProps = Array<keyof Product>;

export const productProps: ProductProps = Object.keys(
  new _Product()
) as ProductProps;
