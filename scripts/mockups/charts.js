// Tiny SVG helpers shared by the two screens. All data is example data.
const C = {sea:"#2f5a66",wave:"#4b90a3",soft:"#b9d3da",ink:"#1c2a33",muted:"#606a6f",rule:"rgba(28,42,51,.12)",amber:"#a35f0a"};
const WEEKS = [{w:43,v:21},{w:44,v:38},{w:45,v:52},{w:46,v:64}];
const TARGET = 60;
const REGIONS = [{n:"West",s:14,v:72},{n:"Mountain",s:9,v:67},{n:"Midwest",s:8,v:58},{n:"South",s:7,v:50}];
const PRODUCTS = [{n:"Alder Throw",u:610,st:78,wk:2.2},{n:"Pine Mug Set",u:540,st:69,wk:3.0},{n:"Cedar Candle",u:430,st:57,wk:3.8},{n:"Trail Tote",u:340,st:41,wk:4.4}];

// Sell-through trend: actuals, a dashed forecast, and the target line.
function trend({w,h,forecast=true,labels=true}){
  const L=54,R=36,T=30,B=40,iw=w-L-R,ih=h-T-B;
  const pts=[...WEEKS.map(d=>({w:d.w,v:d.v})),...(forecast?[{w:47,v:71,f:1},{w:48,v:76,f:1}]:[])];
  const x=i=>L+iw*(i/(pts.length-1)), y=v=>T+ih*(1-v/80);
  let s=`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.wave}" stop-opacity=".30"/><stop offset="1" stop-color="${C.wave}" stop-opacity="0"/></linearGradient></defs>`;
  for(const g of [0,20,40,60,80]) s+=`<line x1="${L}" x2="${w-R}" y1="${y(g)}" y2="${y(g)}" stroke="${C.rule}" stroke-dasharray="${g?'':'0'}"/><text x="${L-12}" y="${y(g)+5}" text-anchor="end" font-size="15" fill="${C.muted}">${g}%</text>`;
  const act=pts.filter(p=>!p.f), n=act.length;
  s+=`<path d="M${x(0)},${y(act[0].v)} ${act.map((p,i)=>`L${x(i)},${y(p.v)}`).join(" ")} L${x(n-1)},${y(0)} L${x(0)},${y(0)}Z" fill="url(#ag)"/>`;
  // target
  s+=`<line x1="${L}" x2="${w-R}" y1="${y(TARGET)}" y2="${y(TARGET)}" stroke="${C.amber}" stroke-width="2" stroke-dasharray="7 6"/><text x="${L+8}" y="${y(TARGET)-9}" text-anchor="start" font-size="15" font-weight="600" fill="${C.amber}">Target 60%</text>`;
  if(forecast) s+=`<path d="M${x(n-1)},${y(act[n-1].v)} ${pts.slice(n).map((p,i)=>`L${x(n+i)},${y(p.v)}`).join(" ")}" fill="none" stroke="${C.wave}" stroke-width="3" stroke-dasharray="3 7" stroke-linecap="round"/>`;
  s+=`<path d="M${act.map((p,i)=>`${x(i)},${y(p.v)}`).join(" L")}" fill="none" stroke="${C.sea}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
  pts.forEach((p,i)=>{
    const last=i===n-1;
    s+=p.f?`<circle cx="${x(i)}" cy="${y(p.v)}" r="6" fill="#fcfbf7" stroke="${C.wave}" stroke-width="2.5"/>`:`<circle cx="${x(i)}" cy="${y(p.v)}" r="${last?9:6}" fill="${last?C.sea:'#fcfbf7'}" stroke="${C.sea}" stroke-width="3"/>`;
    if(labels) s+=`<text x="${x(i)}" y="${p.v<TARGET&&TARGET-p.v<10?y(p.v)+34:y(p.v)-(last?20:15)}" text-anchor="middle" font-size="${last?22:17}" font-weight="${last?700:600}" fill="${p.f?C.wave:C.sea}">${p.v}%</text>`;
    s+=`<text x="${x(i)}" y="${h-12}" text-anchor="middle" font-size="16" fill="${last?C.ink:C.muted}" font-weight="${last?600:400}">Wk ${p.w}</text>`;
  });
  return s+`</svg>`;
}
// Sparkline for KPI cells.
function spark(vals,{w=96,h=34,color=C.sea}={}){
  const mn=Math.min(...vals),mx=Math.max(...vals),p=4;
  const x=i=>p+(w-2*p)*i/(vals.length-1), y=v=>h-p-(h-2*p)*((v-mn)/((mx-mn)||1));
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="M${vals.map((v,i)=>`${x(i)},${y(v)}`).join(" L")}" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${x(vals.length-1)}" cy="${y(vals[vals.length-1])}" r="4.5" fill="${color}"/></svg>`;
}
// Ranked horizontal bars with a target tick.
function bars(rows,{w,rowH=56,label=96,max=100,target=TARGET,fmt=v=>v+"%",sub=r=>""}){
  const bw=w-label-84, h=rows.length*rowH;
  let s=`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`;
  rows.forEach((r,i)=>{
    const cy=i*rowH+rowH/2, ok=r.v>=target;
    s+=`<text x="0" y="${cy-3}" font-size="18" font-weight="600" fill="${C.ink}">${r.n}</text><text x="0" y="${cy+18}" font-size="15" fill="${C.muted}">${sub(r)}</text>`;
    s+=`<rect x="${label}" y="${cy-13}" width="${bw}" height="26" rx="6" fill="rgba(28,42,51,.055)"/><rect x="${label}" y="${cy-13}" width="${bw*r.v/max}" height="26" rx="6" fill="${ok?C.sea:C.wave}"${ok?"":' opacity=".62"'}/>`;
    s+=`<text x="${w}" y="${cy+7}" text-anchor="end" font-size="20" font-weight="700" fill="${ok?C.sea:C.amber}">${fmt(r.v)}</text>`;
  });
  const tx=label+bw*target/max;
  s+=`<line x1="${tx}" x2="${tx}" y1="2" y2="${h-2}" stroke="${C.amber}" stroke-width="2.5" stroke-dasharray="5 5"/>`;
  return s+`</svg>`;
}
