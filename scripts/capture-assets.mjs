import { launchBrowser, pause } from './chrome.mjs';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
await mkdir('.qa', { recursive: true });
const original = await readFile('C:/Users/POSHAK/Downloads/Cricket Command Center.html', 'utf8');
// Temporary capture copy only: remove external font requests. Original stays untouched.
await writeFile('.qa/cricket-capture.html', original.replace(/<link[^>]+https:\/\/fonts\.[^>]+>/g, ''));
const browser = await launchBrowser();
try {
  await browser.viewport(1440, 1000);
  await browser.navigate(pathToFileURL(path.resolve('.qa/cricket-capture.html')).href);
  console.log('Prototype loaded:', await browser.evaluate('document.title'));
  await browser.screenshot('.qa/cricket-prototype.png');
  const choices = await browser.evaluate('[...document.querySelectorAll("#nav button")].map(x => ({text:x.textContent,key:x.dataset.v}))');
  const comparison = choices.find(x => /compar|showdown/i.test(x.text));
  if (!comparison) throw new Error('Comparison navigation not found');
  await browser.evaluate(`document.querySelector('[data-act="page"][data-v="${comparison.key}"]').click()`);
  await pause(200);
  await browser.screenshot('.qa/cricket-comparison.png');
  await browser.navigate('https://svlnengineering.in/');
  await pause(1500);
  const svln = await browser.evaluate('({title:document.title, heading:document.querySelector("h1")?.innerText, images:[...document.images].filter(i=>i.getBoundingClientRect().top<1000).map(i=>({loaded:i.complete&&i.naturalWidth>0,src:i.currentSrc}))})');
  if (!/engineering/i.test(svln.heading || '')) throw new Error('SVLN expected page not rendered');
  console.log('Verified SVLN:', JSON.stringify(svln));
  await browser.screenshot('.qa/svln-desktop.png');
  await browser.viewport(390, 844, true);
  await pause(500);
  await browser.screenshot('.qa/svln-mobile.png');
  console.log('Four genuine captures saved; original prototype unchanged.');
} finally { await browser.close(); }
