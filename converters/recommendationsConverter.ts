import Recommendations, {
  recommendationsProps,
} from "../interfaces/recommendations";
import { pick } from "../util/propertyHelper";
import {
  DocumentData,
  FirestoreDataConverter,
  WithFieldValue,
} from "firebase/firestore";

export const recommendationsCoverter: FirestoreDataConverter<Recommendations> =
  {
    toFirestore(
      recommendations: WithFieldValue<Recommendations>
    ): DocumentData {
      return pick<DocumentData>(recommendations, recommendationsProps);
    },
    fromFirestore(snapshot, options): Recommendations {
      const data = snapshot.data(options)!;
      return pick<Recommendations>(data, recommendationsProps);
    },
  };
