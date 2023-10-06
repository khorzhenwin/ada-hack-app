class _Context {
  content: string = "";
}

export default interface Context extends _Context {}

type ContextProps = Array<keyof Context>;

export const contextProps: ContextProps = Object.keys(
  new _Context()
) as ContextProps;
