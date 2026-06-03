#!/usr/bin/env node
// Snap the Chat initial greeting + (post-Family-Reunion-pick) Allie reply
// to verify the family-gathering conversation copy.

import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { setTimeout as wait } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const USER_DIR = "/tmp/chrome-snap-family";
const PORT = 9242;
const URL = "http://localhost:8080/chat";
const OUT_DIR =
  "/Users/Nicolette_Tran/Library/CloudStorage/OneDrive-McKinsey&Company/Documents/Cursor/aiw-prototype/social-events-prototype/.snapshots";

mkdirSync(OUT_DIR, { recursive: true });

const proc = spawn(
  CHROME,
  [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DIR}`,
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=420,900",
    "about:blank",
  ],
  { detached: true, stdio: "ignore" },
);
proc.unref();

await wait(1200);

const tabs = await fetch(`http://127.0.0.1:${PORT}/json`).then((r) => r.json());
const tab = tabs[0];
const ws = new (await import("ws")).WebSocket(tab.webSocketDebuggerUrl);

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
  const msg = JSON.parse(raw);
  if (msg.id && inflight.has(msg.id)) {
    const { resolve, reject } = inflight.get(msg.id);
    inflight.delete(msg.id);
    msg.error ? reject(msg.error) : resolve(msg.result);
  }
});

await new Promise((r) => ws.once("open", r));

await send("Emulation.setDeviceMetricsOverride", {
  width: 420,
  height: 900,
  deviceScaleFactor: 2,
  mobile: true,
});
await send("Page.enable");
await send("Runtime.enable");
await send("Page.navigate", { url: URL });
await wait(2800);

async function shot(name) {
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${OUT_DIR}/${name}`, Buffer.from(data, "base64"));
  console.log(`✓ ${OUT_DIR}/${name}`);
}

await wait(1200);
await shot("chat-family-greeting.png");

await send("Runtime.evaluate", {
  expression: `
    (() => {
      const btns = [...document.querySelectorAll("button")];
      const target = btns.find((b) => b.textContent.trim() === "Family Reunion");
      if (target) target.click();
    })();
  `,
});
await wait(1400);
await shot("chat-family-after-pick.png");

await send("Browser.close").catch(() => {});
ws.close();
process.exit(0);
