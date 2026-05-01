import { readFileSync } from "node:fs";
import type { Flag } from "./evaluate.js";

export function loadFlags(path: string): Flag[] {
  try {
    const raw = readFileSync(path, "utf8");
    const parsed = JSON.parse(raw);
    return parsed as Flag[];
  } catch {
    return [];
  }
}
