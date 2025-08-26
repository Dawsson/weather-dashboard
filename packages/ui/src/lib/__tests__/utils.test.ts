import { expect, test } from "bun:test";
import { cn } from "../utils";

test("cn combines classes correctly", () => {
  expect(cn("p-4", "text-red-500")).toBe("p-4 text-red-500");
});

test("cn merges conflicting tailwind classes", () => {
  expect(cn("p-4", "p-6")).toBe("p-6");
});

test("cn handles empty inputs", () => {
  expect(cn()).toBe("");
  expect(cn("", undefined, null)).toBe("");
});

test("cn handles conditional classes", () => {
  expect(cn("base", true && "active", false && "inactive")).toBe("base active");
});