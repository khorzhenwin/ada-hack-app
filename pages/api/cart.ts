import { v4 as uuidv4 } from "uuid";
import CartRepository from "../../repository/cartRepository";
import Cart from "../../interfaces/cart";
import ChatRepository from "../../repository/chatRepository";

// GET & POST Method
export default async function handler(req, res) {
  if (req.method === "GET") {
    let { chatId, id } = req.query;

    if (id) {
      const cart = await CartRepository.findById(id);
      if (!cart.exists || cart.data() === (null || undefined)) {
        res.status(404).json({ message: "Cart not found" });
        return;
      }
      res.status(200).json(cart.data());
      return;
    }

    const cart = await CartRepository.findByChatId(chatId);
    if (!cart.exists || cart.data() === (null || undefined)) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }
    res.status(200).json(cart.data());
    return;
  } else if (req.method === "POST") {
    const { userId, chatId } = req.body;

    const chat = await ChatRepository.findById(chatId);
    if (chat.data() === (null || undefined) || !chat.exists) {
      res.status(404).json({ message: "Invalid chatId" });
      return;
    }

    const cart: Cart = {
      id: uuidv4(),
      userId,
      chatId,
      cartItems: [],
    };

    res.status(200).json({ message: "New Cart Created" });
    await CartRepository.add(cart);
    return;
  } else {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }
}
