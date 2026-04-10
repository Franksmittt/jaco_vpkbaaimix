import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'new 14ws.html'), 'utf8').replace(/\r\n/g, '\n');
const startMarker = '        <div class="template-wrapper">';
const a = src.indexOf(startMarker);
const b = src.indexOf('\n    </div>\n\n    <script>');
if (a < 0 || b < 0) {
  console.error('markers', a, b);
  process.exit(1);
}
let block = src.slice(a, b);
block = block.replace(/class="ad-canvas is-vertical"/g, 'class="ad-canvas ad-canvas--hybrid"');
block = block.replace(/class="ad-canvas is-square"/g, 'class="ad-canvas ad-canvas--square ad-canvas--hybrid"');
block = block.replace(/<div class="template-name">(\d+):/g, '<div class="template-name">WS14 · $1:');
block = block.replace(
  '<div style="font-size: 40px; font-weight: 900; opacity: 0.8; line-height: 0.8;">ULTIMATE</div>',
  '<div class="ws14-hero-ultimate">ULTIMATE</div>',
);
fs.writeFileSync(path.join(root, 'scripts', 'ws14-templates.inc.html'), block, 'utf8');
console.log('Wrote scripts/ws14-templates.inc.html', block.length, 'chars');
