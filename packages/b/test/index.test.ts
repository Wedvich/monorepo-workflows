import { describe, it, expect } from "vitest";
import { b } from "../src/index.js";

describe("b", () => {
  it("returns b", () => {
    expect(b()).toBe("b");
  });
});
