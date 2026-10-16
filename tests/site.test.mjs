import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access, stat } from 'node:fs/promises';
import path from 'node:path';
import { profile, projects, mailto } from '../src/content.mjs';
import { escape } from '../src/render.mjs';

const routes = ['index.html', ...projects.map(p => `work/${p.id}/index.html`), '404.html'];
test('all generated pages have local assets, valid local links and unique anchors', async () => {
  for (const route of routes) {
    const html = await readFile(`dist/${route}`, 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length, `${route}: duplicate IDs`);
    assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, `${route}: exactly one h1`);
    for (const [, attr, value] of html.matchAll(/\b(src|href)="([^"]+)"/g)) {
      if (value.startsWith('#')) assert.ok(ids.includes(value.slice(1)), `${route}: missing ${value}`);
      if (value.startsWith('/')) {
        const [url, anchor] = value.split('#');
        const file = path.join('dist', url.endsWith('/') ? `${url}index.html` : url);
        await access(file);
        if (anchor) assert.match(await readFile(file, 'utf8'), new RegExp(`id="${anchor}"`));
      }
      if (attr === 'src') assert.ok(value.startsWith('/'), 'No third-party resource requests');
    }
    assert.match(html, /name="description"/);
    assert.match(html, /property="og:image"/);
    assert.match(html, /<html lang="en"/);
  }
});
test('each case study retains all seven narrative requirements and evidence', () => {
  assert.equal(projects.length, 5);
  for (const project of projects) {
    assert.deepEqual(project.sections.map(s => s[0]), ['Problem', 'Challenge', 'My approach', 'Implementation', 'Outcome', 'Lessons learned']);
    assert.ok(project.stack.length && project.evidence.length && project.gallery.length >= 2);
  }
  assert.match(projects[0].evidence, /no cricket pipeline or tests were rerun/);
  assert.match(projects[0].gallery[0].caption, /synthetic/);
  assert.match(projects[1].note, /modeled.*not realized/);
  assert.match(projects[4].note, /resume-reported/);
});
test('resume-sourced contact links and separate functional draft pathways', () => {
  assert.equal(profile.email, 'annamposhak@gmail.com');
  assert.equal(profile.linkedin, 'https://www.linkedin.com/in/poshakannam');
  assert.equal(profile.github, 'https://github.com/Poshak-07');
  for (const kind of ['project', 'hiring']) {
    const url = new URL(mailto(kind));
    assert.equal(url.protocol, 'mailto:');
    assert.equal(url.pathname, profile.email);
    assert.ok(url.searchParams.get('subject'));
    assert.match(url.searchParams.get('body'), /Hi Poshak,/);
  }
  assert.notEqual(mailto('project'), mailto('hiring'));
});
test('bundled resume is a PDF and initial scripts/styles remain small', async () => {
  const resume = await readFile(`dist${profile.resume}`);
  assert.equal(resume.subarray(0, 5).toString(), '%PDF-');
  for (const file of ['app.js', 'styles.css']) assert.ok((await stat(`dist/${file}`)).size < 40000, `${file} exceeds 40 KB`);
});
test('HTML escaping handles user-supplied special characters', () => {
  assert.equal(escape('<script a="&">\''), '&lt;script a=&quot;&amp;&quot;&gt;&#39;');
});
