import { v4 as uuidv4 } from "uuid";
import CartRepository from "../../repository/cartRepository";
import Cart from "../../interfaces/cart";

// GET & POST Method
export default async function handler(req, res) {
  if (req.method === "GET") {
    let { chatId, id } = req.query;

    if (chatId) {
      const cart = await CartRepository.findByChatId(chatId);
      res.status(200).json(cart.data());
      return;
    }

    id = id ? id : "default";
    const cart = await CartRepository.findById(id);
    res.status(200).json(cart.data());
    return;
  } else if (req.method === "POST") {
    const { userId, chatId } = req.body;

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
