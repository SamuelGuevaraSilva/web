const fs = require('fs');
const path = require('path');

const json = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'samuel-guevara-data.json'), 'utf8'));
const outDir = path.join(__dirname, 'images-json');
fs.mkdirSync(outDir, { recursive: true });

(json.gallery || []).forEach((item, i) => {
  const src = item.data || '';
  const mime = (src.match(/^data:(image\/[^;]+)/) || [])[1] || 'image/jpeg';
  const b64 = src.split(',')[1];
  if (!b64) return;
  const buf = Buffer.from(b64, 'base64');
  const ext = mime.includes('png') ? 'png' : 'jpg';
  const slug = (item.label || `gallery-${i + 1}`)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const file = `json-${slug}.${ext}`;
  fs.writeFileSync(path.join(outDir, file), buf);
  console.log(file, buf.length, mime, item.label || '');
});
