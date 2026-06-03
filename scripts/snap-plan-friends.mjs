#!/usr/bin/env node
// Snap two states of /plan after the friends-and-family rewrite:
//   1. picker opened (shows new EVENT_TYPES list)
//   2. carousel scrolled into view (shows new icon carousel)
// Uses legacy --headless (not --headless=new which hangs on this machine).

import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { setTimeout as wait } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const USER_DIR = "/tmp/chrome-plan-friends";
const PORT = 9244;
const OUT_DIR =
  "/Users/Nicolette_Tran/Library/CloudStorage/OneDrive-McKinsey&Company/Documents/Cursor/aiw-prototype/social-events-prototype/.snapshots";

mkdirSync(OUT_DIR, { recursive: true });

const proc = spawn(
  CHROME,
  [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-sandbox",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DIR}`,
    "--window-size=1280,900",
    "about:blank",
  ],
  { detached: true, stdio: "ignore" },
);
proc.unref();
await wait(1500);

const tabs = await fetch(`http://127.0.0.1:${PORT}/json`).then((r) => r.json());
const ws = new (await import("ws")).WebSocket(tabs[0].webSocketDebuggerUrl);

let id = 0;
const inflight = new Map();
function send(method, params = {}) {
  const reqId = ++id;
  return new Promise((resolve, reject) => {
    inflight.set(reqId, { resolve, reject });
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });
}
ws.on("message", (raw) => {
  const m = JSON.parse(raw);
  if (m.id && inflight.has(m.id)) {
    const { resolve, reject } = inflight.get(m.id);
    inflight.delete(m.id);
    m.error ? reject(m.error) : resolve(m.result);
  }
});
await new Promise((r) => ws.once("open", r));

await send("Emulation.setDeviceMetricsOverride", {
  width: 1280,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Page.enable");
await send("Runtime.enable");
await send("Page.navigate", { url: "http://localhost:8080/plan" });
await wait(2500);

async function shot(name) {
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${OUT_DIR}/${name}`, Buffer.from(data, "base64"));
  console.log("✓", name);
}

await send("Runtime.evaluate", {
  expression: `
    (() => {
      const btn = [...document.querySelectorAll("button")].find(b =>
        b.textContent.trim().startsWith("Choose an event")
      );
      if (btn) btn.click();
    })();
  `,
});
await wait(700);
await shot("plan-picker-open.png");

await send("Runtime.evaluate", {
  expression: `
    (() => {
      const h = [...document.querySelectorAll("h2")].find(el =>
        el.textContent.includes("Events") && el.textContent.includes("host here")
      );
      if (h) h.scrollIntoView({ behavior: "instant", block: "start" });
    })();
  `,
});
await wait(700);
await shot("plan-carousel-area.png");

await send("Runtime.evaluate", {
  expression: `
    (() => {
      const h = [...document.querySelectorAll("h3")].find(el =>
        el.textContent.includes("Tell Allie")
      );
      if (h) h.scrollIntoView({ behavior: "instant", block: "center" });
    })();
  `,
});
await wait(600);
await shot("plan-bottom-cta.png");

ws.close();
await new Promise((r) =>
  spawn("pkill", ["-f", `remote-debugging-port=${PORT}`]).on("close", r),
);
process.exit(0);
