// Development-only inspection of an already downloaded source. Never shipped.
// Usage: node scripts/inspect-source.mjs page.html  → { units, detachments } JSON on stdout.
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const html = readFileSync(process.argv[2], 'utf8');
const document = new JSDOM(html).window.document;
// Streamed segments can nest, so keep resolving until nothing moves.
for (let moved = true; moved;) {
  moved = false;
  for (const match of html.matchAll(/\$RS\("([^"]+)","([^"]+)"\)/g)) {
    const source = document.getElementById(match[1]);
    const placeholder = document.getElementById(match[2]);
    if (source && placeholder) { placeholder.replaceWith(...source.childNodes); moved = true; }
  }
}
const cards = [...document.querySelectorAll('.print\\:break-inside-avoid-page')];
const slug = text => text.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const titleCase = text => text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase()).replace(/\bAtv\b/g, 'ATV').replace(/’S\b/g, '’s').replace(/'S\b/g, "'s");
// Changed prices render as "▲ (+5) 45 pts"; the final figure is the current price.
const parsePrice = (text, name) => {
  const match = text?.trim().match(/(\d+) pts$/);
  if (!match) throw new Error(`Unresolved price: ${name}`);
  return Number.parseInt(match[1]);
};
const units = [];
const detachments = [];
for (const card of cards) {
  const heading = card.firstElementChild;
  if (!heading) continue;
  // Changed entries split the heading into name + ▲/▼ (or DP) spans; unchanged ones are plain text.
  const headingSpans = [...heading.querySelectorAll('span')];
  const rawName = (headingSpans[0] ?? heading).textContent.trim();
  if (!rawName) continue;
  const dp = headingSpans[1]?.textContent.trim().match(/^(\d+)\s*DP$/);
  if (dp) {
    const name = titleCase(rawName);
    const enhancements = [...card.querySelectorAll('li')].map(row => {
      const spans = [...row.querySelectorAll('span')];
      const label = spans[0].textContent.trim();
      return { id: slug(label), label, points: parsePrice(spans.at(-1)?.textContent, `${name} / ${label}`) };
    });
    detachments.push({ id: slug(name), name, dp: Number(dp[1]), enhancements });
    continue;
  }
  const name = titleCase(rawName);
  const options = [];
  for (const section of [...card.children].slice(1)) {
    const headingText = section.firstElementChild?.textContent.trim() ?? '';
    if (!headingText.startsWith('YOUR ') && headingText !== 'WARGEAR OPTIONS') continue;
    for (const row of section.querySelectorAll('li')) {
      const spans = [...row.querySelectorAll('span')];
      const points = parsePrice(spans.at(-1)?.textContent, name);
      const size = spans.slice(0, -1).map(span => span.textContent.trim()).join(' ');
      const condition = headingText === 'YOUR UNIT COSTS' ? '' : headingText === 'WARGEAR OPTIONS' ? 'Upgrade only' : headingText.replace(/^YOUR /, '').replace(/ UNITS? COSTS?$/, '').toLowerCase().replace(/\s*\+\s*/, '+ ');
      const label = (condition ? `${size} · ${condition}` : size).trim();
      options.push({ id: slug(label), label, points });
    }
  }
  if (!options.length) continue; // Not a unit card.
  const upgrades = options.filter(option => /Upgrade only|^\+/.test(option.label));
  units.push({ id: slug(name), name, options: options.filter(option => !upgrades.includes(option)),
    ...(upgrades.length ? { upgrades: upgrades.map(option => { const label = option.label.replace(/^per /, '').replace(/ · Upgrade only$/, '').replace(/^\+ /, '').trim(); return { ...option, id: slug(label), label }; }) } : {}) });
}
console.log(JSON.stringify({ units, detachments }, null, 2));
