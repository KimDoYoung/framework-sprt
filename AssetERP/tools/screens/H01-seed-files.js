// H01 시험 데이터: ~/shared/attach/law 의 PDF를 법규공지(type 10) 실제 제목 11건에 붙인다 (사용자 요청 2026-10-20).
// kfstest 관리자로 로그인해 앱 업로드 API(POST v1/sys/files)를 쓴다 → DB 행과 실제 파일이 같이 생긴다.
// 올린 파일 ID는 docs/work/H/H01-seed-files.json 에 남긴다. 지우려면: node H01-seed-files.js --undo
const fs = require('fs'), path = require('path');
const { BASE, launch, login } = require('./_common');
const DIR = process.env.HOME + '/shared/attach/law';
const OUT = path.join(__dirname, '../../docs/work/H/H01-seed-files.json');
const NOTICES = [202412302061926, 202412302061928, 202412302061930, 202412302061933, 202412302061936, 202412302061939, 202412302061941, 202501082067490];
const ONLY = process.argv.includes('--one');

(async () => {
  const { b, p } = await launch();
  await login(p, 'kfstest');
  const ctx = p.context().request;
  const api = BASE.replace(/\/$/, '') + '/api/v1/sys/files';
  if (process.argv.includes('--undo')) {
    const ids = JSON.parse(fs.readFileSync(OUT)).created.map(c => c.fileId);
    for (const id of ids) { const r = await ctx.delete(`${api}/${id}`, { headers: await hdr(p) }); console.log('delete', id, r.status()); }
    await b.close(); return;
  }
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.pdf')).sort();
  const targets = ONLY ? [[NOTICES[0], files.slice(0, 1)]] : NOTICES.map((n, i) => {
    const per = files.length / NOTICES.length;
    return [n, files.slice(Math.round(i * per), Math.round((i + 1) * per))];
  });
  const created = [];
  for (const [parentId, list] of targets) {
    for (const f of list) {
      const r = await ctx.post(`${api}?parentId=${parentId}`, { headers: await hdr(p), multipart: { file: { name: f, mimeType: 'application/pdf', buffer: fs.readFileSync(path.join(DIR, f)) } } });
      const j = await r.json().catch(() => ({}));
      console.log(r.status(), parentId, f.slice(0, 40), j.data && j.data.fileId);
      if (r.status() === 200) created.push({ parentId, fileId: j.data.fileId, fileNm: f });
    }
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT)).created : [];
  fs.writeFileSync(OUT, JSON.stringify({ created: prev.concat(created) }, null, 1));
  await b.close();
})();
async function hdr(p) {
  const t = await p.evaluate(() => { for (const s of [localStorage, sessionStorage]) for (const k of Object.keys(s)) { const v = s.getItem(k); if (/token/i.test(k) && v && v.length > 40) return v; } return null; });
  return t ? { Authorization: 'Bearer ' + t.replace(/^"|"$/g, '') } : {};
}
