#!/usr/bin/env node
/**
 * 외부 연동 시뮬레이터 — AS-IS가 부르는 외부 서버 2종을 흉내 낸다. 의존성 없음(Node 내장 모듈). 알림 시뮬레이터와 같은 방식.
 *   AI 점검의견(BotService)   POST /api/erp/completion   JSON {user_prompt, task_type} → {success, content, error}
 *   새 메일 시스템(assetMail) POST /api/erp/mail-write   헤더 X-Service-Token, JSON {refKey, personId, header, content, fileKey, fileList, sso_token} → {open_url}
 *                             GET  /mail/write/{id}       open_url이 가리키는 메일 쓰기창(흉내) — [보내기]는 기록만 남긴다
 * 받은 호출은 /__calls 와 calls.jsonl 에 남는다. 실제로는 아무 데도 보내지 않는다.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const HOSTS = (process.env.EXT_SIM_HOST || '127.0.0.1').split(',').map(s => s.trim()).filter(Boolean);
const PORT = Number(process.env.EXT_SIM_PORT || 5171);
const FAIL = (process.env.EXT_SIM_FAIL || '').split(',').map(s => s.trim()).filter(Boolean);   // bot,mail
const MAIL_TOKEN = process.env.EXT_SIM_MAIL_TOKEN || 'sim-assetmail-token';
const BOT_DELAY = Number(process.env.EXT_SIM_BOT_DELAY_MS || 800);
const LOG = path.join(__dirname, 'calls.jsonl');

let calls = [];
let seq = 0;
const drafts = new Map();   // 메일 쓰기창 id → 요청

function record(call) {
  call.id = ++seq;
  call.time = new Date().toISOString();
  calls.push(call);
  try { fs.appendFileSync(LOG, JSON.stringify(call) + '\n'); } catch (e) { /* 기록 실패는 무시 */ }
  console.log(`[${call.kind}] #${call.id} ${call.result} ${call.problems && call.problems.length ? '문제: ' + call.problems.join(' / ') : ''}`);
  return call;
}

function json(res, status, body) {
  const s = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json;charset=utf-8', 'Content-Length': Buffer.byteLength(s) });
  res.end(s);
}

function html(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'text/html;charset=utf-8', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}

function readBody(req) {
  return new Promise(resolve => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** user_prompt "[점점항목]: …\n[점검방법]: …\n[검토결과]: …" 에서 값 */
function promptField(prompt, label) {
  const m = new RegExp('\\[' + label + '\\]:\\s*([^\\n]*)').exec(prompt || '');
  return m ? m[1].trim() : '';
}

/** 그럴듯한 점검의견(고정 문장 틀) — 실제 AI가 아니다 */
function botAnswer(prompt) {
  const item = promptField(prompt, '점점항목') || promptField(prompt, '점검항목');
  const how = promptField(prompt, '점검방법');
  const result = promptField(prompt, '검토결과');
  const lines = [
    `[AI 시뮬레이터] 점검결과 "${result || '-'}" 기준 점검의견 초안입니다.`,
    '',
    `1. 점검항목: ${item || '-'}`,
    `2. 점검방법: ${how || '-'}`,
  ];
  if (/미흡|부적정|불충분|개선/.test(result)) {
    lines.push('3. 의견: 점검방법에 따라 확인한 결과 일부 미흡한 사항이 확인되어 조치계획을 수립하고 이행 여부를 다음 점검 시 재확인할 필요가 있습니다.');
  } else {
    lines.push('3. 의견: 점검방법에 따라 관련 증빙을 확인한 결과 내부기준에 따라 적정하게 운영되고 있는 것으로 판단됩니다.');
  }
  return lines.join('\n');
}

function mailWritePage(id, d) {
  const files = (d.fileList || []).map(f => `<li>파일 ID ${esc(f)}</li>`).join('') || '<li>(없음)</li>';
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>assetMail 시뮬레이터 — 메일 쓰기</title>
<style>body{font-family:sans-serif;margin:0;background:#f5f6f8}header{background:#1F4D83;color:#fff;padding:10px 16px;font-weight:bold}
main{padding:16px}label{display:block;font-weight:bold;margin:10px 0 4px}input,textarea{width:100%;box-sizing:border-box;padding:6px;border:1px solid #ccc}
textarea{height:300px}.meta{color:#666;font-size:12px}button{margin-top:12px;padding:6px 18px}.sent{color:#0a7d22;font-weight:bold}</style></head>
<body><header>assetMail 시뮬레이터 · 메일 쓰기 (실제 발송 없음)</header><main>
<div class="meta">refKey ${esc(d.refKey)} · personId ${esc(d.personId)} · fileKey ${esc(d.fileKey)} · sso_token ${esc(String(d.sso_token || '').slice(0, 8))}…</div>
<form method="post" action="/mail/write/${id}/send">
<label>받는 사람</label><input name="to" placeholder="받는 사람 메일 주소">
<label>제목</label><input name="header" value="${esc(d.header)}">
<label>내용</label><textarea name="content">${esc(d.content)}</textarea>
<label>첨부 (ERP에서 넘긴 파일)</label><ul>${files}</ul>
<button type="submit">보내기</button></form></main></body></html>`;
}

const handler = async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/__health') return json(res, 200, { ok: true, calls: calls.length, fail: FAIL, hosts: HOSTS, port: PORT });
  if (url.pathname === '/__reset') { calls = []; seq = 0; drafts.clear(); try { fs.writeFileSync(LOG, ''); } catch (e) { /* */ } return json(res, 200, { ok: true }); }
  if (url.pathname === '/__calls') {
    const kind = url.searchParams.get('kind');
    return json(res, 200, kind ? calls.filter(c => c.kind === kind) : calls);
  }

  // ── AI 점검의견 (BotService.call) ──
  if (req.method === 'POST' && url.pathname === '/api/erp/completion') {
    const raw = await readBody(req);
    const problems = [];
    let body = {};
    try { body = JSON.parse(raw); } catch (e) { problems.push('본문이 JSON이 아님'); }
    if (!body.user_prompt) problems.push('빠진 필드: user_prompt');
    if (!body.task_type) problems.push('빠진 필드: task_type');
    if (!/json/i.test(req.headers['content-type'] || '')) problems.push('Content-Type이 JSON이 아님');
    const fail = FAIL.includes('bot');
    const content = problems.length || fail ? null : botAnswer(body.user_prompt);
    record({ kind: 'bot', taskType: body.task_type, prompt: body.user_prompt, content, problems, result: fail ? 'fail' : (problems.length ? 'rejected' : 'ok') });
    await new Promise(r => setTimeout(r, BOT_DELAY));   // "작성중" 가림을 볼 수 있게
    if (fail) return json(res, 200, { success: false, content: null, error: 'simulated failure' });
    if (problems.length) return json(res, 400, { success: false, content: null, error: problems.join('; ') });
    return json(res, 200, { success: true, content, error: null });
  }

  // ── 새 메일 시스템: 쓰기창 만들기 (AssetMailSend.openMailWrite) ──
  if (req.method === 'POST' && url.pathname === '/api/erp/mail-write') {
    const raw = await readBody(req);
    const problems = [];
    let body = {};
    try { body = JSON.parse(raw); } catch (e) { problems.push('본문이 JSON이 아님'); }
    if (req.headers['x-service-token'] !== MAIL_TOKEN) problems.push('X-Service-Token 불일치');
    for (const k of ['refKey', 'personId', 'fileKey', 'sso_token']) if (body[k] === undefined || body[k] === null || body[k] === '') problems.push('빠진 필드: ' + k);
    if (!Array.isArray(body.fileList)) problems.push('fileList가 배열이 아님');
    const fail = FAIL.includes('mail');
    const id = String(seq + 1);
    // open_url은 ERP가 부른 주소와 같은 호스트여야 한다(원본 검사) — 요청의 Host 헤더를 그대로 쓴다
    const openUrl = `http://${req.headers.host}/mail/write/${id}`;
    record({ kind: 'mail-write', refKey: body.refKey, personId: body.personId, header: body.header, fileKey: body.fileKey, fileList: body.fileList,
      ssoToken: body.sso_token ? String(body.sso_token).slice(0, 8) + '…' : null, openUrl: fail || problems.length ? null : openUrl,
      problems, result: fail ? 'fail' : (problems.length ? 'rejected' : 'ok') });
    if (fail) return json(res, 500, { message: '[assetMail] simulated failure' });
    if (problems.length) return json(res, problems.includes('X-Service-Token 불일치') ? 401 : 400, { message: problems.join('; ') });
    drafts.set(id, body);
    return json(res, 200, { open_url: openUrl });
  }

  // ── 메일 쓰기창(흉내) ──
  let m = /^\/mail\/write\/(\d+)$/.exec(url.pathname);
  if (req.method === 'GET' && m) {
    const d = drafts.get(m[1]);
    if (!d) return html(res, 404, '<p>쓰기창이 없습니다(시뮬레이터를 다시 켰으면 ERP에서 다시 여세요).</p>');
    return html(res, 200, mailWritePage(m[1], d));
  }
  m = /^\/mail\/write\/(\d+)\/send$/.exec(url.pathname);
  if (req.method === 'POST' && m) {
    const d = drafts.get(m[1]);
    const form = new URLSearchParams(await readBody(req));
    record({ kind: 'mail-send', draftId: m[1], refKey: d && d.refKey, to: form.get('to'), header: form.get('header'), problems: form.get('to') ? [] : ['받는 사람 없음'], result: 'ok' });
    return html(res, 200, `<!doctype html><meta charset="utf-8"><body style="font-family:sans-serif;padding:24px"><p class="sent" style="color:#0a7d22;font-weight:bold">보낸 것으로 기록했습니다(실제 발송 없음).</p><button onclick="window.close()">닫기</button></body>`);
  }

  json(res, 404, { error: 'not found', path: url.pathname });
};

for (const host of HOSTS) {
  http.createServer(handler).listen(PORT, host, () => console.log(`ext-simulator http://${host}:${PORT} (bot·assetMail) fail=${FAIL.join(',') || '-'}`));
}
