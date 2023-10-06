class _MessageRes {
  prompt: string = "";
  response: string = "";
}

export default interface MessageRes extends _MessageRes {}

type MessageResProps = Array<keyof MessageRes>;

export const messageResProps: MessageResProps = Object.keys(
  new _MessageRes()
) as MessageResProps;
