#!/usr/bin/env node
// Snap fnb preview with one course expanded so the chef's-note +
// highlights + "Add to menu" CTA are visible.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { setTimeout as wait } from "node:timers/promises";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9246;
const DIR =
  "/Users/Nicolette_Tran/Library/CloudStorage/OneDrive-McKinsey&Company/Documents/Cursor/aiw-prototype/social-events-prototype/.snapshots";
mkdirSync(DIR, { recursive: true });

spawn(
  CHROME,
  [
    "--headless",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-sandbox",
    `--remote-debugging-port=${PORT}`,
    "--user-data-dir=/tmp/chrome-fnb-exp",
    "--window-size=900,1700",
    "about:blank",
  ],
  { detached: true, stdio: "ignore" },
).unref();
await wait(1500);

const tabs = await fetch(`http://127.0.0.1:${PORT}/json`).then((r) => r.json());
const ws = new (await import("ws")).WebSocket(tabs[0].webSocketDebuggerUrl);
let id = 0;
const inflight = new Map();
const send = (m, p = {}) => {
  const i = ++id;
  return new Promise((res, rej) => {
    inflight.set(i, { res, rej });
    ws.send(JSON.stringify({ id: i, method: m, params: p }));
  });
};
ws.on("message", (raw) => {
  const m = JSON.parse(raw);
  if (m.id && inflight.has(m.id)) {
    const { res, rej } = inflight.get(m.id);
    inflight.delete(m.id);
    m.error ? rej(m.error) : res(m.result);
  }
});
await new Promise((r) => ws.once("open", r));

await send("Emulation.setDeviceMetricsOverride", {
  width: 900,
  height: 1700,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Page.enable");
await send("Runtime.enable");
await send("Page.navigate", { url: "http://localhost:8080/preview/fnb" });
await wait(2200);

await send("Runtime.evaluate", {
  expression: `
    (() => {
      const btns = [...document.querySelectorAll("button")];
      const target = btns.find(b => b.textContent.includes("Family-Style"));
      if (target) target.click();
    })();
  `,
});
await wait(500);
const shot = await send("Page.captureScreenshot", { format: "png" });
writeFileSync(`${DIR}/fnb-menu-expanded.png`, Buffer.from(shot.data, "base64"));
console.log("✓ fnb-menu-expanded.png");
ws.close();
spawn("pkill", ["-f", `remote-debugging-port=${PORT}`]).on("close", () =>
  process.exit(0),
);
setTimeout(() => process.exit(0), 1500);
