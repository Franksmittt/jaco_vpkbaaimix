import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = path.join(root, 'public', 'index.html');
const fragPath = path.join(root, 'scripts', 'ws14-templates.inc.html');

let index = fs.readFileSync(indexPath, 'utf8').replace(/\r\n/g, '\n');
const frag = fs.readFileSync(fragPath, 'utf8').replace(/\r\n/g, '\n');

const needle = `                        <div class="sq-e4-wa" style="font-size:clamp(17px,5.5cqw,24px);font-weight:900;letter-spacing:0.08em;color:var(--apple-white);text-align:center;width:100%;text-shadow:0 2px 16px rgba(0,0,0,0.95),0 1px 3px rgba(0,0,0,1),0 4px 20px rgba(0,0,0,0.65);line-height:1.2;margin-top:4px;">063 184 1939</div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <section class="asset-gallery" aria-labelledby="gallery-heading">`;

const replacement = `                        <div class="sq-e4-wa" style="font-size:clamp(17px,5.5cqw,24px);font-weight:900;letter-spacing:0.08em;color:var(--apple-white);text-align:center;width:100%;text-shadow:0 2px 16px rgba(0,0,0,0.95),0 1px 3px rgba(0,0,0,1),0 4px 20px rgba(0,0,0,0.65);line-height:1.2;margin-top:4px;">063 184 1939</div>
                    </div>
                </div>
            </div>
        </div>

${frag}

    </div>

    <section class="asset-gallery" aria-labelledby="gallery-heading">`;

if (!index.includes('sq-e4-wa')) {
  console.error('sq-e4 marker missing');
  process.exit(1);
}
if (!index.includes(needle)) {
  console.error('needle missing — check line endings');
  process.exit(1);
}
index = index.replace(needle, replacement);
fs.writeFileSync(indexPath, index, 'utf8');
console.log('Merged WS14 templates into public/index.html');
