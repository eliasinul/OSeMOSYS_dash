// Smoke test: open the dashboard, feed it this repository through the folder
// input (the fallback path every browser has), and check that the config and
// the placeholder results are read, the markers carry hover cards, and every
// tab renders without a page error, in both themes.
//   node tests/smoke.js            (needs Playwright with Chromium)
const path = require('path');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(process.env.PLAYWRIGHT_PATH || 'playwright'); }
const ROOT = path.resolve(__dirname, '..');
const exe = process.env.CHROMIUM_PATH || undefined;
const fail = []; const ok = m => console.log('ok   ' + m); const bad = m => { fail.push(m); console.log('FAIL ' + m); };
(async () => {
  const b = await pw.chromium.launch(exe ? { executablePath: exe } : {});
  const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(ROOT, 'OSeMOSYS_dash.html'));
  await p.waitForTimeout(5000);                                  // opening animation
  await p.setInputFiles('#dirIn', ROOT);
  await p.waitForFunction(() => Object.values(S.C).reduce((a, c) => a + c.order.length, 0) === 18 && document.getElementById('loadNote').textContent.startsWith('18'), null, { timeout: 30000 });
  await p.waitForTimeout(800);
  const st = await p.evaluate(() => ({
    ok: CFG.ok, problems: CFG.problems, countries: Object.keys(ISO).length,
    loaded: Object.fromEntries(Object.entries(S.C).map(([n, c]) => [n, c.order.length])),
    pins: document.querySelectorAll('#worldMap g.pin').length,
    lit: document.querySelectorAll('#worldMap g.pin.on').length,
    tt: (document.querySelector('#worldMap g.pin.on') || {}).dataset?.tt || '',
    title: document.title, base: BASELINE, fam: FAMS.length,
    colour: getComputedStyle(document.documentElement).getPropertyValue('--fam-0').trim(),
    rate: drFor('Country C', 'REF_CDR'), rateA: drFor('Country A', 'REF_MDR')
  }));
  st.ok ? ok('config read') : bad('config not ok: ' + st.problems.join('; '));
  st.problems.length ? bad('config warnings: ' + st.problems.join('; ')) : ok('no config warnings');
  st.countries === 6 && st.pins === 6 ? ok('6 countries, 6 markers') : bad(`countries ${st.countries}, markers ${st.pins}`);
  st.lit === 3 ? ok('3 markers lit') : bad('lit markers ' + st.lit);
  JSON.stringify(Object.entries(st.loaded).sort()) === JSON.stringify([['Country A', 6], ['Country B', 6], ['Country C', 6]]) ? ok('18 scenarios') : bad('loaded ' + JSON.stringify(st.loaded));
  /Population/.test(st.tt) && /tt-mix/.test(st.tt) ? ok('hover card has profile and mix') : bad('hover card: ' + st.tt.slice(0, 80));
  st.title === 'OSeMOSYS Result Dash' ? ok('title from dashboard.md') : bad('title ' + st.title);
  st.base === 'REF_LDR' ? ok('base case REF_LDR') : bad('base ' + st.base);
  st.colour.toLowerCase() === '#3a3a3a' ? ok('family colour injected') : bad('colour ' + st.colour);
  Math.abs(st.rate - 0.085) < 1e-12 && Math.abs(st.rateA - 0.10) < 1e-12 ? ok('country rate overrides scenario rate') : bad(`rates ${st.rate} ${st.rateA}`);
  // hover a lit marker
  const pin = await p.$('#worldMap g.pin.on .hit'); await pin.hover(); await p.waitForTimeout(300);
  const ttv = await p.evaluate(() => { const t = document.getElementById('tt'); return t && getComputedStyle(t).opacity !== '0' && t.textContent; });
  ttv && /Country/.test(ttv) ? ok('tooltip shows on hover') : bad('tooltip not shown');
  await p.screenshot({ path: path.join(ROOT, 'tests', 'out_home.png') });
  for (const theme of ['light', 'dark']) {
    await p.evaluate(t => document.documentElement.setAttribute('data-theme', t), theme);
    for (const tab of ['overview', 'generation', 'capacity', 'techresp', 'costs', 'emissions']) {
      await p.evaluate(t => { useCountry('Country A'); S.sel = 'REF_LDR'; S.tab = t; render(); }, tab);
      await p.waitForTimeout(400);
      const n = await p.evaluate(() => document.querySelectorAll('#view svg').length);
      n > 0 ? ok(`${theme} ${tab}: ${n} charts`) : bad(`${theme} ${tab}: no charts`);
      if (theme === 'dark' && (tab === 'techresp' || tab === 'costs')) await p.screenshot({ path: path.join(ROOT, 'tests', `out_${tab}.png`), fullPage: false });
    }
  }
  errs.length ? bad('page errors: ' + errs.join(' | ')) : ok('no page errors');
  await b.close();
  console.log(fail.length ? `\n${fail.length} failed` : '\nall passed');
  process.exit(fail.length ? 1 : 0);
})();
