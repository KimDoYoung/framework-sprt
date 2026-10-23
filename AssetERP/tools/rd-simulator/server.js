// RD(Crownix Reporting Server) 시뮬레이터 — AS-IS RDUtil.java 가 부르는 계약만 흉내 낸다. 의존성 없음.
//   뷰어   GET  /ReportingServer/html5/RDhtml/CommonViewer.html?mrd=…&dbName=…&rv=k[v]k[v]
//   내려받기 GET|POST /ReportingServer/jsp/CommonInvokerDownload.jsp?…&fileName=x.xlsx&exportType=xlsx  → 파일 응답
//   서버 저장 GET|POST /ReportingServer/jsp/CommonInvoker.jsp?…&fileName=/../../../../../../data1/…/a.pdf  → 파일을 쓰고 "success"
//   점검   GET /__calls[?mrd=]  GET /__reset  GET /__health
// 설정(env): RD_SIM_PORT(5151) RD_SIM_ROOT(./data) RD_SIM_FAIL(정규식 — 맞는 mrd는 저장·내려받기를 실패시킴) RD_SIM_HTTPS_KEY/RD_SIM_HTTPS_CERT(있으면 https)
'use strict';
const http = require('http'), https = require('https'), fs = require('fs'), path = require('path');
const render = require('./render');

const PORT = Number(process.env.RD_SIM_PORT || 5151);
const HOST = process.env.RD_SIM_HOST || '127.0.0.1';  // 이 PC에서만 접속. 다른 PC에 열려면 RD_SIM_HOST=0.0.0.0
const ROOT = path.resolve(process.env.RD_SIM_ROOT || path.join(__dirname, 'data'));
const FAIL = process.env.RD_SIM_FAIL ? new RegExp(process.env.RD_SIM_FAIL) : null;
const LOG = path.join(__dirname, 'calls.jsonl');
const DB_NAMES = ['post_real', 'post_dev-devdb', 'post_dev-realdb'];

const calls = [];

/** rv=companyId[28000]personId[-1] → { companyId:'28000', personId:'-1' } (RDUtil이 key[value]를 이어 붙인다) */
function parseRv(s) {
  const rv = {};
  for (const m of String(s || '').matchAll(/([^\[\]]+)\[([^\]]*)\]/g)) rv[m[1]] = m[2];
  return rv;
}

function parseCall(req, url) {
  const q = Object.fromEntries(url.searchParams);
  const page = path.basename(url.pathname);
  return {
    time: new Date().toISOString(), method: req.method, page, dir: path.dirname(url.pathname),
    mrd: q.mrd, dbName: q.dbName, dns: q.dns, options: q.options, fileName: q.fileName, exportType: q.exportType,
    rv: parseRv(q.rv), params: q,
  };
}

/** AS-IS는 fileName 앞에 /../../../../../.. 를 붙여 RD 기본 폴더(…/report/)를 벗어난다 → 접두 `..`를 걷어내고 가상 루트 ROOT 아래로 옮긴다 */
function resolveSave(fileName) {
  const clean = String(fileName).replace(/\\/g, '/').split('/').filter(s => s && s !== '..' && s !== '.').join('/');
  const target = path.resolve(ROOT, clean);
  if (!clean || (target !== ROOT && !target.startsWith(ROOT + path.sep))) return null;
  return target;
}

function validate(call) {
  const problems = [];
  if (!call.mrd) problems.push('mrd 없음');
  if (call.dbName && !DB_NAMES.includes(call.dbName)) problems.push(`알 수 없는 dbName: ${call.dbName}`);
  return problems;
}

function handle(req, res) {
  const url = new URL(req.url, 'http://x');
  const send = (code, body, type = 'text/plain; charset=utf-8', extra = {}) => { res.writeHead(code, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*', ...extra }); res.end(body); };

  if (url.pathname === '/__health') return send(200, 'ok');
  if (url.pathname === '/__reset') { calls.length = 0; fs.rmSync(LOG, { force: true }); return send(200, 'reset'); }
  if (url.pathname === '/__calls') {
    const m = url.searchParams.get('mrd');
    return send(200, JSON.stringify(m ? calls.filter(c => c.mrd === m) : calls, null, 1), 'application/json; charset=utf-8');
  }
  if (!url.pathname.startsWith('/ReportingServer/')) return send(404, 'not found');

  const call = parseCall(req, url);
  call.problems = validate(call);
  const record = extra => { Object.assign(call, extra); calls.push(call); fs.appendFile(LOG, JSON.stringify(call) + '\n', () => {}); };
  const failed = FAIL && FAIL.test(call.mrd || '');

  // 서버 저장 (결재 첨부 PDF 등)
  if (call.page.startsWith('CommonInvoker.')) {
    if (failed) { record({ result: 'fail' }); return send(200, 'fail|RD_SIM_FAIL 로 실패시킴'); }
    const target = resolveSave(call.fileName);
    if (!target) { record({ result: 'rejected' }); return send(400, 'fail|fileName 이 가상 루트 밖이거나 비어 있음'); }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, render.file(call).body);
    record({ result: 'saved', savedTo: target });
    return send(200, 'success');
  }
  // 브라우저로 내려받기 (엑셀·PDF)
  if (call.page.startsWith('CommonInvokerDownload.')) {
    if (failed) { record({ result: 'fail' }); return send(500, 'fail|RD_SIM_FAIL 로 실패시킴'); }
    const f = render.file(call);
    const name = encodeURIComponent(call.fileName || `${call.mrd}.${f.ext}`);
    record({ result: 'download', bytes: f.body.length });
    return send(200, f.body, f.type, { 'Content-Disposition': `attachment; filename*=UTF-8''${name}` });
  }
  // 뷰어 (CommonViewer.html 등)
  record({ result: 'viewer' });
  return send(200, render.html(call), 'text/html; charset=utf-8');
}

const server = process.env.RD_SIM_HTTPS_KEY
  ? https.createServer({ key: fs.readFileSync(process.env.RD_SIM_HTTPS_KEY), cert: fs.readFileSync(process.env.RD_SIM_HTTPS_CERT) }, handle)
  : http.createServer(handle);
server.listen(PORT, HOST, () => console.log(`RD simulator ${process.env.RD_SIM_HTTPS_KEY ? 'https' : 'http'}://${HOST}:${PORT}  root=${ROOT}`));
