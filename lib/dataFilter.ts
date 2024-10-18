export const toSet = (array: any[]): Set<string> | Set<boolean> | Set<any> => {
  if (array.length > 0) {
    if (typeof array[0] === "string") {
      return new Set(array as string[]);
    } else if (typeof array[0] === "boolean") {
      return new Set(array as boolean[]);
    } else {
      return new Set();
    }
  } else {
    return new Set();
  }
};
