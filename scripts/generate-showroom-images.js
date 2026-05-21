'use strict';
const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');

// ── CRC32 (required for PNG chunk checksums) ────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function u32be(n) { const b = Buffer.alloc(4); b.writeUInt32BE(n, 0); return b; }

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  return Buffer.concat([u32be(data.length), t, data, u32be(crc32(Buffer.concat([t, data])))]);
}

// ── Minimal PNG encoder (RGB, no alpha) ─────────────────────────────────────
function solidPNG(w, h, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = chunk('IHDR', Buffer.concat([
    u32be(w), u32be(h), Buffer.from([8, 2, 0, 0, 0])
  ]));

  // Each scanline: 1 filter byte (0 = None) + w*3 RGB bytes
  const row = Buffer.alloc(1 + w * 3);
  for (let x = 0; x < w; x++) { row[1 + x*3] = r; row[2 + x*3] = g; row[3 + x*3] = b; }
  const raw = Buffer.concat(Array.from({ length: h }, () => row));
  const idat = chunk('IDAT', zlib.deflateSync(raw, { level: 6 }));

  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

function hex(s) {
  const n = parseInt(s.replace('#', ''), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

// ── Project definitions ──────────────────────────────────────────────────────
const projects = [
  { file: 'budget-tracker.png',   color: '#16a34a' }, // emerald  — money
  { file: 'cli-tool.png',         color: '#1e293b' }, // slate    — terminal
  { file: 'design-system.png',    color: '#7c3aed' }, // violet   — design
  { file: 'git-dashboard.png',    color: '#ea580c' }, // orange   — git
  { file: 'hexo-blog.png',        color: '#0369a1' }, // blue     — coldnight
  { file: 'keyboard-trainer.png', color: '#ca8a04' }, // amber    — keys
  { file: 'markdown-editor.png',  color: '#0f766e' }, // teal     — writing
  { file: 'og-generator.png',     color: '#db2777' }, // pink     — social
  { file: 'photo-gallery.png',    color: '#78350f' }, // brown    — photography
  { file: 'rss-reader.png',       color: '#dc2626' }, // red      — RSS
];

// ── Generate ─────────────────────────────────────────────────────────────────
const outDir = path.join(__dirname, '..', 'source', 'images', 'showroom');
fs.mkdirSync(outDir, { recursive: true });

for (const { file, color } of projects) {
  const [r, g, b] = hex(color);
  fs.writeFileSync(path.join(outDir, file), solidPNG(800, 800, r, g, b));
  console.log(`  ✓  ${file}  ${color}`);
}

console.log(`\n${projects.length} images written to ${outDir}`);
