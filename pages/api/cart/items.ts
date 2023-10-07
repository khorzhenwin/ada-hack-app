import { v4 as uuidv4 } from "uuid";
import CartRepository from "../../../repository/cartRepository";
import CartItem from "../../../interfaces/cartItem";

// GET & POST Method
export default async function handler(req, res) {
  // ----------------------------------- GET Method ----------------------------------- //
  if (req.method === "GET") {
    let { chatId, id } = req.query;

    if (chatId) {
      const cartItems = await CartRepository.findCartItemsByChatId(chatId);
      res.status(200).json(cartItems);
      return;
    }

    id = id ? id : "default";
    const cartItems = await CartRepository.findCartItemsById(id);
    res.status(200).json(cartItems);
    return;
  }

  // ----------------------------------- POST Method ----------------------------------- //
  if (req.method === "POST") {
    const chatId: string = req.body.chatId;
    req.body.item.id = uuidv4();
    const item: CartItem = req.body.item;

    await CartRepository.addItem(chatId, item);
    res.status(200).json({ message: "Item added to cart" });
    return;
  }

  // ----------------------------------- DELETE Method ----------------------------------- //
  if (req.method === "DELETE") {
    const { id, chatId, itemId } = req.query;

    if ((id || chatId) && itemId) {
      if (chatId) await CartRepository.removeItemByChatId(chatId, itemId);
      else if (id) await CartRepository.removeItemById(id, itemId);

      res.status(200).json({ message: "Item removed from cart" });
      return;
    } else {
      res.status(400).json({ message: "Missing query parameters" });
      return;
    }
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
}
