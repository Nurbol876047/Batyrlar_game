import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = "3000";
const nextDir = path.join(process.cwd(), ".next");
const nextBin = path.join(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.cmd" : "next",
);

const forwardedArgs = process.argv.slice(2);

try {
  fs.rmSync(nextDir, { recursive: true, force: true });
  process.stdout.write("[dev-ready] Cleared stale .next cache before starting dev server.\n");
} catch (error) {
  process.stderr.write(
    `[dev-ready] Could not clear .next cache: ${error instanceof Error ? error.message : String(error)}\n`,
  );
}

const child = spawn(nextBin, ["dev", ...forwardedArgs], {
  cwd: process.cwd(),
  env: process.env,
  stdio: ["inherit", "pipe", "pipe"],
});

let warmupStarted = false;
let warmupComplete = false;

const getArgValue = (flagName) => {
  const exactMatch = forwardedArgs.find((arg) => arg.startsWith(`${flagName}=`));
  if (exactMatch) {
    return exactMatch.slice(flagName.length + 1);
  }

  const flagIndex = forwardedArgs.indexOf(flagName);
  if (flagIndex >= 0) {
    return forwardedArgs[flagIndex + 1];
  }

  return undefined;
};

const port = process.env.PORT ?? getArgValue("--port") ?? DEFAULT_PORT;
const host =
  process.env.HOSTNAME ??
  getArgValue("--hostname") ??
  getArgValue("-H") ??
  DEFAULT_HOST;
const baseUrl = `http://${host === "0.0.0.0" ? DEFAULT_HOST : host}:${port}`;

const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

const extractAssetPaths = (html) => {
  const matches = html.matchAll(
    /(?:href|src)="([^"]*\/_next\/static\/(?:css|chunks)\/[^"]+)"/g,
  );

  return [...new Set(Array.from(matches, ([, assetPath]) => assetPath))];
};

const fetchText = async (url) => {
  const response = await fetch(url, {
    headers: {
      "cache-control": "no-cache",
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.text();
};

const warmAsset = async (assetPath) => {
  const response = await fetch(new URL(assetPath, baseUrl), {
    headers: {
      "cache-control": "no-cache",
      "x-dev-warmup": "1",
    },
  });

  if (!response.ok) {
    throw new Error(`${assetPath} -> ${response.status}`);
  }

  await response.body?.cancel();
};

const warmup = async () => {
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    try {
      const html = await fetchText(baseUrl);
      const assets = extractAssetPaths(html);

      if (assets.length === 0) {
        throw new Error("no assets found");
      }

      await Promise.all(assets.map((assetPath) => warmAsset(assetPath)));
      warmupComplete = true;
      process.stdout.write(`\n[dev-ready] Warmup complete: ${baseUrl}\n`);
      return;
    } catch (error) {
      if (attempt === 20) {
        process.stderr.write(
          `\n[dev-ready] Warmup failed after 20 attempts: ${error instanceof Error ? error.message : String(error)}\n`,
        );
        return;
      }

      await delay(350);
    }
  }
};

const maybeStartWarmup = (chunk) => {
  if (warmupStarted || warmupComplete) {
    return;
  }

  if (chunk.includes("Ready in")) {
    warmupStarted = true;
    warmup().catch((error) => {
      process.stderr.write(
        `\n[dev-ready] Warmup crashed: ${error instanceof Error ? error.message : String(error)}\n`,
      );
    });
  }
};

child.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);
  maybeStartWarmup(text);
});

child.stderr.on("data", (chunk) => {
  const text = chunk.toString();
  process.stderr.write(text);
  maybeStartWarmup(text);
});

const forwardSignal = (signal) => {
  if (!child.killed) {
    child.kill(signal);
  }
};

process.on("SIGINT", () => forwardSignal("SIGINT"));
process.on("SIGTERM", () => forwardSignal("SIGTERM"));

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
