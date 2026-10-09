// The designer's extractor for THE MODES TAB redesign: reads a midpoint's live page (the bench, :5181) into data for the
// clickable designs. Run in the page at a midpoint: (await import('http://localhost:5174/design/extract.js')).extractModes(name, note)
// It reads what the page prints and the data-attributes the page already carries; it changes nothing it does not put back
// (the chosen mode is set back to IS; the lights are closed again).
export async function extractModes(name, note) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const A = (el, n) => (el ? el.getAttribute(n) : null);
  const txt = (el) => (el ? el.innerText.replace(/\s+/g, ' ').trim() : null);
  const out = { name, note, at: new Date().toISOString() };
  out.whereami = await fetch('/__whereami').then((r) => r.json()).then((j) => j.head.slice(0, 7));
  out.edge = txt(document.querySelector('[data-midpoint-strip]'))?.split(' · ')[0];
  // labels: F's and Φ's roles from the drawing, each corner's from its light
  const labels = {};
  const grab = () => {
    for (const g of document.querySelectorAll('[data-midpoint-drawing] [data-inside-point]')) {
      const t = g.querySelector('text');
      if (t) labels[g.getAttribute('data-inside-point')] = t.textContent.split(' · ')[0].trim();
    }
  };
  grab();
  const lights = [...document.querySelectorAll('[data-midpoint-strip] [data-midpoint-source-open="closed"]')];
  out.corners = lights.map((b) => b.innerText.replace("'s light", '').trim());
  for (let k = 0; k < out.corners.length; k++) {
    const b = [...document.querySelectorAll('[data-midpoint-strip] [data-midpoint-source-open="closed"]')][k];
    if (!b) continue;
    b.click(); await sleep(600); grab();
    const c = document.querySelector('[data-midpoint-strip] [data-midpoint-source-open="open"]');
    if (c) { c.click(); await sleep(400); }
  }
  out.labels = labels;
  // his words and each word's facts (the pairing's modes line)
  out.words = [];
  for (const w of [...document.querySelectorAll('[data-medium-mode]')].map((b) => b.getAttribute('data-medium-mode'))) {
    document.querySelector(`[data-medium-mode="${CSS.escape(w)}"]`).click(); await sleep(220);
    const blk = document.querySelector('[data-medium-modes]').parentElement;
    out.words.push({
      word: w,
      dirs: [...blk.querySelectorAll('[data-medium-dir]')].map((d) => ({ dir: A(d, 'data-medium-dir'), text: txt(d), chosen: d.hasAttribute('data-medium-dir-chosen') })),
      converse: blk.innerText.split('\n').find((l) => /the other way round/.test(l)) || null,
      opaque: [...blk.querySelectorAll('[data-medium-opaque]')].map((d) => ({ v: A(d, 'data-medium-opaque'), text: txt(d), chosen: d.hasAttribute('data-medium-opaque-chosen') })),
    });
  }
  document.querySelector('[data-medium-mode="IS"]').click(); await sleep(220);
  // the pair's relatings: one row per withdraw hand in the acts list, the sentence before ' · withdraw'
  const acts = document.querySelector('[data-midpoint-acts]');
  for (const b of [...(acts ? acts.querySelectorAll('button') : [])].filter((b) => b.innerText.trim() === 'show')) { b.click(); await sleep(150); }
  out.actsLines = acts ? acts.innerText.split('\n').filter((l) => l.trim()) : [];
  out.relatings = [];
  for (const b of acts ? acts.querySelectorAll('[data-medium-withdraw], [data-midpoint-withdraw]') : []) {
    let row = b; while (row.parentElement && row.parentElement !== acts && !/withdraw/.test(row.parentElement.innerText.split('\n')[0] || '')) row = row.parentElement;
    const first = (row.parentElement && row.parentElement !== acts ? row.parentElement : row).innerText.split('\n')[0];
    out.relatings.push({ key: A(b, 'data-medium-withdraw') || A(b, 'data-midpoint-withdraw'), line: first.trim() });
  }
  // the point tab
  document.querySelector('[data-midpoint-tab="point"]').click(); await sleep(400);
  const pane = document.querySelector('[data-midpoint-point]');
  out.point = pane.innerText.split('\n').filter((l) => l.trim()).slice(0, 40);
  // the corners tab (its lines, for what sits beside the modes tab)
  document.querySelector('[data-midpoint-tab="corners"]').click(); await sleep(400);
  out.cornersTab = pane.innerText.split('\n').filter((l) => l.trim()).slice(0, 60);
  // the modes tab with every list shown
  document.querySelector('[data-midpoint-tab="modes"]').click(); await sleep(400);
  for (const b of [...pane.querySelectorAll('button')].filter((b) => b.innerText.trim() === 'show')) { b.click(); await sleep(200); }
  out.head = txt(pane.querySelector('[data-medium-head]'));
  out.viewHeads = [...pane.querySelectorAll('[data-medium-view-head]')].map(txt);
  out.views = [...pane.querySelectorAll('[data-medium-view]')].map((v) => v.innerText.split('\n').map((l) => l.trim()).filter(Boolean));
  out.altHeads = [...pane.querySelectorAll('[data-medium-altitude-head]')].map((e) => ({ corner: A(e, 'data-medium-altitude-head'), forks: +A(e, 'data-medium-altitude-forks'), bonds: +A(e, 'data-medium-altitude-bonds'), refused: +A(e, 'data-medium-altitude-refused'), denied: +A(e, 'data-medium-altitude-denied'), text: txt(e).replace(/ (show|hide)$/, '') }));
  const blockOf = (el) => {
    let p = el;
    while (p.parentElement && !p.parentElement.hasAttribute('data-medium-modes-tab') && p.parentElement.querySelectorAll('[data-medium-passage], [data-medium-bond]').length <= 1) p = p.parentElement;
    return p;
  };
  out.passages = [...pane.querySelectorAll('[data-medium-passage]')].map((e) => ({ kind: A(e, 'data-medium-passage-shape') || 'passage', from: A(e, 'data-medium-passage-from'), by: A(e, 'data-medium-passage-by'), reading: A(e, 'data-medium-passage-reading'), key: A(e, 'data-medium-passage'), legs: txt(e), lines: blockOf(e).innerText.split('\n').map((l) => l.trim()).filter(Boolean) }));
  out.bonds = [...pane.querySelectorAll('[data-medium-bond]')].map((e) => ({ key: A(e, 'data-medium-bond'), reading: A(e, 'data-medium-bond-reading'), refusal: A(e, 'data-medium-bond-refusal'), lines: e.innerText.split('\n').map((l) => l.trim()).filter(Boolean) }));
  out.parallels = [...pane.querySelectorAll('[data-medium-parallel]')].map((e) => ({ key: A(e, 'data-medium-parallel'), discordance: e.hasAttribute('data-medium-parallel-discordance'), text: txt(e) }));
  out.parallelsHead = txt(pane.querySelector('[data-medium-parallels-head]'))?.replace(/ (show|hide)$/, '');
  out.ruleGestures = [...pane.querySelectorAll('[data-medium-rule-gesture], [data-medium-bond-rule-gesture]')].map(txt);
  out.rules = [...pane.querySelectorAll('[data-medium-rule]')].map(txt);
  out.unruled = txt(pane.querySelector('[data-medium-unruled]'));
  out.own = txt(pane.querySelector('[data-medium-own]'));
  out.faces = [...pane.querySelectorAll('[data-medium-faces]')].map(txt);
  out.modesTabText = pane.innerText.split('\n').filter((l) => l.trim());
  const body = JSON.stringify(out, null, 1);
  const saved = await fetch(`http://localhost:5174/save/${name}.json`, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body }).then((r) => r.text()).catch((e) => 'save failed: ' + e);
  return { saved, bytes: body.length, words: out.words.length, relatings: out.relatings.length, passages: out.passages.length, bonds: out.bonds.length, parallels: out.parallels.length, labels: Object.keys(labels).length, corners: out.corners, views: out.views.length };
}
