const fs = require('fs');
const path = require('path');

function jpegSize(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) break;
    const marker = buf[i + 1];
    if (marker === 0xc0 || marker === 0xc2) {
      return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 9) };
    }
    const len = buf.readUInt16BE(i + 2);
    i += 2 + len;
  }
  return null;
}

function pngSize(buf) {
  if (buf.toString('ascii', 1, 4) !== 'PNG') return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const dir = path.join(__dirname, 'images');
for (const file of fs.readdirSync(dir)) {
  const buf = fs.readFileSync(path.join(dir, file));
  const size = file.endsWith('.png') ? pngSize(buf) : jpegSize(buf);
  console.log(file, size, `${(buf.length / 1024).toFixed(1)} KB`);
}
