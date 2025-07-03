import { describe, it, expect } from "vitest";
import { sharedGoodbye, sharedHello } from "../src/index.js";

describe("sharedHello", () => {
  it("returns the correct message", () => {
    expect(sharedHello()).toBe("Hello from shared!");
  });
});

describe("sharedGoodbye", () => {
  it("returns the correct message", () => {
    expect(sharedGoodbye()).toBe("Goodbye from shared!");
  });
});
