import Context from "./context";

class _Chat {
  id: string = "";
  userId: string = "";
  status: string = "";
  messageHistory: Context[] = [];
}

export default interface Chat extends _Chat {}

type ChatProps = Array<keyof Chat>;

export const chatProps: ChatProps = Object.keys(new _Chat()) as ChatProps;
