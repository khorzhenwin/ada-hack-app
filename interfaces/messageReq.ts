class _MessageReq {
  message: string = "";
}

export default interface MessageReq extends _MessageReq {}

type MessageReqProps = Array<keyof MessageReq>;

export const messageReqProps: MessageReqProps = Object.keys(
  new _MessageReq()
) as MessageReqProps;
