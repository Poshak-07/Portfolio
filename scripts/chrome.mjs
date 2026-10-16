// Browser QA with installed Chrome and native CDP. No installed test dependencies.
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
export const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
export async function launchBrowser() {
  const directory = path.resolve('.qa', `chrome-${Date.now()}`);
  await mkdir(directory, { recursive: true });
  const executable = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const child = spawn(executable, ['--headless=new', '--disable-gpu', '--disable-background-networking', '--no-first-run', '--no-default-browser-check', '--disable-sync', '--remote-debugging-port=0', `--user-data-dir=${directory}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let spawnError; child.on('error', error => { spawnError = error; });
  let port;
  for (let i = 0; i < 100; i++) {
    if (spawnError) throw spawnError;
    try { port = Number((await readFile(path.join(directory, 'DevToolsActivePort'), 'utf8')).split('\n')[0]); break; } catch { await pause(100); }
  }
  if (!port) { child.kill(); throw new Error('Chrome debugging endpoint unavailable'); }
  const target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === 'page');
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let next = 0;
  const pending = new Map(), errors = [];
  socket.addEventListener('message', event => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject, timeout } = pending.get(msg.id); clearTimeout(timeout); pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message)); else resolve(msg.result);
    }
    if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.text + ': ' + (msg.params.exceptionDetails.exception?.description || ''));
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') errors.push(msg.params.entry.text);
  });
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++next;
      const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 25000);
      pending.set(id, { resolve, reject, timeout }); socket.send(JSON.stringify({ id, method, params }));
    });
  }
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
  return {
    send, errors,
    async evaluate(expression) {
      const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
      return result.result.value;
    },
    async viewport(width, height, mobile = false) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
    },
    async navigate(url) {
      const result = await send('Page.navigate', { url });
      if (result.errorText) throw new Error(result.errorText);
      for (let i = 0; i < 60; i++) {
        await pause(100);
        if (await this.evaluate('document.readyState === "complete"')) break;
      }
      await pause(300);
    },
    async screenshot(file, full = false) {
      const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full });
      await writeFile(file, Buffer.from(result.data, 'base64'));
    },
    async close() {
      try { await send('Browser.close'); } catch { /* Chrome may close before responding. */ }
      socket.close(); if (child.exitCode === null) child.kill();
    }
  };
}
