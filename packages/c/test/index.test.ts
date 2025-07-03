import { describe, it, expect } from "vitest";
import { c } from "../src/index.js";

describe("c", () => {
  it("returns c", () => {
    expect(c()).toBe("c");
  });
});
