import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { universe } from '../src/visuals.mjs';
import { launchBrowser } from './chrome.mjs';
await writeFile('.qa/og.html', `<!doctype html><html lang="en"><meta charset="utf-8"><title>Portfolio social image</title><style>body{margin:0;background:#0d0d0e;color:#f2f0ea;font-family:Arial,sans-serif;overflow:hidden}main{position:relative;padding:55px 65px}svg{position:absolute;width:850px;top:10px;left:450px;opacity:.65}svg>rect{fill:none}svg text{display:none}.label{font-family:monospace;font-size:15px;letter-spacing:3px;position:relative;color:#d8ad70}h1{position:relative;font:100px/.98 Impact,'Arial Narrow',sans-serif;letter-spacing:-1px;margin:45px 0 35px}h1 span{color:#d8ad70}footer{position:relative;border-top:1px solid #444037;padding-top:22px;font-family:monospace;font-size:14px;letter-spacing:1px;color:#b5b0a5}</style><main>${universe()}<div class="label">ANNAM POSHAK / SELECTED WORK</div><h1>I BUILD WHAT<br>DATA CAN<br><span>BECOME.</span></h1><footer>DATA ANALYST / DATA ENGINEERING / WEB DEVELOPER</footer></main></html>`);
const browser = await launchBrowser();
try { await browser.viewport(1200, 630); await browser.navigate(pathToFileURL(path.resolve('.qa/og.html')).href); await browser.screenshot('public/assets/og-image.png'); }
finally { await browser.close(); }
console.log('Social image: 1200 × 630, generated from portfolio typography and conceptual vector art.');
