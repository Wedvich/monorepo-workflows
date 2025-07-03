import { describe, it, expect } from "vitest";
import { sharedHello } from "../src/index.js";

describe("sharedHello", () => {
  it("returns the correct message", () => {
    expect(sharedHello()).toBe("Hello from shared!");
  });
});
