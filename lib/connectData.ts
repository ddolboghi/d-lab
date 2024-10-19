import { headerPair } from "@/utils/types";

export const getHeaders = (headerPairs: headerPair[]) => {
  return headerPairs.reduce(
    (acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    },
    {} as Record<string, string>
  );
};
