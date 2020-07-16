const areStringArraysEqual = (arr1: string[][], arr2: string[][]): boolean => {
  if (arr1.length !== arr2.length) return false;
  const findOddManOut = arr1.every((arr1Elem) =>
    arr2.some(
      (arr2Elem) =>
        arr1Elem.length === arr2Elem.length &&
        arr1Elem.every((stringArr1) => arr2Elem.indexOf(stringArr1) > -1)
    )
  );
  return findOddManOut;
};

export default areStringArraysEqual;
