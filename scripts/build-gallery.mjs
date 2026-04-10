import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const imagesDir = path.join(publicDir, 'images');
const studioHtmlPath = path.join(publicDir, 'vaal-studio.html');
const manifestPath = path.join(imagesDir, 'gallery-manifest.json');
const MANIFEST_FILENAME = 'gallery-manifest.json';

/** Anything in images/ except the manifest; browser-previewable types get a thumbnail. */
const IMAGE_EXT = new Set([
  '.jpg',
  '.jpeg',
  '.jpe',
  '.jfif',
  '.pjpeg',
  '.png',
  '.apng',
  '.gif',
  '.webp',
  '.svg',
  '.avif',
  '.bmp',
  '.ico',
  '.tif',
  '.tiff',
]);

function listGalleryItems() {
  if (!fs.existsSync(imagesDir)) {
    console.warn('public/images/ not found; using empty gallery.');
    return [];
  }
  return fs
    .readdirSync(imagesDir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((name) => name !== MANIFEST_FILENAME)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map((name) => ({
      name,
      type: IMAGE_EXT.has(path.extname(name).toLowerCase()) ? 'image' : 'file',
    }));
}

const items = listGalleryItems();
const payload = {
  generatedAt: new Date().toISOString(),
  items,
  /** Kept for older pages; same names as image entries only */
  images: items.filter((i) => i.type === 'image').map((i) => i.name),
};

fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(imagesDir, { recursive: true });
fs.writeFileSync(manifestPath, JSON.stringify(payload, null, 2), 'utf8');
console.log(
  `Wrote public/images/gallery-manifest.json (${items.length} files, ${payload.images.length} previewable as images).`,
);

let html = fs.readFileSync(studioHtmlPath, 'utf8');
const re = /(<script id="gallery-manifest-data" type="application\/json">)([\s\S]*?)(<\/script>)/;
if (!re.test(html)) {
  console.error('vaal-studio.html: missing <script id="gallery-manifest-data" type="application/json">…</script>');
  process.exit(1);
}
html = html.replace(re, `$1${JSON.stringify(payload)}$3`);
fs.writeFileSync(studioHtmlPath, html, 'utf8');
console.log('Updated gallery manifest embed in vaal-studio.html.');
