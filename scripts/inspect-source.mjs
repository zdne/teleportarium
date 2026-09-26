// Development-only inspection of an already downloaded source. Never shipped.
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const html = readFileSync(process.argv[2], 'utf8');
const document = new JSDOM(html).window.document;
for (const match of html.matchAll(/\$RS\("([^"]+)","([^"]+)"\)/g)) {
  const source = document.getElementById(match[1]);
  const placeholder = document.getElementById(match[2]);
  if (source && placeholder) placeholder.replaceWith(...source.childNodes);
}
const cards = [...document.querySelectorAll('.print\\:break-inside-avoid-page')];
const slug = text => text.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const titleCase = text => text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase()).replace(/\bAtv\b/g, 'ATV');
const units = [];
for (const card of cards) {
  if (card.querySelector('.break-all')) continue; // Detachments, deliberately excluded.
  const heading = card.firstElementChild;
  if (!heading?.classList.contains('text-xl')) continue;
  const name = titleCase(heading.textContent.trim());
  const options = [];
  for (const section of [...card.children].slice(1)) {
    const headingText = section.firstElementChild?.textContent.trim() ?? '';
    if (!headingText.startsWith('YOUR ') && headingText !== 'WARGEAR OPTIONS') continue;
    for (const row of section.querySelectorAll('li')) {
      const spans = [...row.querySelectorAll('span')];
      const price = spans.at(-1)?.textContent.trim();
      if (!/^\d+ pts$/.test(price ?? '')) throw new Error(`Unresolved price: ${name}`);
      const size = spans.slice(0, -1).map(span => span.textContent.trim()).join(' ');
      const condition = headingText === 'YOUR UNIT COSTS' ? '' : headingText === 'WARGEAR OPTIONS' ? 'Upgrade only' : headingText.replace(/^YOUR /, '').replace(/ UNITS? COSTS?$/, '').toLowerCase().replace(/\s*\+\s*/, '+ ');
      const label = condition ? `${size} · ${condition}` : size;
      options.push({ id: slug(label), label, points: Number.parseInt(price) });
    }
  }
  if (!options.length) throw new Error(`Missing options: ${name}`);
  units.push({ id: slug(name), name, options });
}
console.log(JSON.stringify({ id: 'space-marines-2026-09', faction: 'Space Marines', label: 'Space Marines — September 2026', source: 'Warhammer Community Munitorum Field Manual', sourceUrl: 'https://mfm.warhammer-community.com/en/space-marines', updated: '2026-09-02', retrieved: '2026-09-26', dateVerified: false, sourceVersion: 'v1.4', completeness: 'All 101 units displayed on the Space Marines page; Legends, detachments and enhancements excluded. Paid wargear is represented by explicitly labelled upgrade-only options, added separately to the base unit.', units }, null, 2));
