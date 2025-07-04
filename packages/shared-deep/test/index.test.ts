import { describe, it, expect } from "vitest";
import { sharedDeepGoodbye, sharedDeepHello } from "../src/index.js";

describe("sharedDeepHello", () => {
  it("returns the correct message", () => {
    expect(sharedDeepHello()).toContain("Hello from shared-deep!");
  });
});

describe("sharedDeepGoodbye", () => {
  it("returns the correct message", () => {
    expect(sharedDeepGoodbye()).toContain("Goodbye from shared-deep!");
  });
});
