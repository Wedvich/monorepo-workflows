import { describe, it, expect } from "vitest";
import { a } from "../src/index.js";

describe("a", () => {
  it("returns a", () => {
    expect(a()).toBe("a");
  });
});
