// Regenerate the screenshots in docs/img/ used by docs/TOUR.md, in both
// themes, from the placeholder results in this repository.
//   node tools/make_screenshots.js      (needs Playwright with Chromium)
const path = require('path');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(process.env.PLAYWRIGHT_PATH || 'playwright'); }
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'docs', 'img');
const exe = process.env.CHROMIUM_PATH || undefined;
const W = 1440, H = 900;

// Each step: a name, how to set the page up, and what to frame.
const STEPS = [
  { name: '01_connect', blank: true },
  { name: '02_map_hover', setup: async p => {
      const pin = await p.$('#worldMap g.pin.on[data-country="Country A"] .hit'); await pin.hover(); } },
  // the panel opens below the map; it is framed on its own, with the dot layer
  // (fixed to the window, not to the map) hidden for the shot
  { name: '03_more_scenarios', element: '.homebar', setup: async p => {
      await p.evaluate(() => { S.more = true; S.homePanel = 'scen'; render(); }); } },
  { name: '04_overview', state: { c: 'Country A', s: 'REF_LDR', tab: 'overview' } },
  { name: '05_generation', state: { c: 'Country A', s: 'NZE_LDR', tab: 'generation' } },
  { name: '06_capacity', state: { c: 'Country A', s: 'NZE_LDR', tab: 'capacity' } },
  { name: '07_techresp', state: { c: 'Country A', s: 'REF_LDR', tab: 'techresp' } },
  { name: '08_costs', state: { c: 'Country A', s: 'REF_LDR', tab: 'costs' } },
  { name: '09_annualised', state: { c: 'Country A', s: 'REF_LDR', tab: 'costs' },
    scrollTo: 'h3:text-is("Annualised capital charge, new build and committed pipeline")' },
  { name: '10_emissions', state: { c: 'Country A', s: 'NZE_LDR', tab: 'emissions' } },
  { name: '11_info', state: { c: 'Country C', s: 'NZE_MDR', tab: 'overview' },
    setup: async p => { await p.click('.card .info >> nth=0'); } },
];

(async () => {
  const b = await pw.chromium.launch(exe ? { executablePath: exe } : {});
  for (const theme of ['light', 'dark']) {
    const ctx = await b.newContext({ viewport: { width: W, height: H }, colorScheme: theme, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(ROOT, 'OSeMOSYS_dash.html'));
    await p.waitForTimeout(5500);                       // let the opening finish
    for (const st of STEPS) {
      if (st.blank) {
        await p.screenshot({ path: path.join(OUT, `${st.name}_${theme}.png`) });
        await p.setInputFiles('#dirIn', ROOT);
        await p.waitForFunction(() => document.getElementById('loadNote').textContent.startsWith('18'), null, { timeout: 30000 });
        continue;
      }
      await p.setViewportSize({ width: W, height: st.height || H });
      await p.mouse.move(W - 5, (st.height || H) - 5);
      await p.evaluate(s => {
        S.more = false; S.homePanel = null;
        if (s) { useCountry(s.c); S.sel = s.s; S.tab = s.tab; } else { S.tab = 'home'; }
        render(); window.scrollTo(0, 0); document.querySelector('.body') && (document.querySelector('.body').scrollTop = 0);
      }, st.state || null);
      await p.waitForTimeout(600);
      if (st.setup) await st.setup(p);
      if (st.scrollTo) await p.locator(st.scrollTo).first().evaluate(e => {
        const c = e.closest('.card') || e; c.style.scrollMarginTop = '110px'; c.scrollIntoView({ block: 'start' }); });
      await p.waitForTimeout(1800);                     // bars grow in
      if (st.element) {
        const box = await p.locator(st.element).first().evaluate(e => {
          const g = document.getElementById('globe'); if (g) g.style.visibility = 'hidden';
          e.scrollIntoView({ block: 'start' });
          const a = e.getBoundingClientRect(), last = e.parentElement.lastElementChild.getBoundingClientRect();
          return { x: 0, y: Math.max(0, a.top - 16), width: innerWidth, height: Math.min(innerHeight, last.bottom + 16) - Math.max(0, a.top - 16) };
        });
        await p.screenshot({ path: path.join(OUT, `${st.name}_${theme}.png`), clip: box });
        await p.evaluate(() => { const g = document.getElementById('globe'); if (g) g.style.visibility = ''; });
      } else await p.screenshot({ path: path.join(OUT, `${st.name}_${theme}.png`) });
    }
    if (errs.length) console.log(theme, 'page errors:', errs.join(' | '));
    await ctx.close();
  }
  await b.close();
  console.log('wrote', STEPS.length * 2, 'screenshots to docs/img/');
})();
