const fs = require('fs');
const path = require('path');

const htmlPath = process.argv[2] || path.join(__dirname, '..', 'samuel-guevara-silva-corregido (5).html');
const outDir = path.join(__dirname, 'images');
fs.mkdirSync(outDir, { recursive: true });

const html = fs.readFileSync(htmlPath, 'utf8');
const re = /<img[^>]+src="(data:image\/[^"]+)"[^>]*>/gi;
const names = ['portrait-biografia', 'galeria-cajita-andes', 'galeria-artistica-1', 'galeria-artistica-2', 'hero-decorativo'];
let i = 0;
let m;

while ((m = re.exec(html))) {
  const src = m[1];
  const mime = src.match(/^data:(image\/[^;]+)/)[1];
  const b64 = src.split(',')[1];
  const buf = Buffer.from(b64, 'base64');
  const ext = mime.includes('png') ? 'png' : 'jpg';
  const base = names[i] || `imagen-${i + 1}`;
  const file = `${base}.${ext}`;
  fs.writeFileSync(path.join(outDir, file), buf);
  console.log(file, buf.length, mime);
  i++;
}

console.log('Total images:', i);
