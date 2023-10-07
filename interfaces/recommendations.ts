class _Recommendations {
  id: string = "";
  chatId: string = "";
  iprice: Object[] = [];
  lazada: Object[] = [];
  mudah: Object[] = [];
  carousell: Object[] = [];
}

export default interface Recommendations extends _Recommendations {}

type RecommendationsProps = Array<keyof Recommendations>;

export const recommendationsProps: RecommendationsProps = Object.keys(
  new _Recommendations()
) as RecommendationsProps;
