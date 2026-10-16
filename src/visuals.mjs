// These diagrams contain only supplied metrics or explicitly conceptual geometry.
const text = (x, y, value, size = 14, color = '#aaa9a4', extra = '') => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-family="Arial, sans-serif" ${extra}>${value}</text>`;
const svg = (label, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 580" role="img" aria-label="${label}"><rect width="900" height="580" fill="#151516"/>${body}</svg>`;
export function universe(id = 'universe-glow') {
  let dots = '';
  for (let i = 0; i < 900; i++) {
    const z = 1 - 2 * (i + .5) / 900;
    const angle = i * 2.399963;
    const radius = Math.sqrt(1 - z * z);
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    dots += `<circle cx="${450 + x * 275}" cy="${280 + z * 205 + y * 60}" r="${y > 0 ? 1.8 : .8}" fill="${i % 9 === 0 ? '#f1e6ce' : '#d7a665'}" opacity="${.2 + (y + 1) * .32}"/>`;
  }
  return svg('Conceptual universe of connected data points; not measured cricket data', `<defs><radialGradient id="${id}"><stop stop-color="#a97737" stop-opacity=".16"/><stop offset="1" stop-color="#151516" stop-opacity="0"/></radialGradient></defs><circle cx="450" cy="290" r="320" fill="url(#${id})"/><g fill="none" stroke="#c7a478" opacity=".3"><ellipse cx="450" cy="290" rx="360" ry="116" transform="rotate(-24 450 290)"/><ellipse cx="450" cy="290" rx="338" ry="102" transform="rotate(24 450 290)"/><path d="M70 290H830M450 30V550" stroke-dasharray="2 12" opacity=".35"/></g>${dots}<circle cx="760" cy="184" r="5" fill="#f1c88e"/>${text(32, 43, 'SOURCE → STRUCTURE → INSIGHT', 12)}${text(32, 540, '17,980 MATCHES', 13, '#d9b27a')}${text(700, 540, '10M+ RECORDS', 13, '#d9b27a')}`);
}
export function visual(kind) {
  if (kind === 'cricket') return universe();
  if (kind === 'retail') return svg('Reported card share of wallet: earlier 28.91 percent; later 19.48 percent; decline 9.43 percentage points', `${text(52, 57, 'A SHIFT IN THE SHARE OF SPENDING', 12)}${text(52, 116, 'Where did the card spend go?', 30, '#f2f0ea')}<line x1="68" y1="440" x2="832" y2="440" stroke="#4b4945"/><rect x="160" y="190" width="150" height="250" fill="#c4c1b7"/><rect x="590" y="271.5" width="150" height="168.5" fill="#d8ad70"/>${text(235, 170, '28.91%', 36, '#f2f0ea', 'text-anchor="middle"')}${text(665, 250, '19.48%', 36, '#d8ad70', 'text-anchor="middle"')}${text(235, 472, 'EARLIER', 12, '#aaa9a4', 'text-anchor="middle"')}${text(665, 472, 'LATER', 12, '#aaa9a4', 'text-anchor="middle"')}<path d="M344 246H532m-12-10 12 10-12 10" stroke="#d8ad70" fill="none"/>${text(439, 225, '−9.43 pp', 20, '#d8ad70', 'text-anchor="middle"')}${text(52, 540, '45,000 CUSTOMERS', 12)}${text(650, 540, '444,118 TRANSACTIONS', 12)}`);
  if (kind === 'pipeline') {
    const stages = [['SOURCE', 'Cricsheet JSON', 'Immutable originals'], ['CANONICAL', 'Match · innings · delivery', 'Source-faithful records'], ['INTERPRET', 'Law / state layer', 'Explicit supported rules'], ['ANALYZE', 'SQL & aggregates', 'Traceable metrics']];
    return svg('Simplified documented pipeline: source JSON to canonical records to Law interpretation to analytics', `${text(45, 60, 'RELIABILITY IS BUILT IN LAYERS', 12)}${stages.map((s, i) => `<rect x="${45 + i * 213}" y="180" width="177" height="200" rx="2" stroke="#5d5140" fill="#1b1b1c"/>${text(65 + i * 213, 218, String(i + 1).padStart(2, '0'), 15, '#d8ad70')}${text(65 + i * 213, 271, s[0], 17, '#f2f0ea')}${text(65 + i * 213, 307, s[1], 11)}${text(65 + i * 213, 348, s[2], 11)}${i < 3 ? `<path d="M${228 + i * 213} 280h23m-6-5 6 5-6 5" stroke="#d8ad70" fill="none"/>` : ''}`).join('')}${text(45, 455, 'SOURCE LINEAGE PRESERVED THROUGHOUT', 13, '#d8ad70')}${text(45, 487, 'Historical rule certification remains a separate acceptance gate.', 14)}`);
  }
  if (kind === 'segments') return svg('Retention framework: silent attrition, payment switching and spend contraction; only silent attrition count was supplied', `${text(50, 62, 'FROM A HEADLINE TO A RETENTION QUESTION', 12)}${[['01', 'Silent attrition', '7,950 customers', 'Re-engagement opportunities'], ['02', 'Payment switching', 'Count not supplied', 'Understand payment preferences'], ['03', 'Spend contraction', 'Count not supplied', 'Investigate reduced spending']].map((s, i) => `<line x1="50" y1="${145 + i * 116}" x2="850" y2="${145 + i * 116}" stroke="#383635"/>${text(50, 193 + i * 116, s[0], 15, '#d8ad70')}${text(108, 194 + i * 116, s[1], 25, '#f2f0ea')}${text(575, 185 + i * 116, s[2], 19, i === 0 ? '#d8ad70' : '#aaa9a4')}${text(575, 213 + i * 116, s[3], 12)}`).join('')}${text(50, 540, '₹39.95M MODELED SHARE GAP · NOT REALIZED REVENUE', 14, '#d8ad70')}`);
  if (kind.startsWith('effort')) {
    const pct = kind === 'effort60' ? 60 : 20;
    return svg(`Illustrative normalized effort: baseline 100, after approximately ${100 - pct}; resume-reported ${pct} percent reduction`, `${text(54, 62, 'LESS REPETITION. MORE ROOM FOR ANALYSIS.', 12)}${text(54, 159, `≈${pct}%`, 80, '#d8ad70')}${text(58, 203, 'reported effort reduction', 22, '#f2f0ea')}${text(55, 292, 'Before · normalized baseline', 15)}<rect x="55" y="312" width="785" height="46" fill="#585752"/>${text(825, 342, '100', 18, '#f2f0ea', 'text-anchor="end"')}${text(55, 412, 'After · approximate normalized effort', 15)}<rect x="55" y="432" width="${785 * (100 - pct) / 100}" height="46" fill="#d8ad70"/>${text(70, 462, String(100 - pct), 18, '#151516')}${text(55, 538, 'ILLUSTRATIVE INDEX · NOT MEASURED HOURS', 12)}`);
  }
  if (kind === 'research' || kind === 'seaweed') {
    const sea = kind === 'seaweed';
    let cells = '';
    for (let x = 0; x < 17; x++) for (let y = 0; y < 13; y++) {
      cells += `<rect x="${55 + x * 17}" y="${152 + y * 18}" width="12" height="11" rx="1" fill="${(x * 7 + y * 3) % 5 === 0 ? '#d8ad70' : '#53524b'}" opacity="${.35 + ((x + y) % 4) * .15}"/>`;
    }
    return svg(sea ? 'Illustrative wide-data matrix transformed through clean, validate and analyze stages' : 'Illustrative multi-sheet research data transformed into structured analysis', `${text(50, 58, sea ? 'FINDING STRUCTURE IN COMPLEXITY' : 'FROM FRAGMENTED FILES TO A CLEARER VIEW', 12)}${cells}<path d="M385 277h122m-12-10 12 10-12 10" stroke="#d8ad70" fill="none"/><circle cx="445" cy="277" r="34" fill="#151516" stroke="#665239"/>${text(445, 283, 'ETL', 13, '#d8ad70', 'text-anchor="middle"')}${['CLEAN', 'VALIDATE', 'ANALYZE'].map((s, i) => `<rect x="560" y="${145 + i * 90}" width="280" height="65" fill="#1b1b1c" stroke="#4a4236"/>${text(582, 183 + i * 90, `0${i + 1} / ${s}`, 14, '#ded9ce')}<path d="M795 ${174 + i * 90}l6 6 12-14" fill="none" stroke="#d8ad70"/>`).join('')}${text(55, 453, sea ? '2,500+ columns' : '50+ multi-sheet datasets', 27, '#f2f0ea')}${text(560, 453, sea ? 'Repeatable preparation' : '900+ variables', 23, '#d8ad70')}${text(55, 539, 'CONCEPTUAL WORKFLOW · NO PRIVATE DATA SHOWN', 12)}`);
  }
  return '';
}
