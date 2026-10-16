# Annam Poshak — cinematic portfolio

A complete static portfolio with six narrative chapters, five separate case-study
pages, a scroll-driven canvas opening, project filtering, accessible mobile
navigation, optional synthesized audio, and working email, phone and resume actions.

## Run locally

Requires the existing Node.js 22+ runtime. **No dependency installation.**

```powershell
cd D:\Portfolio
npm run build
npm run dev
```

Open **http://127.0.0.1:4173**. Stop the server with Ctrl+C. To choose a different
port: `$env:PORT='4174'; npm run dev`. Serve `dist/` over HTTP; do not open the
generated HTML as `file://`, because assets and case-study routes use root paths.

```powershell
npm test
# With the local preview running and Google Chrome installed:
npm run test:browser
```

Browser QA uses Node's native WebSocket and the existing Chrome executable.
`CHROME_PATH` can override the Windows default; `PREVIEW_URL` can override the
local preview URL. No Playwright, browser or package installation is required.

## Update the site

- **All professional content:** `src/content.mjs` owns profile links, contact
  drafts, project dates, technology lists, results, case studies and galleries.
- **Markup and page composition:** `src/render.mjs` generates complete HTML at
  build time. Content, native links and experience disclosures work without JS.
- **Visual diagrams:** `src/visuals.mjs` uses accessible SVG with explicitly
  supplied values or labeled conceptual structures.
- **Appearance and behavior:** `public/styles.css` and `public/app.js`.
- **Resume:** replace `public/assets/annam-poshak-resume.pdf` with the current
  approved PDF, then check the centralized contact links against it.

After edits, run the build. The preview serves updated output without restarting.
Do not directly edit generated files in `dist/`.

## Add or replace screenshots

1. Confirm the image can be displayed publicly. Remove private records before
   adding it. Never turn confidential data into a portfolio screenshot.
2. Add a compressed WebP under `public/assets/`. For a landscape screenshot,
   provide a 1440 px version and a matching `-800.webp` version at 800 px.
3. Update the project's `gallery` entry with `src`, meaningful `alt` text and an
   evidence-specific `caption`. Use `portrait: true` for the 390 × 844 mobile
   screenshot convention. Change the explicit dimensions in the renderer when
   using different source dimensions.
4. Keep synthetic prototypes labeled even when their UI looks realistic. Record
   the source and capture date in `docs/ASSETS.md`.
5. Run `npm run build` and `npm test`; inspect the affected case study at mobile
   and desktop widths. Do not recapture unchanged images unnecessarily.

The retained capture utilities are optional authoring tools. They require the
original local prototype, an existing Chrome installation, and (for WebP
conversion only) the already-installed Pillow. They are not build dependencies.
`capture-assets.mjs` visits the owner-supplied SVLN site; rerun only when external
access is authorized. It uses a temporary font-stripped copy of the prototype and
never changes the original file.

## Deploy

The deployable artifact is `dist/`. Configuration is included for Netlify and
Vercel. There are no server secrets, third-party scripts, submission services or
client-side external data requests.

First set `profile.siteUrl` in `src/content.mjs` to the real public HTTPS origin
(no invented domain), then rebuild. This enables absolute Open Graph URLs,
canonical links and `sitemap.xml`. An actual 1200 × 630 social card is included.

With an already-installed, authenticated CLI and the intended account selected:

```powershell
# Netlify: link/select the intended site before running the production command.
netlify deploy --dir=dist --prod

# Or Vercel, from the project root; vercel.json defines build/output settings.
vercel --prod
```

Alternatively upload `dist/` through Netlify's manual deploy interface, or connect
the source to a hosting project with build command `node scripts/build.mjs` and
output directory `dist`. A framework is not required. Hosting CLI installation,
Git commits/pushes and publication were **not** performed in this session.

The Sites plugin is another option, but its source workflow commits and pushes
the source. The user's no-commit/no-push rule requires separate authorization
before using that workflow.

## Technical choices and verification limits

The requested framework stack was a preference. This implementation uses
dependency-free static generation and native browser APIs to honor the no-install
constraint and minimize JavaScript. It is **not a Next.js/React project**. Layout,
content configuration and motion code are separated so a later framework migration
does not require rewriting the project stories.

Only the desktop, motion-enabled hero uses canvas; drawing is event-driven,
visibility-gated and capped at 1.5 device-pixel ratio. Mobile/reduced-motion users
get lightweight SVG. Native scrolling remains available; no scroll-jacking.
Audio starts off on every load. The last choice is remembered as a hint, but
playback always requires a fresh explicit click. Contact links need a configured
email/phone handler on the visitor's device.

QA details and missing evidence are in `docs/CHECKPOINT.md` and `docs/ASSETS.md`.
No Lighthouse score, remote LCP target, cross-browser certification or deployment
success is claimed. No cricket dataset pipeline or source recovery was run.
