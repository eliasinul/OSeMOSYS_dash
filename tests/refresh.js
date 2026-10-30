// Refresh test. Playwright cannot answer the browser's folder picker, so the
// linked folder is replaced by an in-page stand-in with the same interface
// (entries(), getFile(), queryPermission()) built from this repository.
// Checks: Refresh from Home re-reads everything, Refresh with a country open
// re-reads that country, the storage name is not the CVF dash's, and a folder
// without config/ is reported on the map instead of failing silently.
//   node tests/refresh.js
const fs = require('fs'), path = require('path');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(process.env.PLAYWRIGHT_PATH || 'playwright'); }
const ROOT = path.resolve(__dirname, '..');
const exe = process.env.CHROMIUM_PATH || undefined;
const SKIP = new Set(['.git', 'node_modules']);
function tree(d) { const o = {}; for (const n of fs.readdirSync(d)) { if (SKIP.has(n)) continue; const p = path.join(d, n);
  o[n] = fs.statSync(p).isDirectory() ? tree(p) : (/\.(md|txt)$/i.test(n) ? fs.readFileSync(p, 'utf8') : ''); } return o; }
(async () => {
  const b = await pw.chromium.launch(exe ? { executablePath: exe } : {});
  const p = await b.newPage({ viewport: { width: 1300, height: 850 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(ROOT, 'OSeMOSYS_dash.html'));
  await p.waitForTimeout(800);
  const T = tree(ROOT);
  const r = await p.evaluate(async T => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const mk = (name, node) => typeof node === 'string'
      ? { kind: 'file', name, getFile: async () => new File([node], name, { lastModified: 0 }) }
      : { kind: 'directory', name, queryPermission: async () => 'granted', requestPermission: async () => 'granted',
          async *entries() { for (const [k, v] of Object.entries(node)) yield [k, mk(k, v)]; } };
    const total = () => Object.values(S.C).reduce((a, c) => a + c.order.length, 0);
    const out = {};
    out.own_storage = !/moya-desk/.test(idb.toString().replace(/\/\*[\s\S]*?\*\//g, ''));
    ROOT = mk('OSeMOSYS_dash', T); refreshBtn.disabled = false;
    refreshBtn.click(); await wait(2500);
    out.home_refresh_reads_all = total() === 18 && /all countries read/.test(linkNote.textContent);
    useCountry('Country A'); S.sel = 'REF_LDR'; S.tab = 'overview'; render();
    refreshBtn.click(); await wait(2500);
    out.scoped_refresh = total() === 18 && /Country A re-read/.test(linkNote.textContent) && S.tab === 'overview' && S.sel === 'REF_LDR';
    S.tab = 'home'; render(); await wait(200);
    document.querySelector('.ovl[data-act="refresh"]').click(); await wait(2500);
    out.map_refresh_button = /all countries read/.test(linkNote.textContent) && total() === 18;
    // a folder without config/ (for example results/ alone) must say so on the map
    ROOT = mk('results', T.results); S.tab = 'home'; S.selC = null; render();
    refreshBtn.click(); await wait(2500);
    const call = document.getElementById('loadCall');
    out.no_config_reported_on_map = !!call && /Nothing read from results/.test(call.textContent) && /config/.test(call.textContent);
    return out;
  }, T);
  r.no_page_errors = errs.length === 0;
  let n = 0; for (const [k, v] of Object.entries(r)) { console.log((v ? 'ok   ' : 'FAIL ') + k); if (!v) n++; }
  if (errs.length) console.log(errs.join('\n'));
  await b.close(); console.log(n ? `\n${n} failed` : '\nall passed'); process.exit(n ? 1 : 0);
})();
