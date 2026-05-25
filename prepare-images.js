const fs = require('fs');
const path = require('path');

const json = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'samuel-guevara-data.json'), 'utf8')
);
const outDir = path.join(__dirname, 'images');
fs.mkdirSync(outDir, { recursive: true });

function writeDataUrl(file, dataUrl) {
  const mime = (dataUrl.match(/^data:(image\/[^;]+)/) || [])[1] || 'image/jpeg';
  const b64 = dataUrl.split(',')[1];
  const buf = Buffer.from(b64, 'base64');
  const ext = mime.includes('png') ? 'png' : 'jpg';
  const full = path.join(outDir, `${file}.${ext}`);
  fs.writeFileSync(full, buf);
  return { full, ext, bytes: buf.length };
}

// Portrait from HTML extraction (best biography asset)
const htmlPortrait = fs.readFileSync(path.join(outDir, 'portrait-biografia.jpg'));
fs.writeFileSync(path.join(outDir, 'portrait.jpg'), htmlPortrait);
fs.writeFileSync(path.join(outDir, 'samuel-guevara-silva-biografia.jpg'), htmlPortrait);

const gallery = json.gallery || [];
const artistic = gallery.filter((g) => /art[ií]stic/i.test(g.label || ''));
const concert = gallery.find((g) => /concierto|andes|cajita/i.test(g.label || ''));

if (concert) {
  writeDataUrl('galeria-la-cajita-universidad-andes-2025', concert.data);
}

artistic.forEach((item, index) => {
  writeDataUrl(`galeria-fotografia-artistica-${index + 1}`, item.data);
});

// Keep hero decorative from HTML if present
const heroSrc = path.join(outDir, 'hero-decorativo.png');
if (fs.existsSync(heroSrc)) {
  fs.copyFileSync(heroSrc, path.join(outDir, 'decoracion-hero.png'));
}

console.log('Prepared images:');
for (const file of fs.readdirSync(outDir).sort()) {
  const stat = fs.statSync(path.join(outDir, file));
  console.log(`  ${file} (${Math.round(stat.size / 1024)} KB)`);
}
