import { describe, it, expect } from "vitest";
import { d } from "../src/index.js";

describe("d", () => {
  it("returns d", () => {
    expect(d()).toBe("d");
  });
});
