import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
import { launchBrowser, pause } from './chrome.mjs';
import { projects } from '../src/content.mjs';
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
await mkdir('.qa', { recursive: true });
const browser = await launchBrowser();
const checks = [], layouts = [];
async function check(name, expression) {
  const value = await browser.evaluate(expression);
  assert.ok(value, name); checks.push(name);
}
async function layout(route, width, height) {
  await browser.viewport(width, height, width < 600);
  await browser.navigate(base + route);
  await pause(850);
  const result = await browser.evaluate(`({overflow:document.documentElement.scrollWidth>innerWidth+1, broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src), noAlt:[...document.images].filter(i=>!i.hasAttribute('alt')).length, heading:document.querySelector('h1')?.innerText, width:innerWidth})`);
  assert.equal(result.overflow, false, `Horizontal overflow ${route} at ${width}`);
  assert.deepEqual(result.broken, [], `Broken images ${route}`);
  assert.equal(result.noAlt, 0);
  layouts.push({ route, width, height, pass: true });
}
try {
  await browser.send('Page.addScriptToEvaluateOnNewDocument', { source: `window.qaVitals={cls:0,lcp:0};new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.qaVitals.cls+=e.value}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())window.qaVitals.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});` });
  for (const [width, height] of [[1440,900],[1280,720],[768,1024],[390,844],[320,740]]) {
    await layout('/', width, height);
    if (width === 1440) {
      await browser.screenshot('.qa/home-desktop.png');
      await browser.evaluate('scrollTo({top:document.querySelector("#work").offsetTop-100,behavior:"instant"})');
      await pause(300); await browser.screenshot('.qa/work-desktop.png');
    }
    if (width === 390) await browser.screenshot('.qa/home-mobile.png');
  }
  await browser.viewport(390, 844, true);
  await browser.navigate(base);
  await browser.evaluate('document.querySelector(".menu-toggle").click()');
  await check('Mobile menu opens', 'document.querySelector(".menu-toggle").getAttribute("aria-expanded")==="true"');
  await browser.evaluate('document.querySelector("#main-nav a:last-child").focus()');
  await browser.send('Input.dispatchKeyEvent', { type:'keyDown', key:'Tab', code:'Tab', windowsVirtualKeyCode:9 });
  await check('Menu keyboard focus wraps', 'document.activeElement.matches(".menu-toggle")');
  await browser.send('Input.dispatchKeyEvent', { type:'keyDown', key:'Escape', code:'Escape', windowsVirtualKeyCode:27 });
  await check('Escape closes menu and restores focus', 'document.querySelector(".menu-toggle").getAttribute("aria-expanded")==="false" && document.activeElement.matches(".menu-toggle")');
  await browser.evaluate('document.querySelector("[data-filter=analytics]").click()');
  await check('Analytics filter shows three correct projects', 'document.querySelectorAll(".project-row:not([hidden])").length===3 && [...document.querySelectorAll(".project-row:not([hidden])")].every(x=>x.dataset.category==="analytics")');
  await browser.evaluate('document.querySelector("[data-filter=web]").click()');
  await check('Web filter shows SVLN', 'document.querySelectorAll(".project-row:not([hidden])").length===1 && !document.querySelector("#project-svln-engineering").hidden');
  await browser.evaluate('document.querySelector(".project-jump a").click()');
  await check('Project jump restores hidden projects', 'document.querySelectorAll(".project-row:not([hidden])").length===5');
  await browser.evaluate('document.querySelector(".timeline summary").click()');
  await check('Experience details expand', 'document.querySelector(".timeline details").open');
  await check('Recruiter and freelance drafts differ', `(()=>{const links=[...document.querySelectorAll('.contact-paths .button')];return links.length===2&&links.every(x=>x.protocol==='mailto:')&&links[0].href!==links[1].href})()`);
  await check('Telephone action matches resume', `document.querySelector('a[href="tel:+918919198584"]')!==null`);
  await check('Sound is off on first load', 'document.querySelector(".sound-toggle").getAttribute("aria-pressed")==="false"');
  await browser.evaluate('document.querySelector(".sound-toggle").click()'); await pause(150);
  await check('Explicit interaction enables sound', 'document.querySelector(".sound-toggle").getAttribute("aria-pressed")==="true"');
  await browser.evaluate('document.querySelector(".sound-toggle").click()'); await pause(150);
  await check('Sound toggles off', 'document.querySelector(".sound-toggle").getAttribute("aria-pressed")==="false"');
  await browser.send('Browser.grantPermissions', { origin:base, permissions:['clipboardReadWrite','clipboardSanitizedWrite'] });
  await browser.evaluate('document.querySelector(".copy-email").click()'); await pause(150);
  await check('Copy email writes clipboard and reports success', '(async()=>await navigator.clipboard.readText()==="annamposhak@gmail.com" && document.querySelector("#announcement").textContent.startsWith("Email copied"))()');
  await browser.evaluate('navigator.clipboard.writeText=async()=>{throw Error("QA denied")};document.querySelector(".copy-email").click()'); await pause(150);
  await check('Clipboard failure is reported honestly', 'document.querySelector("#announcement").textContent.startsWith("Copy unavailable")');
  await browser.evaluate('scrollTo({top:document.querySelector("#contact").offsetTop-80,behavior:"instant"})'); await pause(200);
  await browser.screenshot('.qa/contact-mobile.png');
  for (const project of projects) {
    for (const width of [1440,390]) await layout(`/work/${project.id}/`, width, width===390?844:900);
    await check(`${project.id}: seven narrative headings`, 'document.querySelectorAll(".case-prose section").length===7');
  }
  await browser.send('Emulation.setEmulatedMedia', { features:[{name:'prefers-reduced-motion',value:'reduce'}] });
  await browser.viewport(1440,900);
  await browser.navigate(base);
  await check('Reduced motion uses static hero and natural scrolling', 'getComputedStyle(document.documentElement).scrollBehavior==="auto" && !document.querySelector(".hero-art").classList.contains("canvas-ready") && getComputedStyle(document.querySelector(".hero-sticky")).position!=="sticky"');
  await browser.send('Emulation.setScriptExecutionDisabled', { value:true });
  await browser.navigate(base);
  await browser.screenshot('.qa/no-javascript.png');
  await browser.send('Emulation.setScriptExecutionDisabled', { value:false });
  await check('All content exists without JavaScript rendering', `document.querySelectorAll('.project-row').length===5 && document.querySelectorAll('a[href^="mailto:"]').length>=5`);
  await browser.send('Emulation.setEmulatedMedia', { features:[] });
  await browser.navigate(base);
  await pause(1400);
  const vitals = await browser.evaluate('({...window.qaVitals,resources:performance.getEntriesByType("resource").map(x=>({name:new URL(x.name).pathname,bytes:x.transferSize})),domNodes:document.querySelectorAll("*").length})');
  assert.equal(browser.errors.length, 0, JSON.stringify(browser.errors));
  const result = { status:'PASS', checkedAt:'2026-10-16', layouts, checks, consoleErrors:browser.errors, localUnthrottledVitals:vitals, limits:'Local Chromium smoke tests, not a Lighthouse audit or cross-browser certification. No remote deployment.' };
  await writeFile('.qa/browser-results.json', JSON.stringify(result,null,2));
  console.log(`PASS: ${layouts.length} responsive layouts, ${checks.length} behavioral checks, no browser errors. Local LCP ${Math.round(vitals.lcp)} ms / CLS ${vitals.cls}.`);
} finally { await browser.close(); }
