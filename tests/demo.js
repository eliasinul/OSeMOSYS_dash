// Demo page test: docs/index.html shows the placeholder results on opening with
// no prompt, says they are synthetic, gives way to a folder the reader links,
// and is in step with OSeMOSYS_dash.html, config/ and results/.
//   node tests/demo.js             (needs Playwright with Chromium)
const fs = require('fs'), os = require('os'), path = require('path');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(process.env.PLAYWRIGHT_PATH || 'playwright'); }
const ROOT = path.resolve(__dirname, '..');
const exe = process.env.CHROMIUM_PATH || undefined;
const TABS = ['overview', 'generation', 'capacity', 'techresp', 'costs', 'emissions'];
// line endings are ignored: git may turn LF into CRLF in a Windows checkout
const read = (...a) => fs.readFileSync(path.join(ROOT, ...a), 'utf8').replace(/\r\n/g, '\n');
(async () => {
  const r = {};
  // in step with its sources: without the tag, the page is the dashboard exactly
  const page = read('docs', 'index.html');
  const m = /<script id="osd-sample" type="application\/json">([\s\S]*?)<\/script>/.exec(page);
  if (!m) { console.log('FAIL docs/index.html carries no sample; run python tools/make_demo_page.py'); process.exit(1); }
  const bundle = JSON.parse(m[1]);
  r.page_matches_dashboard = page.replace(m[0], () => '') === read('OSeMOSYS_dash.html');
  r.sample_matches_files = bundle.files.every(f => f.text === read(f.path));
  const onDisk = [...fs.readdirSync(path.join(ROOT, 'config')).filter(n => n.endsWith('.md') && n !== 'README.md').map(n => 'config/' + n),
                  ...fs.readdirSync(path.join(ROOT, 'results')).filter(n => n.endsWith('.txt')).map(n => 'results/' + n)].sort();
  r.sample_lists_every_file = JSON.stringify(bundle.files.map(f => f.path).sort()) === JSON.stringify(onDisk);
  r.results_are_synthetic = bundle.files.filter(f => f.path.startsWith('results/')).every(f => /synthetic/i.test(f.text.split(/\r?\n/)[1]));

  const b = await pw.chromium.launch(exe ? { executablePath: exe } : {});
  const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(ROOT, 'docs', 'index.html'));
  await p.waitForTimeout(6500);                                  // opening animation
  const home = await p.evaluate(() => ({
    total: Object.values(S.C).reduce((a, c) => a + c.order.length, 0), sample: S.sample, ok: CFG.ok, problems: CFG.problems,
    call: !!document.getElementById('loadCall'), callme: document.querySelectorAll('.ovl.callme').length,
    lit: document.querySelectorAll('#worldMap g.pin.on').length,
    hint: (document.getElementById('mapHint') || {}).textContent || '',
    ovl: (document.getElementById('ovlNote') || {}).textContent || '',
    link: !!document.querySelector('.ovl[data-act="link"]') }));
  r.reads_18_scenarios = home.total === 18 && home.ok && !home.problems.length;
  r.three_markers_lit = home.lit === 3;
  r.no_load_prompt = !home.call && home.callme === 0;
  r.home_says_placeholder = home.sample && /synthetic/i.test(home.hint) && /sample/.test(home.ovl);
  r.link_button_kept = home.link;
  await p.screenshot({ path: path.join(ROOT, 'tests', 'out_demo_home.png') });

  const tabs = await p.evaluate(async TABS => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    useCountry('Country A'); S.sel = 'REF_LDR'; const o = {};
    for (const t of TABS) { S.tab = t; render(); await wait(300); o[t] = document.querySelectorAll('#view svg').length; }
    S.tab = 'overview'; render(); await wait(1500);
    o.tag = document.getElementById('caseTag').textContent; o.src = S.C['Country A'].scen.REF_LDR.src; return o;
  }, TABS);
  r.tabs_draw = TABS.every(t => tabs[t] > 0);
  r.tabs_say_sample = /sample/.test(tabs.tag) && tabs.src === 'sample';
  await p.screenshot({ path: path.join(ROOT, 'tests', 'out_demo_overview.png') });

  // a folder the reader links replaces the sample whole, even with a country open
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'osd-demo-'));
  for (const f of bundle.files.filter(f => f.path.startsWith('config/') || /_XAA\.txt$/.test(f.path))) {
    fs.mkdirSync(path.dirname(path.join(dir, f.path)), { recursive: true }); fs.writeFileSync(path.join(dir, f.path), f.text); }
  await p.setInputFiles('#dirIn', dir);
  await p.waitForFunction(() => !S.sample && Object.values(S.C).reduce((a, c) => a + c.order.length, 0) === 6, null, { timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(500);
  const after = await p.evaluate(() => ({ sample: S.sample, names: Object.keys(S.C).filter(k => S.C[k].order.length),
    tag: document.getElementById('caseTag').textContent, src: (S.C['Country A'].scen.REF_LDR || {}).src }));
  fs.rmSync(dir, { recursive: true, force: true });
  r.folder_replaces_sample = !after.sample && after.names.join() === 'Country A' && !/sample/.test(after.tag) && after.src === 'file';
  r.no_page_errors = errs.length === 0;
  let n = 0; for (const [k, v] of Object.entries(r)) { console.log((v ? 'ok   ' : 'FAIL ') + k); if (!v) n++; }
  if (errs.length) console.log(errs.join('\n'));
  await b.close(); console.log(n ? `\n${n} failed` : '\nall passed'); process.exit(n ? 1 : 0);
})();
