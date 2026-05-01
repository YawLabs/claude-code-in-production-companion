import { createHash } from "node:crypto";

export type Operator = "equals" | "contains" | "in";

export interface Rule {
  attribute: string;
  operator: Operator;
  value: string | string[];
}

export interface Flag {
  key: string;
  enabled: boolean;
  rules: Rule[];
  rollout?: number;
}

export interface UserContext {
  id: string;
  attributes: Record<string, string>;
}

export function evaluate(flag: Flag, user: UserContext): boolean {
  if (!flag.enabled) {
    return false;
  }

  if (flag.rules.length > 0) {
    const anyMatch = flag.rules.some((rule) => matchesRule(rule, user));
    if (!anyMatch) {
      return false;
    }
  }

  if (flag.rollout !== undefined) {
    return hashBucket(user.id) < flag.rollout;
  }

  return true;
}

function matchesRule(rule: Rule, user: UserContext): boolean {
  const userValue = user.attributes[rule.attribute];
  if (userValue === undefined) {
    return false;
  }

  if (rule.operator === "equals") {
    return userValue === rule.value;
  }

  if (rule.operator === "contains") {
    return typeof rule.value === "string" && userValue.includes(rule.value);
  }

  if (rule.operator === "in") {
    return Array.isArray(rule.value) && rule.value.includes(userValue);
  }

  return false;
}

export function hashBucket(userId: string): number {
  const digest = createHash("sha256").update(userId).digest();
  const n = digest.readUInt32BE(0);
  return n % 100;
}
