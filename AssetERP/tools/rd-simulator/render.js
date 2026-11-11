// 시뮬레이터가 만드는 결과물 — 외부 의존성 없음. RD 양식(.mrd)은 모르므로 "받은 호출 정보"를 표로 보여 준다.
'use strict';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** call: { page, mrd, dbName, fileName, exportType, rv: {k: v}, params: {k: v} } */
function rows(call) {
  const out = [['mrd', call.mrd], ['page', call.page], ['dbName', call.dbName], ['fileName', call.fileName], ['exportType', call.exportType]];
  for (const [k, v] of Object.entries(call.rv)) out.push([`rv.${k}`, v]);
  for (const [k, v] of Object.entries(call.params)) if (!['mrd', 'page', 'dbName', 'fileName', 'exportType', 'rv'].includes(k)) out.push([`param.${k}`, v]);
  return out.filter(([, v]) => v !== undefined && v !== '');
}

function html(call) {
  const tr = rows(call).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>RD 시뮬레이터 - ${esc(call.mrd)}</title>
<style>body{font:13px sans-serif;margin:12px}h3{margin:0 0 8px}table{border-collapse:collapse}th,td{border:1px solid #ccc;padding:4px 8px;text-align:left}th{background:#f3f3f3}</style></head>
<body><h3>RD 시뮬레이터 — ${esc(call.mrd || '(mrd 없음)')}</h3><table>${tr}</table></body></html>`;
}

const ascii = s => String(s).replace(/[^\x20-\x7e]/g, '?').replace(/([\\()])/g, '\\$1');

/** 한 쪽짜리 최소 PDF (Helvetica, 한글은 ?로 대체) */
function pdf(call) {
  const lines = [`RD Simulator - ${call.mrd || ''}`, '', ...rows(call).map(([k, v]) => `${k} = ${v}`)];
  let stream = 'BT /F1 11 Tf 40 800 Td 14 TL\n';
  for (const l of lines) stream += `(${ascii(l).slice(0, 90)}) Tj T*\n`;
  stream += 'ET';
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let body = '%PDF-1.4\n';
  const offsets = [];
  objs.forEach((o, i) => { offsets.push(body.length); body += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = body.length;
  body += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offsets.map(o => `${String(o).padStart(10, '0')} 00000 n \n`).join('');
  body += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(body, 'latin1');
}

// ── 최소 xlsx (zip, 압축 없음) ──
const CRC = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = buf => { let c = 0xffffffff; for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };

function zip(files) {
  const parts = [], central = [];
  let offset = 0;
  for (const [name, text] of files) {
    const nameB = Buffer.from(name), data = Buffer.from(text), crc = crc32(data);
    const head = Buffer.alloc(30);
    head.writeUInt32LE(0x04034b50, 0); head.writeUInt16LE(20, 4); head.writeUInt16LE(0x0800, 6);
    head.writeUInt32LE(crc, 14); head.writeUInt32LE(data.length, 18); head.writeUInt32LE(data.length, 22); head.writeUInt16LE(nameB.length, 26);
    parts.push(head, nameB, data);
    const c = Buffer.alloc(46);
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8);
    c.writeUInt32LE(crc, 16); c.writeUInt32LE(data.length, 20); c.writeUInt32LE(data.length, 24); c.writeUInt16LE(nameB.length, 28); c.writeUInt32LE(offset, 42);
    central.push(c, nameB);
    offset += 30 + nameB.length + data.length;
  }
  const cdSize = central.reduce((n, b) => n + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10); end.writeUInt32LE(cdSize, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, ...central, end]);
}

function xlsx(call) {
  const cell = (r, c, v) => `<c r="${'AB'[c]}${r}" t="inlineStr"><is><t>${esc(v)}</t></is></c>`;
  const sheet = rows(call).map(([k, v], i) => `<row r="${i + 1}">${cell(i + 1, 0, k)}${cell(i + 1, 1, v)}</row>`).join('');
  return zip([
    ['[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'],
    ['_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
    ['xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="RD" sheetId="1" r:id="rId1"/></sheets></workbook>'],
    ['xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'],
    ['xl/worksheets/sheet1.xml', `<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheet}</sheetData></worksheet>`],
  ]);
}

// ── 샘플 파일 (사용자 결정 2026-11-11) ──
// RD가 DB를 읽어 양식대로 그리는 것은 RD 본연의 일이라 흉내 내지 않는다. 대신 사용자가 둔 자료 파일(data/samples/1.<확장자>)을
// 읽어 그대로 돌려준다 → 저장은 fileName 경로에 그 이름으로 복사, 내려받기는 그 내용으로 응답. 원본 샘플은 건드리지 않는다.
// 샘플이 없으면 아래의 "호출 정보" 파일을 만든다. RD_SIM_SAMPLES로 폴더를 바꾸고, RD_SIM_SAMPLES=off 이면 쓰지 않는다.
const fs = require('fs'), path = require('path');
const SAMPLES = process.env.RD_SIM_SAMPLES === 'off' ? null : path.resolve(process.env.RD_SIM_SAMPLES || path.join(__dirname, '..', '..', 'data', 'samples'));
const TYPES = {
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  csv: 'text/csv; charset=utf-8',
};

/** exportType에 맞는 샘플 { body, type, ext, sample } 또는 null */
function sample(t) {
  if (!SAMPLES || !/^[a-z0-9]+$/.test(t)) return null;
  const p = path.join(SAMPLES, `1.${t}`);
  try { return { body: fs.readFileSync(p), type: TYPES[t] || 'application/octet-stream', ext: t, sample: p }; } catch { return null; }
}

/** exportType → { body, type, ext, sample? } */
function file(call) {
  const t = String(call.exportType || '').toLowerCase();
  const s = sample(t);
  if (s) return s;
  if (t === 'pdf') return { body: pdf(call), type: 'application/pdf', ext: 'pdf' };
  if (t === 'xlsx') return { body: xlsx(call), type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', ext: 'xlsx' };
  if (t === 'csv' || t === 'txt') return { body: Buffer.from('﻿' + rows(call).map(r => r.join(',')).join('\n')), type: 'text/csv; charset=utf-8', ext: t };
  return { body: Buffer.from(rows(call).map(r => r.join('=')).join('\n')), type: 'application/octet-stream', ext: t || 'bin' };
}

module.exports = { html, file, rows };
