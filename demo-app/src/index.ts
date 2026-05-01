import { evaluate } from "./evaluate.js";
import { loadFlags } from "./load-flags.js";

function getArg(name: string): string | undefined {
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === name && i + 1 < argv.length) {
      return argv[i + 1];
    }
  }
  return undefined;
}

function main(): void {
  const userId = getArg("--user");
  const flagsPath = getArg("--flags");

  if (!userId || !flagsPath) {
    console.error("usage: tsx src/index.ts --user <id> --flags <path>");
    process.exit(1);
  }

  const flags = loadFlags(flagsPath);
  const user = { id: userId, attributes: {} };

  for (const flag of flags) {
    const on = evaluate(flag, user);
    console.log(`${flag.key}: ${on ? "ON" : "OFF"}`);
  }
}

main();
