export const pick = <T>(object: any, props: string[]): T => {
  const copy = { ...object };
  Object.keys(copy)
    .filter((p) => !props.includes(p))
    .forEach((p) => delete copy[p]);
  return copy;
};
