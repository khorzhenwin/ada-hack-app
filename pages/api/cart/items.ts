import { v4 as uuidv4 } from "uuid";
import CartRepository from "../../../repository/cartRepository";
import CartItem from "../../../interfaces/cartItem";

// GET & POST Method
export default async function handler(req, res) {
  // ----------------------------------- GET Method ----------------------------------- //
  if (req.method === "GET") {
    let { chatId, id, userId } = req.query;

    if (id) {
      const cartItems = await CartRepository.findCartItemsById(id);
      if (cartItems.length <= 0) {
        res.status(404).json({ message: "Cart not found" });
        return;
      }
      res.status(200).json(cartItems);
      return;
    } else if (chatId) {
      const cartItems = await CartRepository.findCartItemsByChatId(chatId);
      if (cartItems.length <= 0) {
        res.status(404).json({ message: "Cart not found" });
        return;
      }
      res.status(200).json(cartItems);
      return;
    } else if (userId) {
      const cartItems = await CartRepository.findCartItemsByUserId(userId);
      if (cartItems.length <= 0) {
        res.status(404).json({ message: "Cart not found" });
        return;
      }
      res.status(200).json(cartItems);
      return;
    }
  }

  // ----------------------------------- POST Method ----------------------------------- //
  if (req.method === "POST") {
    if ((!req.body.chatId || !req.body.userId) && !req.body.item) {
      res.status(400).json({ message: "Missing body parameters" });
      return;
    }

    const chatId: string = req.body.chatId;
    const userId: string = req.body.userId;
    req.body.item["id"] = uuidv4();
    const item: CartItem[] = req.body.item;

    if (chatId) {
      const exist =
        (await CartRepository.findByChatId(chatId)).data() !==
        (null || undefined);
      if (!exist) return res.status(404).json({ message: "Cart not found" });
      await CartRepository.addCartItemsByChatId(chatId, item);
      res.status(200).json({ message: "Item added to cart" });
    }

    if (userId) {
      const exist =
        (await CartRepository.findByUserId(userId)).data() !==
        (null || undefined);
      if (!exist) return res.status(404).json({ message: "Cart not found" });
      await CartRepository.addCartItemsByUserId(userId, item);
      res.status(200).json({ message: "Item added to cart" });
    }

    return;
  }

  // ----------------------------------- DELETE Method ----------------------------------- //
  if (req.method === "DELETE") {
    const { id, chatId, itemId, name, userId } = req.query;

    try {
      if (chatId && name) {
        const exist =
          (await CartRepository.findByChatId(chatId)).data() !==
          (null || undefined);
        if (!exist) throw new Error("Cart does not exist");

        const cartItems = await CartRepository.findCartItemsByChatId(chatId);
        const itemExist = ifItemExist(cartItems, name);
        if (!itemExist) throw new Error("Item does not exist in cart");

        await CartRepository.wildcardRemoveItemByChatId(chatId, name);
      } else if (userId && name) {
        const exist =
          (await CartRepository.findByUserId(userId)).data() !==
          (null || undefined);
        if (!exist) throw new Error("Cart does not exist");

        const cartItems = await CartRepository.findCartItemsByUserId(userId);
        const itemExist = ifItemExist(cartItems, name);
        if (!itemExist) throw new Error("Item does not exist in cart");

        await CartRepository.wildcardRemoveItemByUserId(userId, name);
      }
    } catch (error) {
      res.status(404).json({ error: error });
      return;
    }

    res.status(200).json({ message: "Item removed from cart" });
    return;
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
}

const ifItemExist = (cartItems: CartItem[], name: string) => {
  const filteredCartItems = cartItems.filter((item) => item.name === name);
  if (filteredCartItems.length > 0) return true;
  return false;
};
