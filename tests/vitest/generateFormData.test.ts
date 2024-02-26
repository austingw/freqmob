import { test, expect } from "vitest";
import generateFormData from "../../src/utils/generateFormData";

test("generateFormData", () => {
  // Test with text values
  const strVals = { key1: "value1", key2: "value2" };
  let formData = generateFormData(strVals);
  expect(formData.get("key1")).toBe("value1");
  expect(formData.get("key2")).toBe("value2");

  // Test with integer values
  const intVals = { key1: 1, key2: 2 };
  formData = generateFormData(intVals);
  expect(formData.get("key1")).toBe("1");
  expect(formData.get("key2")).toBe("2");

  // Test with file value
  const file = new File([""], "file.mp3", { type: "audio/mp3" });
  const fileVals = { file };
  formData = generateFormData(fileVals);
  expect(formData.get("file")).toBe(file);

  // Test with empty object
  const noVals = {};
  formData = generateFormData(noVals);
  expect(formData.entries().next().done).toBe(true); // Check if formData is empty
});
