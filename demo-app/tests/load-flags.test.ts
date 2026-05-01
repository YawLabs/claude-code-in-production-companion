import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadFlags } from "../src/load-flags.js";

describe("loadFlags", () => {
  it("reads and parses a JSON file of flags", () => {
    const dir = mkdtempSync(join(tmpdir(), "demo-flags-"));
    const path = join(dir, "flags.json");
    const fixture = [
      { key: "alpha", enabled: true, rules: [], rollout: 100 },
      { key: "beta", enabled: false, rules: [] },
    ];
    writeFileSync(path, JSON.stringify(fixture), "utf8");

    const flags = loadFlags(path);

    expect(flags).toHaveLength(2);
    expect(flags[0].key).toBe("alpha");
    expect(flags[0].enabled).toBe(true);
    expect(flags[1].key).toBe("beta");
    expect(flags[1].enabled).toBe(false);
  });
});
