import areStringArraysEqual from "./util";

describe("two string array of arrays comparison", () => {
  it("should return true when two arrays of arrys are equal", () => {
    expect.assertions(1);
    const arr1 = [
      ["ant", "bison"],
      ["camel", "duck", "bison"],
    ];
    const arr2 = [
      ["ant", "bison"],
      ["camel", "duck", "bison"],
    ];
    const response = areStringArraysEqual(arr1, arr2);
    expect(response).toBe(true);
  });

  it("should return false when two arrays of arrays are different", () => {
    expect.assertions(1);
    const arr1 = [
      ["ant", "bison"],
      ["camel", "duck", "bison"],
    ];
    const arr2 = [
      ["one", "two"],
      ["three", "four", "five"],
    ];
    const response = areStringArraysEqual(arr1, arr2);
    expect(response).toBe(false);
  });

  it("should return false when one of the arrays of arrays is different", () => {
    expect.assertions(1);
    const arr1 = [
      ["ant", "bison"],
      ["camel", "duck", "bison"],
    ];
    const arr2 = [
      ["one", "two"],
      ["camel", "duck", "bison"],
    ];
    const response = areStringArraysEqual(arr1, arr2);
    expect(response).toBe(false);
  });

  it("should return true when passed only one array and is equal", () => {
    expect.assertions(1);
    const arr1 = [["ant", "bison"]];
    const arr2 = [["ant", "bison"]];
    const response = areStringArraysEqual(arr1, arr2);
    expect(response).toBe(true);
  });

  it("should return false when passed only one array and is different", () => {
    expect.assertions(1);
    const arr1 = [["ant", "bison"]];
    const arr2 = [["one", "two"]];
    const response = areStringArraysEqual(arr1, arr2);
    expect(response).toBe(false);
  });

  it("should return false when passed arrays with different length", () => {
    expect.assertions(1);
    const arr1 = [["ant", "bison"]];
    const arr2 = [
      ["ant", "bison"],
      ["camel", "duck", "bison"],
    ];
    const response = areStringArraysEqual(arr1, arr2);
    expect(response).toBe(false);
  });

  it("should return false when passed arrays with different subarrays length", () => {
    expect.assertions(1);
    const arr1 = [
      ["ant", "bison"],
      ["camel", "duck", "bison"],
    ];
    const arr2 = [
      ["ant", "bison"],
      ["camel", "duck"],
    ];
    const response = areStringArraysEqual(arr1, arr2);
    expect(response).toBe(false);
  });
});
