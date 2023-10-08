import { v4 as uuidv4 } from "uuid";
import CartRepository from "../../../repository/cartRepository";
import CartItem from "../../../interfaces/cartItem";

// GET & POST Method
export default async function handler(req, res) {
  // ----------------------------------- GET Method ----------------------------------- //
  if (req.method === "GET") {
    let { chatId, id } = req.query;

    if (id) {
      const cartItems = await CartRepository.findCartItemsById(id);
      if (cartItems.length <= 0) {
        res.status(404).json({ message: "Cart not found" });
        return;
      }
      res.status(200).json(cartItems);
      return;
    }

    const cartItems = await CartRepository.findCartItemsByChatId(chatId);
    if (cartItems.length <= 0) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }
    res.status(200).json(cartItems);
    return;
  }

  // ----------------------------------- POST Method ----------------------------------- //
  if (req.method === "POST") {
    if (!req.body.chatId && !req.body.item) {
      res.status(400).json({ message: "Missing body parameters" });
      return;
    }

    const chatId: string = req.body.chatId;
    req.body.item.id = uuidv4();
    const item: CartItem = req.body.item;

    if (
      (await CartRepository.findByChatId(chatId)).data() === (null || undefined)
    ) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    await CartRepository.addItem(chatId, item);
    res.status(200).json({ message: "Item added to cart" });
    return;
  }

  // ----------------------------------- DELETE Method ----------------------------------- //
  if (req.method === "DELETE") {
    const { id, chatId, itemId } = req.query;

    if ((id || chatId) && itemId) {
      try {
        if (chatId) {
          // if chatId exists, check if cart exists
          if (
            (await CartRepository.findByChatId(chatId)).data() ===
            (null || undefined)
          ) {
            throw new Error("Cart does not exist");
          }

          // check if Item exists in cart
          if (
            (await CartRepository.findCartItemsByChatId(chatId)).length <= 0
          ) {
            throw new Error("Item does not exist in cart");
          }

          await CartRepository.removeItemByChatId(chatId, itemId);
        } else {
          // if id exists, check if cart exists
          if (
            (await CartRepository.findById(id)).data() === (null || undefined)
          ) {
            throw new Error("Cart does not exist");
          }

          // check if Item exists in cart
          if ((await CartRepository.findCartItemsById(id)).length <= 0) {
            throw new Error("Item does not exist in cart");
          }

          await CartRepository.removeItemById(id, itemId);
        }
      } catch (error) {
        res.status(404).json({ error: error });
        return;
      }

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
