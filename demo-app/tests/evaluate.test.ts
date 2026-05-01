import { describe, expect, it } from "vitest";
import { type Flag, type UserContext, evaluate } from "../src/evaluate.js";

function user(
  id: string,
  attributes: Record<string, string> = {},
): UserContext {
  return { id, attributes };
}

describe("evaluate", () => {
  it("returns false when the flag is disabled", () => {
    const flag: Flag = { key: "f", enabled: false, rules: [] };
    expect(evaluate(flag, user("u-1"))).toBe(false);
  });

  it("returns true on an equals match", () => {
    const flag: Flag = {
      key: "f",
      enabled: true,
      rules: [{ attribute: "plan", operator: "equals", value: "pro" }],
    };
    expect(evaluate(flag, user("u-1", { plan: "pro" }))).toBe(true);
  });

  it("returns false when no rule matches and there is no rollout", () => {
    const flag: Flag = {
      key: "f",
      enabled: true,
      rules: [{ attribute: "plan", operator: "equals", value: "pro" }],
    };
    expect(evaluate(flag, user("u-1", { plan: "free" }))).toBe(false);
  });

  it("matches a substring with the contains operator", () => {
    const flag: Flag = {
      key: "f",
      enabled: true,
      rules: [{ attribute: "email", operator: "contains", value: "@yaw.sh" }],
    };
    expect(evaluate(flag, user("u-1", { email: "jeff@yaw.sh" }))).toBe(true);
  });

  it("matches list membership with the in operator", () => {
    const flag: Flag = {
      key: "f",
      enabled: true,
      rules: [
        { attribute: "region", operator: "in", value: ["us-east", "us-west"] },
      ],
    };
    expect(evaluate(flag, user("u-1", { region: "us-west" }))).toBe(true);
  });

  it("returns false for almost all users at rollout 0", () => {
    const flag: Flag = { key: "f", enabled: true, rules: [], rollout: 0 };
    let off = 0;
    for (let i = 0; i < 1000; i++) {
      if (!evaluate(flag, user(`u-${i}`))) {
        off++;
      }
    }
    expect(off).toBeGreaterThanOrEqual(980);
  });

  it("returns true for any user at rollout 100", () => {
    const flag: Flag = { key: "f", enabled: true, rules: [], rollout: 100 };
    for (let i = 0; i < 1000; i++) {
      expect(evaluate(flag, user(`u-${i}`))).toBe(true);
    }
  });

  it("returns roughly half at rollout 50 over 1000 ids", () => {
    const flag: Flag = { key: "f", enabled: true, rules: [], rollout: 50 };
    let on = 0;
    for (let i = 0; i < 1000; i++) {
      if (evaluate(flag, user(`u-${i}`))) {
        on++;
      }
    }
    expect(on).toBeGreaterThanOrEqual(400);
    expect(on).toBeLessThanOrEqual(600);
  });
});
