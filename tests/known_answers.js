// Known-answer tests for the dashboard's own arithmetic and file matching.
// Runs the functions inside the page, so it tests the code that ships.
//   node tests/known_answers.js     (needs Playwright with Chromium)
const path = require('path');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(process.env.PLAYWRIGHT_PATH || 'playwright'); }
const ROOT = path.resolve(__dirname, '..');
const exe = process.env.CHROMIUM_PATH || undefined;
(async () => {
  const b = await pw.chromium.launch(exe ? { executablePath: exe } : {});
  const p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(ROOT, 'OSeMOSYS_dash.html'));
  await p.waitForTimeout(500);
  // 1. before any folder: no countries, no markers, nothing invented
  const before = await p.evaluate(() => ({ iso: Object.keys(ISO).length, scen: Object.keys(SCEN).length, fams: FAMS.length }));
  // 2. a read without config is refused with a message
  await p.evaluate(async () => { await ingestFiles([{ name: 'results_REF_LDR_XAA.txt', path: 'results/results_REF_LDR_XAA.txt', file: { text: async () => 'x', size: 1, lastModified: 0 } }]); });
  const noCfg = await p.evaluate(() => ({ ok: CFG.ok, note: document.getElementById('loadNote').textContent }));
  // 3. load the repository's own config and results
  await p.setInputFiles('#dirIn', ROOT);
  await p.waitForFunction(() => Object.values(S.C).reduce((a, c) => a + c.order.length, 0) === 18 && document.getElementById('loadNote').textContent.startsWith('18'), null, { timeout: 30000 });
  const r = await p.evaluate(() => {
    const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
    const out = {};
    // CRF: r(1+r)^n / ((1+r)^n - 1); at r = 0 it is 1/n
    out.crf_10pc_10y = near(CRF(0.10, 10), 0.16274539488251152, 1e-12);
    out.crf_0_20y = near(CRF(0, 20), 0.05, 1e-15);
    out.crf_bad_life = CRF(0.1, 0) === null;
    // patterns: both layouts, case-insensitive, archive folders refused, unknown codes refused
    const c = (p) => JSON.stringify(classify(p, p.split('/').pop()));
    out.pat_flat = c('results/results_NZE_CDR_XAB.txt') === '{"iso":"XAB","key":"NZE_CDR"}';
    out.pat_nested = c('results/XAC/REF_MDR.txt') === '{"iso":"XAC","key":"REF_MDR"}';
    out.pat_case = c('Results/RESULTS_ref_ldr_xaa.TXT') === '{"iso":"XAA","key":"REF_LDR"}';
    out.pat_under_parent = c('OSeMOSYS_dash/results/run_REF_LDR_XAA.txt') === '{"iso":"XAA","key":"REF_LDR"}';
    out.pat_archive = c('results/archive/results_REF_LDR_XAA.txt') === 'null';
    out.pat_unknown_iso = c('results/results_REF_LDR_BGD.txt') === 'null';
    out.pat_unknown_scen = c('results/results_BAU_LDR_XAA.txt') === 'null';
    const deep = compilePattern('**/results_{iso3}/results_*_{scenario}.txt');
    out.pat_doc_example = deep.re.test('Country A/results_XAA/results_xaa_REF_LDR.txt') && !deep.re.test('results_XAA/other_REF_LDR.txt');
    let threw = false; try { compilePattern('results/*.txt'); } catch (e) { threw = true; }
    out.pat_needs_tokens = threw;
    // markdown tables: found by heading, backticks stripped, columns normalised
    const t = mdTables('## Some Table\n\n| Code | Rate (%) |\n|---|---|\n| `A_B` | 1.5 |\n| C | |\n');
    out.md_table = t.length === 1 && t[0].heading === 'Some Table' && t[0].rows[0].code === 'A_B' && t[0].rows[0].rate === '1.5' && t[0].rows[1].rate === '';
    // discount rates: scenario rate, then the country override
    out.dr_scenario = near(drFor('Country A', 'REF_MDR'), 0.10);
    out.dr_country = near(drFor('Country C', 'NZE_CDR'), 0.085);
    out.dr_unknown = drFor('Country A', 'XYZ') === null;
    // annualised charge, pipeline: Country A solar, 200 MW x 750 M USD/GW = 150 M USD in 2026,
    // life 25 y at 6 %: 150 x CRF(0.06, 25) per year for 2026-2050 (25 payments)
    useCountry('Country A');
    const ac = annualisedCapital(S.scen.REF_LDR, 'Country A', 0.06);
    const solar = (ac.pl.Solar || []).reduce((a, v) => a + v, 0);
    out.ac_pipeline_solar = near(solar, 25 * 150 * CRF(0.06, 25), 1e-9);
    out.ac_pipeline_value = near(solar, 293.3502, 1e-3);
    return out;
  });
  const all = Object.assign({
    empty_before_config: before.iso === 0 && before.scen === 0 && before.fams === 0,
    refuses_without_config: noCfg.ok === false && /No usable configuration/.test(noCfg.note),
    no_page_errors: errs.length === 0
  }, r);
  let n = 0;
  for (const [k, v] of Object.entries(all)) { console.log((v ? 'ok   ' : 'FAIL ') + k); if (!v) n++; }
  if (errs.length) console.log(errs.join('\n'));
  await b.close();
  console.log(n ? `\n${n} failed` : '\nall passed'); process.exit(n ? 1 : 0);
})();
