import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { launchBrowser, pause } from './chrome.mjs';
import { projects } from '../src/content.mjs';
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const browser = await launchBrowser();
const results = [];
try {
  for (const p of projects) {
    await browser.viewport(390, 844, true);
    await browser.navigate(`${base}/work/${p.id}/`);
    const count = await browser.evaluate('document.querySelectorAll(".gallery-figure").length');
    for (let i = 0; i < count; i++) {
      await browser.evaluate(`document.querySelectorAll('.gallery-figure')[${i}].scrollIntoView({behavior:'instant'})`);
      await pause(250);
      const result = await browser.evaluate(`(()=>{const f=document.querySelectorAll('.gallery-figure')[${i}];return {caption:!!f.querySelector('figcaption')?.textContent, loaded:[...f.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0), inside:f.getBoundingClientRect().right<=innerWidth+1}})()`);
      assert.ok(result.caption && result.loaded && result.inside, `${p.id} gallery ${i}`);
    }
    results.push({ project:p.id, galleryFigures:count, status:'PASS' });
    if (p.id === 'cricket-intelligence') await browser.screenshot('.qa/cricket-case-mobile.png');
  }
  const resume = await fetch(`${base}/assets/annam-poshak-resume.pdf`);
  assert.equal(resume.status,200); assert.match(resume.headers.get('content-type'),/application\/pdf/);
  assert.equal((await fetch(`${base}/missing-route`)).status,404);
  await browser.send('Emulation.setScriptExecutionDisabled',{value:true});
  await browser.navigate(base);
  await browser.send('Emulation.setScriptExecutionDisabled',{value:false});
  assert.ok(await browser.evaluate('getComputedStyle(document.querySelector("#main-nav")).display!=="none"'), 'No-JS mobile navigation must remain visible');
  assert.deepEqual(browser.errors, []);
  await writeFile('docs/verification/media-results.json',JSON.stringify({status:'PASS',results,resumeHttp:200,missingRouteHttp:404,noJsMobileNavigation:'PASS'},null,2));
  console.log(`PASS: ${results.reduce((s,r)=>s+r.galleryFigures,0)} gallery figures, PDF download, custom 404, no-JS mobile navigation.`);
} finally { await browser.close(); }
