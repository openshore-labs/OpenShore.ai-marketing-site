#!/usr/bin/env python3
"""Rebuilds the Reports and dashboards scene's two app panels inside
src/static/enterprise/tour/index.html (the film), to match the platform page's
product screens (scripts/mockups). Example data only (Alder & Pine).

Everything is `k` elements on the film's clock (data-at / data-fx), so the
tap, the source popover, the quota ring, the two-viewer card and the Monday
flash keep their cues. Run from the repo root:  python3 scripts/build-tour-panels.py
"""
import re, sys
P = "src/static/enterprise/tour/index.html"
SEA, WAVE, SOFT, INK, MUT, AMB = "#2f5a66", "#4b90a3", "#b9d3da", "#1c2a33", "#606a6f", "#a35f0a"
FONT = 'font-family="Inter, sans-serif"'
CAP = "font-size:14px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted)"
def num(t, fs=None): return f'<span class="num" style="color:var(--sea);background:var(--sea-soft);font-weight:600;padding:1px 8px;border-radius:8px;white-space:nowrap">{t}</span>'
CHIP = lambda t: f'<span style="display:inline-flex;align-items:center;gap:8px;font-size:17px;padding:8px 16px;border-radius:999px;background:var(--raised);box-shadow:0 0 0 1.5px rgba(28,42,51,0.12);color:var(--ink-soft)">{t}<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" stroke="#1c2a33" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg></span>'
SRC = lambda: f'<span style="font-size:14px;color:var(--muted);padding:3px 10px;border-radius:999px;background:rgba(28,42,51,0.055);white-space:nowrap"><b style="font-weight:500;color:var(--sea)">Shopify</b> ↗</span>'

def spark(vals, at, w=150, h=30):
    mn, mx, p = min(vals), max(vals), 4
    xs = lambda i: p + (w - 2*p) * i / (len(vals) - 1)
    ys = lambda v: h - p - (h - 2*p) * ((v - mn) / ((mx - mn) or 1))
    d = "M" + " L".join(f"{xs(i):.1f},{ys(v):.1f}" for i, v in enumerate(vals))
    return (f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" fill="none" aria-hidden="true" style="overflow:visible">'
            f'<path class="k" data-fx="draw" data-at="{at}" data-d="0.9" pathLength="1" d="{d}" stroke="{SEA}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<circle class="k" data-fx="fade" data-at="{at+0.8:.2f}" cx="{xs(len(vals)-1):.1f}" cy="{ys(vals[-1]):.1f}" r="4.5" fill="{SEA}"/></svg>')

WEEKS = [(43, 21), (44, 38), (45, 52), (46, 64)]
def trend(w, h, t0, uid, fs=14, forecast=True, grid=(0, 20, 40, 60, 80), dur=1.5):
    L, R, T, B = 44, 30, 26, 30
    iw, ih = w - L - R, h - T - B
    pts = WEEKS + ([(47, 71), (48, 76)] if forecast else [])
    x = lambda i: L + 26 + (iw - 40) * i / (len(pts) - 1)
    y = lambda v: T + ih * (1 - v / 80)
    n = len(WEEKS)
    s = f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" fill="none" aria-hidden="true" style="overflow:visible"><defs><linearGradient id="{uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{WAVE}" stop-opacity=".30"/><stop offset="1" stop-color="{WAVE}" stop-opacity="0"/></linearGradient></defs>'
    for g in grid:
        s += f'<line x1="{L}" x2="{w-R}" y1="{y(g):.1f}" y2="{y(g):.1f}" stroke="rgba(28,42,51,0.12)"/><text x="{L-10}" y="{y(g)+5:.1f}" text-anchor="end" font-size="{fs}" fill="{MUT}" {FONT}>{g}%</text>'
    area = f'M{x(0):.1f},{y(WEEKS[0][1]):.1f} ' + " ".join(f"L{x(i):.1f},{y(v):.1f}" for i, (_, v) in enumerate(WEEKS)) + f' L{x(n-1):.1f},{y(0):.1f} L{x(0):.1f},{y(0):.1f}Z'
    s += f'<path class="k" data-fx="fade" data-at="{t0+0.7:.2f}" data-d="0.8" d="{area}" fill="url(#{uid})"/>'
    s += f'<line class="k" data-fx="draw" data-at="{t0+0.2:.2f}" data-d="0.8" pathLength="1" x1="{L}" x2="{w-R}" y1="{y(60):.1f}" y2="{y(60):.1f}" stroke="{AMB}" stroke-width="2" stroke-dasharray="7 6"/>'
    s += f'<text class="k" data-fx="fade" data-at="{t0+0.8:.2f}" x="{L+8}" y="{y(60)-9:.1f}" font-size="{fs}" font-weight="600" fill="{AMB}" {FONT}>Target 60%</text>'
    if forecast:
        fd = f"M{x(n-1):.1f},{y(WEEKS[-1][1]):.1f} " + " ".join(f"L{x(n+i):.1f},{y(v):.1f}" for i, (_, v) in enumerate(pts[n:]))
        s += f'<path class="k" data-fx="draw" data-at="{t0+0.5+dur:.2f}" data-d="0.6" pathLength="1" d="{fd}" stroke="{WAVE}" stroke-width="3" stroke-dasharray="3 7" stroke-linecap="round"/>'
    ad = "M" + " L".join(f"{x(i):.1f},{y(v):.1f}" for i, (_, v) in enumerate(WEEKS))
    s += f'<path class="k" data-fx="draw" data-at="{t0+0.4:.2f}" data-d="{dur}" pathLength="1" d="{ad}" stroke="{SEA}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>'
    for i, (wk, v) in enumerate(pts):
        f = i >= n; last = i == n - 1
        at = t0 + 0.4 + dur * (i / (n - 1)) if not f else t0 + 0.6 + dur + 0.3 * (i - n)
        if f: s += f'<circle class="k" data-fx="fade" data-at="{at:.2f}" cx="{x(i):.1f}" cy="{y(v):.1f}" r="6" fill="#fcfbf7" stroke="{WAVE}" stroke-width="2.5"/>'
        else: s += f'<circle class="k" data-fx="fade" data-at="{at:.2f}" cx="{x(i):.1f}" cy="{y(v):.1f}" r="{9 if last else 6}" fill="{SEA if last else "#fcfbf7"}" stroke="{SEA}" stroke-width="3"/>'
        ly = y(v) + 32 if (not f and v < 60 and 60 - v < 10) else y(v) - (18 if last else 14)
        s += f'<text class="k" data-fx="fade" data-at="{at+0.1:.2f}" x="{x(i):.1f}" y="{ly:.1f}" text-anchor="middle" font-size="{fs+ (4 if last else 1)}" font-weight="{700 if last else 600}" fill="{WAVE if f else SEA}" {FONT}>{v}%</text>'
        s += f'<text x="{x(i):.1f}" y="{h-6}" text-anchor="middle" font-size="{fs}" fill="{INK if last else MUT}" font-weight="{600 if last else 400}" {FONT}>Wk {wk}</text>'
    return s + '</svg>'

REG = [("West", 14, 72), ("Mountain", 9, 67), ("Midwest", 8, 58), ("South", 7, 50)]
def regions(w, rowh, t0, fs=17):
    lab, rpad = 96, 62
    bw = w - lab - rpad
    h = rowh * len(REG)
    s = f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" fill="none" aria-hidden="true" style="overflow:visible">'
    for i, (n_, st, v) in enumerate(REG):
        cy = i * rowh + rowh / 2; ok = v >= 60
        s += f'<text x="0" y="{cy+6}" font-size="{fs}" font-weight="600" fill="{INK}" {FONT}>{n_}</text>'
        s += f'<rect x="{lab}" y="{cy-12}" width="{bw}" height="24" rx="6" fill="rgba(28,42,51,0.055)"/>'
        s += f'<line class="k" data-fx="draw" data-at="{t0+i*0.15:.2f}" data-d="0.9" pathLength="1" x1="{lab}" x2="{lab+bw*v/100:.1f}" y1="{cy}" y2="{cy}" stroke="{SEA if ok else WAVE}" stroke-opacity="{1 if ok else .65}" stroke-width="24"/>'
        s += f'<text class="k" data-fx="fade" data-at="{t0+0.5+i*0.15:.2f}" x="{w}" y="{cy+7}" text-anchor="end" font-size="{fs+3}" font-weight="700" fill="{SEA if ok else AMB}" {FONT}>{v}%</text>'
    tx = lab + bw * 0.6
    s += f'<line x1="{tx:.1f}" x2="{tx:.1f}" y1="2" y2="{h-2}" stroke="{AMB}" stroke-width="2.5" stroke-dasharray="5 5"/></svg>'
    return s

def block(n, head, sub, cap, body, at):
    return (f'<div class="k" data-at="{at}" style="min-width:0;display:flex;flex-direction:column;gap:10px">'
            f'<div style="display:grid;grid-template-columns:34px 1fr;column-gap:12px"><span style="width:34px;height:34px;border-radius:50%;background:var(--sea);color:#fff;font-weight:700;font-size:16px;display:flex;align-items:center;justify-content:center">{n}</span>'
            f'<div><div style="font-size:21px;line-height:1.25;font-weight:650;letter-spacing:-0.015em">{head}</div><div style="font-size:16px;line-height:1.4;color:var(--ink-soft);margin-top:4px">{sub}</div></div></div>'
            f'<div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px"><span style="{CAP}">{cap}</span>{SRC()}</div>{body}</div>')

def report_panel():
    kp = [("Sell-through", "64<span style='font-size:20px'>%</span>", "<b style='color:var(--sea)'>▲ 12 pts</b> on week 45"), ("Units on shelf", "1,920", "across 38 stores"),
          ("Weeks of stock", "3.2", "<b style='color:var(--sea)'>Above</b> the 3.0 floor"), ("Reorder", "2<span style='font-size:20px'> pallets</span>", "Approved by Lena Park")]
    kps = "".join(f'<div class="k" data-at="{1.0+i*0.1:.1f}" style="padding:12px 18px;{"border-left:1px solid var(--rule);" if i else "padding-left:0;"}"><div style="{CAP};font-size:13px">{l}</div><div class="num" style="font-size:36px;font-weight:700;letter-spacing:-0.03em;color:var(--sea);line-height:1.15;margin-top:2px">{v}</div><div style="font-size:15px;color:var(--muted)">{d}</div></div>' for i, (l, v, d) in enumerate(kp))
    return f'''            <div class="k" data-fx="fade" data-at="-5" data-d="0.01" data-out="4.0" style="position:absolute;inset:0;overflow:hidden">
              <div class="k" data-at="0.8" data-d="1.0" style="position:absolute;left:90px;top:26px;width:1120px;background:#fffffd;border-radius:6px;box-shadow:0 1px 2px rgba(28,42,51,0.08),0 30px 60px -30px rgba(28,42,51,0.45),0 0 0 1.5px rgba(28,42,51,0.07);padding:26px 40px 30px;display:flex;flex-direction:column;gap:16px">
                <div style="display:flex;justify-content:space-between;align-items:flex-end;padding-bottom:14px;border-bottom:3px solid var(--ink)"><div><div style="font-size:14px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--sea)">Weekly restock report</div><div class="brand" style="font-size:40px;line-height:1.1;margin-top:6px">Cedar Grove restock, week 46</div></div><div style="font-size:16px;color:var(--muted);text-align:right;line-height:1.45">From Monday’s run of<br>Cedar Grove weekly restock</div></div>
                <div class="k" data-at="0.95" style="background:linear-gradient(90deg,var(--sea-soft),rgba(47,90,102,0.04));border-left:6px solid var(--sea);border-radius:4px 14px 14px 4px;padding:14px 22px"><div style="{CAP};color:var(--sea);font-size:13px;margin-bottom:4px">The short version</div><div style="font-size:22px;line-height:1.4;font-weight:500;letter-spacing:-0.01em">Sell-through reached {num("64%")}, up {num("12 pts")} on last week and above the 60% target. Stock is healthy at {num("3.2")} weeks, and the reorder of {num("2 pallets")} is approved and sent.</div></div>
                <div style="display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--rule);border-bottom:1px solid var(--rule)">{kps}</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start">
{block(1, "It sold through faster every week.", "Crossed the 60% target in week 46. On pace for about 71% next week.", "Sell-through by week", trend(486, 150, 0.9, "ag-r", 13, dur=1.0), 1.2)}
{block(2, "West and Mountain carried it.", "The South is 10 pts under target, across 7 stores.", "Sell-through by region", regions(486, 38, 1.1, 16), 1.35)}
                </div>
              </div>
              <div class="k card" data-at="2.0" style="position:absolute;left:90px;top:716px;width:1120px;padding:18px 26px;display:flex;align-items:center;justify-content:space-between;gap:24px;z-index:3;border-radius:22px;box-shadow:var(--elev-3),0 0 0 3px rgba(75,144,163,0.5)">
                <div><div style="display:flex;align-items:center;gap:10px"><div style="{CAP};font-size:14px">From the model</div><span style="font-weight:600;font-size:14px;color:var(--sea);padding:2px 8px;border-radius:8px;background:var(--sea-soft)">Suggestion</span></div><div style="font-size:21px;font-weight:600;line-height:1.35;margin-top:6px">A new report arrives every Monday. Make it a dashboard that stays current?</div></div>
                <div style="position:relative;display:flex;gap:12px;flex:none"><span class="btn primary" style="font-size:20px;padding:0 22px;height:50px">Make it a dashboard</span><span class="btn ghost" style="font-size:20px;padding:0 22px;height:50px">Not now</span><span class="k" data-fx="tap" data-at="3.5" data-d="0.8" style="position:absolute;left:96px;top:-4px;width:58px;height:58px;border-radius:50%;background:rgba(255,255,255,0.45);pointer-events:none"></span></div>
              </div>
            </div>
'''

def dashboard_body():
    cell = lambda i, label, val, delta, sp, at, extra="": (
        f'<div class="k" data-at="{at}" style="position:relative;padding:18px 20px 14px;display:flex;flex-direction:column;gap:2px;min-width:0;{"border-left:1px solid var(--rule);" if i else ""}">{extra}'
        f'<div style="{CAP};font-size:13px;letter-spacing:0.1em">{label}</div><div class="num" style="font-size:40px;font-weight:700;letter-spacing:-0.03em;line-height:1.1;color:var(--sea);margin-top:6px;white-space:nowrap">{val}</div>'
        f'<div style="font-size:15px;color:var(--muted);white-space:nowrap">{delta}</div><div style="margin-top:6px;height:30px">{sp}</div></div>')
    up = lambda t: f'<b style="color:var(--sea)">{t}</b>'
    ring = lambda a, o: f'<span class="k" data-fx="fade" data-at="{a}" data-d="0.4" data-out="{o}" style="position:absolute;inset:-4px;border-radius:16px;box-shadow:0 0 0 3px rgba(75,144,163,0.6);pointer-events:none;z-index:2"></span>'
    tap = '<span class="k" data-fx="tap" data-at="6.8" data-d="0.8" style="position:absolute;left:70px;top:48px;width:64px;height:64px;border-radius:50%;background:rgba(47,90,102,0.28);pointer-events:none"></span>'
    cells = "".join([
        cell(0, "Sell-through", '64<span style="font-size:20px">%</span>', up("▲ 12 pts") + " on week 45", spark([21, 38, 52, 64], 4.5), 4.2),
        cell(1, "Units on shelf", "1,920", "▼ 13% on week 45", spark([3100, 2650, 2207, 1920], 4.6), 4.3),
        cell(2, "Weeks of stock", "3.2", up("Above") + " the 3.0 floor", spark([5.1, 4.4, 3.8, 3.2], 4.7), 4.4),
        cell(3, "Q4 order", "$86,400", "HubSpot deal 4471", spark([40200, 40200, 86400, 86400], 4.8), 4.5, ring(6.6, 11.6) + tap),
        cell(4, "Reorders", "3", "Approved this quarter", spark([0, 1, 1, 3], 4.9), 4.6),
        cell(5, "Quota, Q4", '88<span style="font-size:20px">%</span>', f'<b style="color:{AMB}">12 pts</b> to quota', spark([61, 70, 79, 88], 5.0), 4.7, ring(11.6, 16.4)),
    ])
    hdr = (f'<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:24px;padding-bottom:18px;border-bottom:2px solid var(--rule)"><div style="display:flex;flex-direction:column;gap:4px"><div style="font-size:19px;color:var(--muted)">Dashboards</div><div style="font-size:31px;font-weight:600;letter-spacing:-0.01em">Cedar Grove launch</div></div>'
           f'<div style="display:flex;align-items:center;gap:10px">{CHIP("Week <b style=\"color:var(--ink)\">46</b>")}{CHIP("Region <b style=\"color:var(--ink)\">All</b>")}<div style="font-size:16px;color:var(--muted);margin-left:8px;text-align:right;line-height:1.35">Updated 7:58, after the<br>Shopify and HubSpot sync</div></div></div>')
    strip = f'<div class="k card" data-at="4.2" style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));border-radius:20px;position:relative">{cells}</div>'
    row = (f'<div style="display:grid;grid-template-columns:minmax(0,1.52fr) minmax(0,1fr);gap:20px">'
           f'<div class="k card" data-at="4.7" style="border-radius:20px;padding:18px 22px 14px;display:flex;flex-direction:column;gap:6px;min-width:0"><div style="display:flex;justify-content:space-between;align-items:center"><div style="{CAP}">Sell-through by week</div><div style="display:flex;gap:14px;font-size:14px;color:var(--muted);align-items:center"><span><i style="display:inline-block;width:20px;border-top:4px solid {SEA};margin-right:6px;vertical-align:3px"></i>Actual</span><span><i style="display:inline-block;width:20px;border-top:4px dotted {WAVE};margin-right:6px;vertical-align:3px"></i>Forecast</span><span><i style="display:inline-block;width:20px;border-top:3px dashed {AMB};margin-right:6px;vertical-align:3px"></i>Target</span></div></div>{trend(640, 218, 4.7, "ag-d", 14, dur=1.0)}</div>'
           f'<div class="k card" data-at="4.8" style="border-radius:20px;padding:18px 22px 14px;display:flex;flex-direction:column;gap:8px;min-width:0"><div style="display:flex;justify-content:space-between;align-items:center"><div style="{CAP}">Sell-through by region</div>{SRC()}</div>{regions(424, 48, 4.9, 17)}<div style="font-size:16px;line-height:1.4;color:var(--ink-soft)"><b style="color:var(--ink)">South is 10 pts under target.</b> West and Mountain carry the launch.</div></div></div>')
    summ = f'<div class="k card" data-at="4.9" style="border-radius:20px;padding:16px 26px;display:flex;flex-direction:column;gap:6px"><div style="{CAP}">Summary</div><div style="font-size:22px;line-height:1.55;color:var(--ink-soft)">Sell-through at Cedar Grove reached {num("64%")} in week 46, up from {num("52%")}. {num("1,920")} units are on shelf across {num("38")} stores, about {num("3.2")} weeks of stock. The reorder of {num("2 pallets")} was approved by Lena Park and sent.</div></div>'
    return f'              {hdr}\n              {strip}\n              {row}\n              {summ}\n'

src = open(P, encoding="utf-8").read().split("\n")
# locate by structure, not line numbers
a = next(i for i, l in enumerate(src) if 'data-out="4.0" style="position:absolute;inset:0;padding:30px 44px' in l or 'data-out="4.0" style="position:absolute;inset:0;overflow:hidden"' in l)
b = next(i for i, l in enumerate(src) if i > a and 'data-fx="fade" data-at="4.1" data-d="0.5" style="position:absolute;inset:0;padding:30px 44px' in l)
d_end = next(i for i in range(b + 1, len(src)) if src[i].strip() == "</div>" and src[i + 1].strip() == "")
out = src[:a] + report_panel().rstrip("\n").split("\n") + [""] + [src[b]] + dashboard_body().rstrip("\n").split("\n") + src[d_end:]
txt = "\n".join(out)
txt = txt.replace("a flash to the team on Mondays (ADR-0087, D25). -->", "a flash to the team on Mondays (ADR-0087, D25). The report and dashboard panels are built by scripts/build-tour-panels.py to match the platform page's product screens. -->")
# overlays: anchor under the Q4 cell and under the quota cell (6-cell strip, 202px cells)
txt = txt.replace('left:44px;top:516px;width:660px', 'left:421px;top:330px;width:660px')
txt = txt.replace('style="position:absolute;left:150px;top:-13px"><path d="M0 14 L14 0 L28 14 Z"', 'style="position:absolute;left:316px;top:-13px"><path d="M0 14 L14 0 L28 14 Z"')
txt = txt.replace('left:630px;top:516px;width:626px', 'left:630px;top:330px;width:626px')
txt = txt.replace('[[0,1,0,0],[5.8,1,0,0],[6.6,1.45,-186,-452],[11.4,1.45,-186,-452],[12.1,1.4,-1018,-414],[16.2,1.4,-1018,-414],[17.0,1.2,-480,-64]]',
                  '[[0,1,0,0],[5.8,1,0,0],[6.6,1.45,-900,-247],[11.4,1.45,-900,-247],[12.1,1.4,-840,-220],[16.2,1.4,-840,-220],[17.0,1.2,-480,-64]]')
open(P, "w", encoding="utf-8").write(txt)
print("rebuilt", a + 1, b + 1, d_end + 1)
