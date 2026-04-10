import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const imagesDir = path.join(root, 'images');
const indexPath = path.join(root, 'index.html');
const manifestPath = path.join(imagesDir, 'gallery-manifest.json');

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif']);

function listImageFiles() {
  if (!fs.existsSync(imagesDir)) {
    console.warn('images/ not found; using empty gallery.');
    return [];
  }
  return fs
    .readdirSync(imagesDir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((name) => IMAGE_EXT.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

const images = listImageFiles();
const payload = {
  generatedAt: new Date().toISOString(),
  images,
};

fs.mkdirSync(imagesDir, { recursive: true });
fs.writeFileSync(manifestPath, JSON.stringify(payload, null, 2), 'utf8');
console.log(`Wrote images/gallery-manifest.json (${images.length} images).`);

let html = fs.readFileSync(indexPath, 'utf8');
const re = /(<script id="gallery-manifest-data" type="application\/json">)([\s\S]*?)(<\/script>)/;
if (!re.test(html)) {
  console.error('index.html: missing <script id="gallery-manifest-data" type="application/json">…</script>');
  process.exit(1);
}
html = html.replace(re, `$1${JSON.stringify(payload)}$3`);
fs.writeFileSync(indexPath, html, 'utf8');
console.log('Updated gallery manifest embed in index.html.');
