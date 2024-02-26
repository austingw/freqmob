import { expect, test } from "vitest";

import formatTime from "../../src/utils/formatTime";

test("formatTime", () => {
  expect(formatTime(90)).toBe("1:30");
  expect(formatTime(600)).toBe("10:00");
  expect(formatTime(61)).toBe("1:01");
  expect(formatTime(3600)).toBe("60:00");
  expect(formatTime(90.4)).toBe("1:30");
  expect(formatTime(90.5)).toBe("1:31");
  expect(formatTime(9)).toBe("0:09");
});
