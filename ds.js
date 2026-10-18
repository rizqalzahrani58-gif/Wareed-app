/* ds.js — علم البيانات في تطبيق وريد (قرار أبو راكان ١٨ أكتوبر ٢٠٢٦: «داتا ساينس مو BI»).
   البيانات: مجموعة ds (latest) من محرك DS على Wareed BI. خاصة بأبو راكان وروان ود. ناصر (RLS: بدون قاعدة = المالك والموثوق بس).
   يضيف: (١) شريط توقعات فوق الداشبورد، (٢) تبويب «🔬 علم البيانات» داخل التوقعات المالية عبر window.__fcDS. */
(() => {
  if (window.__dsLoaded) return; window.__dsLoaded = 1;
  const C = { blue: "#3987e5", orange: "#d95926", aqua: "#199e70", good: "#0ca30c", warn: "#fab219", bad: "#d03b3b", tx: "#f3f5f9", tx2: "#c9d0de", mu: "#8f98ad", grid: "rgba(255,255,255,.10)", surf: "#161a23" };
  const TIER = { "كبرى": C.blue, "متوسطة": C.orange, "صغيرة": C.aqua };
  const css = `
.dsv{display:flex;flex-direction:column;gap:12px;font-family:"IBM Plex Sans Arabic","Readex Pro",system-ui,sans-serif;color:${C.tx}}
.dsv *{box-sizing:border-box}
.dsChips{display:flex;flex-wrap:wrap;gap:6px}
.dsChip{font:inherit;font-size:.85em;padding:6px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:${C.tx2};cursor:pointer}
.dsChip.on{background:rgba(90,162,255,.18);border-color:rgba(90,162,255,.55);color:${C.tx}}
.dsChip:focus-visible{outline:2px solid #9cc4ff;outline-offset:2px}
.dsCard{width:100%;padding:12px 14px;border-radius:18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14)}
.dsCard h4{margin:0 0 6px;font-size:.95em;font-weight:600}
.dsCard p{margin:4px 0;line-height:1.65;font-size:.9em;color:${C.tx2}}
.dsMu{color:${C.mu};font-size:.8em}
.dsTiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px}
.dsTile{padding:10px 12px;border-radius:16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);min-width:0}
.dsTile .k{font-size:.78em;color:${C.mu}}
.dsTile .v{font-size:1.35em;font-weight:700;margin:2px 0;font-variant-numeric:tabular-nums}
.dsTile .s{font-size:.76em;color:${C.tx2};line-height:1.5}
.dsChart{position:relative;width:100%}
.dsChart svg{display:block;width:100%;height:auto;direction:ltr}
.dsTip{position:absolute;pointer-events:none;background:#0f1218;border:1px solid rgba(255,255,255,.18);border-radius:10px;padding:6px 9px;font-size:.78em;line-height:1.5;color:${C.tx};white-space:nowrap;opacity:0;transition:opacity .12s;z-index:3}
.dsLeg{display:flex;flex-wrap:wrap;gap:10px;font-size:.78em;color:${C.tx2};margin-top:4px}
.dsLeg i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-inline-end:5px;vertical-align:-1px}
.dsRows{display:flex;flex-direction:column;gap:6px}
.dsRow{display:grid;grid-template-columns:minmax(0,7.5em) minmax(0,1fr) 4.8em;gap:8px;align-items:center;font-size:.82em}
.dsRow .n{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsRow .val{text-align:end;font-variant-numeric:tabular-nums;color:${C.tx2}}
.dsBarWrap{position:relative;height:16px;direction:ltr}
.dsBarWrap .z{position:absolute;top:0;bottom:0;width:1px;background:rgba(255,255,255,.35)}
.dsBarWrap .ci{position:absolute;top:6px;height:4px;border-radius:2px}
.dsBarWrap .pt{position:absolute;top:3px;width:10px;height:10px;border-radius:50%;margin-left:-5px;box-shadow:0 0 0 2px ${C.surf}}
.dsAn{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 10px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.10)}
.dsAn b{font-weight:600}.dsAn .r{text-align:end;font-variant-numeric:tabular-nums}
.dsTag{display:inline-block;font-size:.72em;padding:1px 7px;border-radius:999px;border:1px solid currentColor;margin-inline-start:6px}
.dsTbl{width:100%;border-collapse:collapse;font-size:.8em}
.dsTbl th{color:${C.mu};font-weight:500;text-align:start;padding:4px 2px;border-bottom:1px solid rgba(255,255,255,.12)}
.dsTbl td{padding:5px 2px;border-bottom:1px solid rgba(255,255,255,.06);font-variant-numeric:tabular-nums}
#dsStrip{margin:0 0 12px}
#dsStrip .dsFoot{margin-top:6px;font-size:.76em;color:${C.mu}}
@media (prefers-reduced-motion:reduce){.dsTip{transition:none}}`;
  const st = document.createElement("style"); st.textContent = css; document.head.append(st);

  /* ---------- formatting (أرقام عربية مثل باقي التطبيق) ---------- */
  const NF = new Intl.NumberFormat("ar-SA-u-nu-arab", { maximumFractionDigits: 0 });
  const NF1 = new Intl.NumberFormat("ar-SA-u-nu-arab", { maximumFractionDigits: 1, minimumFractionDigits: 0 });
  const NF2 = new Intl.NumberFormat("ar-SA-u-nu-arab", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const N = x => (x == null || isNaN(x)) ? "—" : NF.format(Math.round(x));
  const M = x => (x == null || isNaN(x)) ? "—" : Math.abs(x) >= 1e6 ? NF2.format(x / 1e6) + " مليون" : NF.format(Math.round(x / 1e3)) + " ألف";
  const PC = (x, sign) => (x == null || isNaN(x)) ? "—" : (sign && x > 0 ? "+" : x < 0 ? "−" : "") + NF1.format(Math.abs(x)) + "٪";
  const el = (t, c, txt) => { const e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = String(txt); return e; };
  const NS = "http://www.w3.org/2000/svg";
  const sv = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a || {}) e.setAttribute(k, a[k]); return e; };
  const dAr = iso => { try { return new Intl.DateTimeFormat("ar-SA-u-nu-arab-ca-gregory", { day: "numeric", month: "short" }).format(new Date(iso + "T12:00:00")); } catch { return iso; } };
  const riyadhToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Riyadh" }).format(new Date());

  /* ---------- data ---------- */
  let DS = null; const subs = new Set();
  async function load() {
    try {
      if (!window.sb || !window.sb.from) return;
      const { data } = await window.sb.from("docs").select("data").eq("collection", "ds").eq("id", "latest").maybeSingle();
      if (data && data.data) { DS = data.data; window.__ds = DS; subs.forEach(f => { try { f(); } catch (e) {} }); }
    } catch (e) {}
  }
  const boot = () => { if (window.sb && window.sb.from) { load(); setInterval(load, 6e5); } else setTimeout(boot, 800); };
  boot();
  document.addEventListener("visibilitychange", () => { if (!document.hidden) load(); });

  /* ---------- live nowcast: يعيد الحساب لو وصل رقم مبيعات أحدث من المحرك (بعد «زامن») ---------- */
  function liveNowcast() {
    if (!DS) return null;
    const base = DS.nowcast && DS.nowcast.date === riyadhToday() ? DS.nowcast : null;
    let best = base;
    try {
      const k = window.__kpis && window.__kpis.revenue_daily;
      if (k && k.date === riyadhToday() && Array.isArray(k.metrics) && k.metrics[0]) {
        const m = /(\d{1,2}):(\d{2})/.exec(k.metrics[0].label || ""); const cum = Number(String(k.metrics[0].value || "").replace(/[^\d.]/g, ""));
        if (m && cum > 0) {
          const minute = +m[1] * 60 + +m[2];
          if (!base || minute > base.asOfMinute) {
            const fri = new Date(riyadhToday() + "T12:00:00").getDay() === 5;
            const cv = (DS.curve || {})[fri ? "fri" : "wk"] || (DS.curve || {}).wk;
            if (cv) {
              const i = Math.max(0, cv.t.findIndex((t, j) => t <= minute && (cv.t[j + 1] == null || cv.t[j + 1] > minute)));
              const s50 = cv.p50[i], s10 = cv.p10[i], s90 = cv.p90[i];
              if (s50 > 0.05) best = { asOf: m[1].padStart(2, "0") + ":" + m[2], asOfMinute: minute, soFar: cum, eod: cum / s50, lo: cum / s90, hi: cum / Math.max(s10, 1e-3), dayShareDone: s50 * 100, live: true };
            }
          }
        }
      }
    } catch (e) {}
    if (!best && Array.isArray(DS.fcPath)) { const f = DS.fcPath.find(x => x.d === riyadhToday()); if (f) best = { eod: f.p50, lo: f.p10, hi: f.p90, early: true }; }
    return best;
  }

  /* ---------- tooltip helper ---------- */
  function tipFor(box) { const t = el("div", "dsTip"); box.append(t); return { show(html, x, y) { t.innerHTML = html; t.style.opacity = 1; const w = box.clientWidth; const tw = t.offsetWidth; let left = x + 12; if (left + tw > w) left = x - tw - 12; t.style.left = Math.max(0, left) + "px"; t.style.top = Math.max(0, y - 40) + "px"; }, hide() { t.style.opacity = 0; } }; }

  /* ---------- chart 1: الدخل اليومي الفعلي + نطاق التوقع لباقي الشهر ---------- */
  function forecastChart() {
    const box = el("div", "dsChart"); const W = 340, H = 180, pl = 44, pr = 8, pt = 10, pb = 22;
    const act = DS.series.d.map((d, i) => ({ d, v: DS.series.v[i] })).slice(-35);
    const fc = (DS.fcPath || []).filter(x => !act.some(a => a.d === x.d));
    const all = act.map(a => a.d).concat(fc.map(f => f.d));
    const ymax = Math.max(...act.map(a => a.v), ...fc.map(f => f.p90)) * 1.08;
    const X = d => pl + (all.indexOf(d) / Math.max(all.length - 1, 1)) * (W - pl - pr);
    const Y = v => pt + (1 - v / ymax) * (H - pt - pb);
    const s = sv("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "الدخل اليومي الفعلي ونطاق التوقع لباقي الشهر" });
    [0, 0.5, 1].forEach(f => { const v = ymax * f; s.append(sv("line", { x1: pl, x2: W - pr, y1: Y(v), y2: Y(v), stroke: C.grid })); const t = sv("text", { x: pl - 6, y: Y(v) + 4, "text-anchor": "end", fill: C.mu, "font-size": 10 }); t.textContent = M(v).replace(" ألف", "k").replace(" مليون", "M"); s.append(t); });
    if (fc.length) {
      const band = fc.map(f => `${X(f.d)},${Y(f.p90)}`).concat(fc.slice().reverse().map(f => `${X(f.d)},${Y(f.p10)}`));
      const lastA = act[act.length - 1];
      s.append(sv("polygon", { points: [`${X(lastA.d)},${Y(lastA.v)}`].concat(band).join(" "), fill: C.blue, "fill-opacity": 0.18 }));
      s.append(sv("polyline", { points: [`${X(lastA.d)},${Y(lastA.v)}`].concat(fc.map(f => `${X(f.d)},${Y(f.p50)}`)).join(" "), fill: "none", stroke: C.blue, "stroke-width": 2, "stroke-dasharray": "4 4" }));
    }
    s.append(sv("polyline", { points: act.map(a => `${X(a.d)},${Y(a.v)}`).join(" "), fill: "none", stroke: C.blue, "stroke-width": 2, "stroke-linejoin": "round" }));
    [act[0].d, act[act.length - 1].d, all[all.length - 1]].forEach((d, i) => { const t = sv("text", { x: X(d), y: H - 6, "text-anchor": i === 0 ? "start" : i === 2 ? "end" : "middle", fill: C.mu, "font-size": 10 }); t.textContent = i === 1 ? "آخر يوم مكتمل" : dAr(d); s.append(t); });
    const cross = sv("line", { y1: pt, y2: H - pb, stroke: "rgba(255,255,255,.35)", opacity: 0 }); s.append(cross);
    const hit = sv("rect", { x: pl, y: pt, width: W - pl - pr, height: H - pt - pb, fill: "transparent" }); s.append(hit);
    box.append(s); const tip = tipFor(box);
    const move = ev => { const r = s.getBoundingClientRect(); const x = (ev.clientX - r.left) * W / r.width; const i = Math.round((x - pl) / (W - pl - pr) * (all.length - 1)); const d = all[Math.max(0, Math.min(all.length - 1, i))]; cross.setAttribute("x1", X(d)); cross.setAttribute("x2", X(d)); cross.setAttribute("opacity", 1); const a = act.find(z => z.d === d), f = fc.find(z => z.d === d); tip.show(`<b>${dAr(d)}</b><br>${a ? "فعلي: " + N(a.v) + " ر.س" : "متوقع: " + N(f.p50) + "<br>نطاق ٨٠٪: " + M(f.p10) + " – " + M(f.p90)}`, X(d) * r.width / W, (a ? Y(a.v) : Y(f.p50)) * r.height / H); };
    hit.addEventListener("pointermove", move); hit.addEventListener("pointerleave", () => { tip.hide(); cross.setAttribute("opacity", 0); });
    const leg = el("div", "dsLeg"); leg.innerHTML = `<span><i style="background:${C.blue}"></i>فعلي</span><span><i style="background:${C.blue};opacity:.35"></i>نطاق التوقع ٨٠٪ (الخط المتقطع = الوسيط)</span>`;
    const w = el("div"); w.append(box, leg); return w;
  }

  /* ---------- chart 2: نمط أيام الأسبوع ---------- */
  function dowChart() {
    const box = el("div", "dsChart"); const W = 340, H = 120, pb = 20, pt = 14;
    const d = DS.dow || []; const mx = Math.max(...d.map(x => x.f)) * 1.1; const bw = (W - 20) / d.length;
    const s = sv("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "معامل كل يوم من أيام الأسبوع مقارنة بالمتوسط" });
    s.append(sv("line", { x1: 10, x2: W - 10, y1: pt + (1 - 1 / mx) * (H - pt - pb), y2: pt + (1 - 1 / mx) * (H - pt - pb), stroke: C.grid, "stroke-dasharray": "3 3" }));
    const tip = tipFor(box);
    d.forEach((x, i) => {
      const h = (x.f / mx) * (H - pt - pb), xx = 10 + i * bw + bw * 0.2;
      const r = sv("path", { d: `M${xx},${H - pb} V${H - pb - h + 4} q0,-4 4,-4 H${xx + bw * 0.6 - 4} q4,0 4,4 V${H - pb} Z`, fill: C.blue }); s.append(r);
      const t = sv("text", { x: xx + bw * 0.3, y: H - 6, "text-anchor": "middle", fill: C.mu, "font-size": 9.5 }); t.textContent = x.d.replace("ال", ""); s.append(t);
      if (x.f === Math.min(...d.map(z => z.f)) || x.f === Math.max(...d.map(z => z.f))) { const v = sv("text", { x: xx + bw * 0.3, y: H - pb - h - 4, "text-anchor": "middle", fill: C.tx2, "font-size": 9.5 }); v.textContent = "×" + NF2.format(x.f); s.append(v); }
      const hit = sv("rect", { x: 10 + i * bw, y: pt, width: bw, height: H - pt - pb, fill: "transparent" });
      hit.addEventListener("pointermove", ev => { const rc = s.getBoundingClientRect(); tip.show(`<b>${x.d}</b><br>×${NF2.format(x.f)} من متوسط اليوم`, (xx + bw * .3) * rc.width / W, (H - pb - h) * rc.height / H); });
      hit.addEventListener("pointerleave", () => tip.hide()); s.append(hit);
    });
    box.append(s); return box;
  }

  /* ---------- chart 3: منحنى النضج (لوغاريتمي) ---------- */
  function maturityChart() {
    const box = el("div", "dsChart"); const W = 340, H = 220, pl = 40, pr = 8, pt = 10, pb = 26;
    const pts = (DS.matPts || []).filter(p => p[2] > 0 && p[3] > 0);
    const lx = a => Math.log(a), ly = v => Math.log(v);
    const ax0 = lx(0.8), ax1 = lx(60), vy = pts.map(p => p[3]); const ay0 = ly(Math.max(Math.min(...vy) * 0.8, 15000)), ay1 = ly(Math.max(...vy) * 1.15);
    const X = a => pl + (lx(a) - ax0) / (ax1 - ax0) * (W - pl - pr), Y = v => pt + (1 - (ly(v) - ay0) / (ay1 - ay0)) * (H - pt - pb);
    const s = sv("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "دخل الفروع الشهري مقابل عمرها مع منحنى النضج لكل حجم مدينة" });
    [50000, 100000, 200000, 500000, 1000000].filter(v => ly(v) > ay0 && ly(v) < ay1).forEach(v => { s.append(sv("line", { x1: pl, x2: W - pr, y1: Y(v), y2: Y(v), stroke: C.grid })); const t = sv("text", { x: pl - 5, y: Y(v) + 3, "text-anchor": "end", fill: C.mu, "font-size": 9.5 }); t.textContent = v >= 1e6 ? "1M" : (v / 1000) + "k"; s.append(t); });
    [1, 3, 6, 12, 24, 48].forEach(a => { const t = sv("text", { x: X(a), y: H - 10, "text-anchor": "middle", fill: C.mu, "font-size": 9.5 }); t.textContent = a; s.append(t); });
    const xl = sv("text", { x: W - pr, y: H - 0, "text-anchor": "end", fill: C.mu, "font-size": 9 }); xl.textContent = "العمر بالشهور"; s.append(xl);
    const be = DS.breakeven && DS.breakeven.est; if (be && ly(be) > ay0) { s.append(sv("line", { x1: pl, x2: W - pr, y1: Y(be), y2: Y(be), stroke: C.warn, "stroke-dasharray": "5 4" })); const t = sv("text", { x: pl + 4, y: Y(be) - 4, fill: C.warn, "font-size": 9.5 }); t.textContent = "التعادل المقدّر " + M(be); s.append(t); }
    Object.entries(DS.maturity.curve || {}).forEach(([tier, cv]) => s.append(sv("polyline", { points: cv.filter(p => p[0] >= 1).map(p => `${X(p[0])},${Y(Math.max(p[1], Math.exp(ay0)))}`).join(" "), fill: "none", stroke: TIER[tier], "stroke-width": 2 })));
    const tip = tipFor(box);
    pts.forEach(p => {
      const c = sv("circle", { cx: X(Math.max(p[2], 0.8)), cy: Y(p[3]), r: 4, fill: TIER[p[1]] || C.blue, stroke: C.surf, "stroke-width": 2 });
      const hit = sv("circle", { cx: X(Math.max(p[2], 0.8)), cy: Y(p[3]), r: 9, fill: "transparent" });
      hit.addEventListener("pointermove", () => { const rc = s.getBoundingClientRect(); tip.show(`<b>${p[0]}</b> · ${p[1]}<br>العمر ${NF1.format(p[2])} شهر · ${M(p[3])}/شهر<br>مقابل المتوقع لعمره: ${PC(p[4], true)}`, X(Math.max(p[2], .8)) * rc.width / W, Y(p[3]) * rc.height / H); });
      hit.addEventListener("pointerleave", () => tip.hide()); s.append(c, hit);
    });
    box.append(s);
    const leg = el("div", "dsLeg"); leg.innerHTML = Object.keys(TIER).map(t => `<span><i style="background:${TIER[t]}"></i>مدن ${t}</span>`).join("") + `<span><i style="background:${C.warn};border-radius:2px;height:3px;width:12px"></i>نقطة التعادل</span>`;
    const w = el("div"); w.append(box, leg); return w;
  }

  /* ---------- views ---------- */
  const card = (title, ...kids) => { const c = el("div", "dsCard"); if (title) c.append(el("h4", "", title)); kids.forEach(k => k && c.append(typeof k === "string" ? el("p", "", k) : k)); return c; };
  const tile = (k, v, s) => { const t = el("div", "dsTile"); t.append(el("div", "k", k), el("div", "v", v), el("div", "s", s || "")); return t; };

  function viewFc() {
    const f = DS.monthFc || {}, nc = liveNowcast(), out = [];
    const tiles = el("div", "dsTiles");
    tiles.append(tile("توقع إقفال الشهر", M(f.p50), "نطاق ٨٠٪: " + M(f.p10) + " – " + M(f.p90)));
    tiles.append(tile("احتمال تحقيق المستهدف", PC(f.probTarget), "المستهدف " + M(f.target) + (f.execTarget ? " · مستهدف فهد وريم " + M(f.execTarget) + ": " + PC(f.probExec) : "")));
    if (nc) tiles.append(tile("توقع إقفال اليوم", M(nc.eod), nc.early ? "قبل ما يتجمع دخل كافي اليوم — من نموذج الأيام" : "نطاق ٨٠٪: " + M(nc.lo) + " – " + M(nc.hi) + " · حتى " + nc.asOf + (nc.live ? " (محدّث)" : "")));
    tiles.append(tile("المطلوب يومياً للمستهدف", M(f.needPerDay), "المتوقع يومياً: " + M(f.expectedPerDay) + " · باقي " + N(f.daysLeft) + " يوم"));
    out.push(tiles);
    out.push(card("الدخل اليومي: الفعلي ونطاق التوقع", forecastChart(), el("p", "dsMu", "نموذج Holt بترند مخمّد على الدخل بعد إزالة أثر أيام الأسبوع، والنطاق من ٤٠٠٠ مسار محاكاة بأخطاء النموذج الفعلية.")));
    const sh = DS.shift || {};
    const drv = (sh.drivers || []).filter(x => x.delta < 0).slice(0, 4).map(x => x.seg + " " + (x.delta > 0 ? "+" : "−") + N(Math.abs(x.delta)) + "/يوم").join("، ");
    out.push(card("وش تغيّر هالأسبوع", `متوسط آخر ٧ أيام مكتملة ${M(sh.cur7)} يومياً مقابل ${M(sh.prev7)} الأسبوع اللي قبله (${PC(sh.chgPct, true)}). متوسط أغسطس قبل موسم اليوم الوطني كان ${M(sh.augAvg)}.`, drv ? "أكبر مصادر النزول: " + drv + "." : null));
    out.push(card("نمط أيام الأسبوع", dowChart(), el("p", "dsMu", "كل عمود = دخل اليوم مقسوم على متوسط الأسبوع (آخر ٨ أسابيع). الخط المتقطع = ١.")));
    return out;
  }
  function viewAnom() {
    const a = DS.anoms || [], out = [];
    out.push(card("كيف ينحسب الشذوذ", "نقارن حصة كل فرع من دخل الشركة في آخر ٦ أيام عمل مع الـ٢٤ يوم اللي قبلها، ونقيس التغير بوحدات التذبذب الطبيعي للفرع نفسه (z). نعتمد z ≥ ٢٫٥ وتغير ≥ ١٥٪ — يعني التغير نادر يصير صدفة. استخدام الحصة يعزل مشكلة الفرع عن نزول أو طلوع الشركة كلها."));
    if (!a.length) out.push(card("", "ما فيه فروع خارج تذبذبها الطبيعي حالياً."));
    a.forEach(x => {
      const r = el("div", "dsAn"); const col = x.dir === "down" ? C.bad : C.good;
      const nm = el("div"); nm.append(el("b", "", x.n)); const tg = el("span", "dsTag", x.dir === "down" ? "▼ نزول غير طبيعي" : "▲ ارتفاع غير طبيعي"); tg.style.color = col; nm.append(tg);
      r.append(nm, el("div", "r", PC(x.chg, true)), el("div", "dsMu", (x.rg || "") + " · z = " + NF1.format(x.z)), el("div", "r dsMu", "أثر " + (x.impact > 0 ? "+" : "−") + N(Math.abs(x.impact)) + " ر.س/يوم"));
      out.push(r);
    });
    return out;
  }
  function trendRows(list) {
    const box = el("div", "dsRows"); const lim = Math.min(80, Math.max(20, ...list.map(t => Math.max(Math.abs(t.relLo), Math.abs(t.relHi)))));
    const P = v => 50 + Math.max(-lim, Math.min(lim, v)) / lim * 50;
    list.forEach(t => {
      const row = el("div", "dsRow"); const col = t.sig === "down" ? C.bad : C.good;
      const n = el("div", "n", t.n + (t.young ? " (جديد)" : "")); n.title = t.n;
      const w = el("div", "dsBarWrap"); const z = el("div", "z"); z.style.left = "50%"; const ci = el("div", "ci"); ci.style.left = P(t.relLo) + "%"; ci.style.width = Math.max(P(t.relHi) - P(t.relLo), 1) + "%"; ci.style.background = col; ci.style.opacity = .45; const pt = el("div", "pt"); pt.style.left = P(t.rel) + "%"; pt.style.background = col;
      w.append(z, ci, pt); w.title = "مدى الثقة ٩٠٪: " + PC(t.relLo, true) + " إلى " + PC(t.relHi, true);
      row.append(n, w, el("div", "val", PC(t.rel, true))); box.append(row);
    });
    return box;
  }
  function viewTrend() {
    const t = DS.trends || {}, out = [];
    out.push(card("كيف تنقرى", "اتجاه كل فرع بالشهر مقارنة بالشركة (حصته من الدخل) خلال آخر ٤٢ يوم، بانحدار يعزل أيام الأسبوع وخطأ معياري Newey-West. النقطة = التقدير، والخط = مدى الثقة ٩٠٪. يظهر هنا بس الفرع اللي مداه كله فوق الصفر أو تحته (دلالة إحصائية)؛ الباقي (" + N((t.n || 0) - (t.down || []).length - (t.up || []).length) + " فرع) تغيره داخل الضجيج."));
    if ((t.down || []).length) out.push(card("▼ نازل بدلالة إحصائية (" + N(t.down.length) + ")", trendRows(t.down), el("p", "dsMu", "(جديد) = نزول بعد زخم الافتتاح، متوقع وما يعني مشكلة بالضرورة.")));
    if ((t.up || []).length) out.push(card("▲ طالع بدلالة إحصائية (" + N(t.up.length) + ")", trendRows(t.up)));
    return out;
  }
  function viewMat() {
    const m = DS.maturity || {}, b = DS.breakeven || {}, out = [];
    out.push(card("منحنى النضج", maturityChart(), el("p", "dsMu", "انحدار Huber (مقاوم للقيم الشاذة) للوغ الدخل على لوغ العمر وحجم المدينة، على " + N(m.n) + " فرع. كل ما تضاعف عمر الفرع يرتفع دخله ~" + PC(m.doubling) + " بالمتوسط.")));
    out.push(card("نقطة التعادل المقدّرة إحصائياً", `${M(b.est)} دخل شهري (مدى الثقة ٩٠٪: ${M(b.lo)} – ${M(b.hi)}) من أرباح سبتمبر لـ${N(b.n)} فرع، وكل ١٠٠ ألف دخل فوقها تعطي ~${N((b.marginal || 0) * 100)} ألف صافي. المعتمد في الشيت ${M(b.stated)}.`, el("p", "dsMu", "هوامش سبتمبر منفوخة بموسم اليوم الوطني، فالتعادل الحقيقي غالباً أعلى؛ يُعاد حسابه مع أرباح أكتوبر.")));
    const tbl = (rows, head) => { const t = el("table", "dsTbl"); const h = el("tr"); head.forEach(x => h.append(el("th", "", x))); t.append(h); rows.forEach(r => { const tr = el("tr"); r.forEach(x => tr.append(el("td", "", x))); t.append(tr); }); return t; };
    out.push(card("▼ أضعف من المتوقع لعمرها", tbl((m.under || []).slice(0, 8).map(r => [r.n, NF1.format(r.age) + " ش", M(r.rev), PC(r.gap, true)]), ["الفرع", "العمر", "الدخل/شهر", "الفرق"])));
    out.push(card("▲ أقوى من المتوقع لعمرها", tbl((m.over || []).slice(0, 6).map(r => [r.n, NF1.format(r.age) + " ش", M(r.rev), PC(r.gap, true)]), ["الفرع", "العمر", "الدخل/شهر", "الفرق"])));
    const yAll = m.young || [], done = yAll.filter(r => r.already).length;
    const y = yAll.filter(r => !r.already).sort((a, b2) => (a.beAt ?? 99) - (b2.beAt ?? 99));
    out.push(card("الفروع الجديدة اللي ما وصلت التعادل", y.length ? tbl(y.map(r => [r.n, NF1.format(r.age) + " ش", M(r.rev), r.beAt == null ? "ما يوصل بالمسار الحالي" : "الشهر " + NF1.format(r.beAt)]), ["الفرع", "العمر", "الدخل/شهر", "يوصل التعادل"]) : "كل الفروع الجديدة واصلة التعادل.", el("p", "dsMu", N(done) + " فرع جديد (تحت ٩ شهور) واصل التعادل أصلاً. التقدير من منحنى النضج معدّلاً بأداء الفرع نفسه مقارنة بالمتوقع لعمره.")));
    return out;
  }
  function viewAcc() {
    const bt = DS.backtest || {}, out = [];
    out.push(card("دقة النماذج (اختبار رجعي)",
      `توقع مجموع ٧ أيام: خطأ وسيط ${PC(bt.week7Mape)} على ${N(bt.weekN)} اختبار.`,
      (bt.months || []).map(m => `إقفال ${m.month} لو توقعناه يوم ١٧: ${M(m.pred)} مقابل الفعلي ${M(m.actual)} (${PC(m.errPct, true)}) — الفرق جاء من موسم اليوم الوطني بعد يوم ١٧.`).join(" ") || null,
      "توقع إقفال اليوم حسب الساعة: " + Object.entries(bt.nowcastByHour || {}).map(([h, e]) => "الساعة " + NF.format(+h) + ": ±" + NF1.format(e) + "٪").join("، ") + "."));
    out.push(card("حدود النماذج",
      "ما تشوف الحملات والمواسم الجاية إلا بعد ما تصير؛ أي حملة كبيرة قادمة ترفع النتيجة فوق التوقع.",
      "البيانات من " + N(DS.nDays) + " يوم مكتمل في Wareed BI وتزيد يومياً (الأيام اللي انسحبت ناقصة مستبعدة).",
      "الارتباط مو سببية: الشذوذ يقول «فيه شي غير طبيعي»، والسبب يتأكد من الفرع والاجتماعات."));
    out.push(card("", el("p", "dsMu", "المصدر: " + (DS.source || "") + " · آخر يوم مكتمل " + dAr(DS.lastComplete) + " · تحديث المحرك " + String(DS.asOf || "").slice(0, 16).replace("T", " "))));
    return out;
  }
  const VIEWS = [["fc", "التوقع", viewFc], ["anom", "الشذوذ", viewAnom], ["trend", "الاتجاهات", viewTrend], ["mat", "النضج والتعادل", viewMat], ["acc", "الدقة والمنهجية", viewAcc]];
  let cur = "fc";
  window.__fcDS = (_d, rerender) => {
    const root = el("div", "dsv");
    const paint = () => {
      root.replaceChildren();
      if (!DS) { root.append(card("", "تحليلات علم البيانات تنحمّل… (تظهر لأبو راكان وروان ود. ناصر بس)")); return; }
      const chips = el("div", "dsChips"); chips.setAttribute("role", "tablist");
      VIEWS.forEach(([k, lbl]) => { const b = el("button", "dsChip" + (k === cur ? " on" : ""), lbl); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", k === cur); b.addEventListener("click", () => { cur = k; paint(); }); chips.append(b); });
      root.append(chips);
      try { VIEWS.find(v => v[0] === cur)[2]().forEach(x => root.append(x)); } catch (e) { root.append(card("", "صار خطأ في العرض: " + e.message)); }
    };
    paint(); if (!DS) { const f = () => { subs.delete(f); paint(); }; subs.add(f); }
    return root;
  };

  /* ---------- شريط الداشبورد ---------- */
  function strip() {
    const sec = document.getElementById("kpiSec"), body = document.getElementById("kpiBody");
    if (!sec || !body || !DS) return;
    let s = document.getElementById("dsStrip");
    if (!s) { s = el("div"); s.id = "dsStrip"; body.parentNode.insertBefore(s, body); }
    const f = DS.monthFc || {}, nc = liveNowcast();
    const t = el("div", "dsTiles");
    if (nc) t.append(tile("🔬 توقع إقفال اليوم", M(nc.eod), nc.early ? "تقدير من نمط الأيام" : "٨٠٪: " + M(nc.lo) + " – " + M(nc.hi) + " · حتى " + nc.asOf));
    t.append(tile("🔬 توقع إقفال الشهر", M(f.p50), "٨٠٪: " + M(f.p10) + " – " + M(f.p90)));
    t.append(tile("🔬 احتمال المستهدف", PC(f.probTarget), "المطلوب " + M(f.needPerDay) + "/يوم · المتوقع " + M(f.expectedPerDay)));
    const anN = (DS.anoms || []).filter(a => a.dir === "down").length;
    if (anN) t.append(tile("🔬 فروع بنزول غير طبيعي", N(anN), "خارج تذبذبها الطبيعي (z ≥ ٢٫٥)"));
    s.replaceChildren(t, el("div", "dsFoot", "نماذج إحصائية بنطاقات ثقة · التفاصيل في التوقعات المالية ← 🔬 علم البيانات"));
  }
  subs.add(strip);
  setInterval(strip, 6e4);
  const mo = new MutationObserver(() => { if (DS && document.getElementById("kpiBody") && !document.getElementById("dsStrip")) strip(); });
  const watch = () => { const r = document.getElementById("appRoot") || document.body; mo.observe(r, { childList: true, subtree: true }); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", watch); else watch();
})();
