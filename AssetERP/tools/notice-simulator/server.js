#!/usr/bin/env node
/**
 * 알림 발송 시뮬레이터 (AA01) — AS-IS가 부르는 외부 알림 서비스 3종을 흉내 낸다. 의존성 없음(Node 내장 모듈).
 *   앱알림(Talk)  POST /talk/api/sendmsg            AS-IS SendTalkAPI    (헤더 x-api-key, JSON {email,title,body,fromEmail} → {ok,roomId|error})
 *   SMS(DirectSend) POST /index.php/api_v2/sms_change_word   AS-IS SendSMSAPI     (JSON {title,message,sender,username,receiver[],key,type} → {status:"0",msg})
 *   메일(SMTP)    NOTICE_SIM_SMTP_PORT              AS-IS SendMailMaster (JavaMail, From/To/Subject/text-html 본문)
 * 받은 호출은 /__calls 와 calls.jsonl 에 남는다. 실제로는 아무 데도 보내지 않는다.
 */
const http = require('http');
const net = require('net');
const fs = require('fs');
const path = require('path');

// 쉼표로 여러 주소: ERP가 Docker 안이면 호스트 게이트웨이(예 172.18.0.1)도 함께 연다
const HOSTS = (process.env.NOTICE_SIM_HOST || '127.0.0.1').split(',').map(s => s.trim()).filter(Boolean);
const PORT = Number(process.env.NOTICE_SIM_PORT || 5161);
const SMTP_PORT = Number(process.env.NOTICE_SIM_SMTP_PORT || 2525);
const FAIL = (process.env.NOTICE_SIM_FAIL || '').split(',').map(s => s.trim()).filter(Boolean);   // talk,sms,mail
const TALK_KEY = process.env.NOTICE_SIM_TALK_KEY || 'sim-talk-key';
const LOG = path.join(__dirname, 'calls.jsonl');

let calls = [];
let seq = 0;

function record(call) {
  call.id = ++seq;
  call.time = new Date().toISOString();
  calls.push(call);
  try { fs.appendFileSync(LOG, JSON.stringify(call) + '\n'); } catch (e) { /* 기록 실패는 무시 */ }
  console.log(`[${call.kind}] #${call.id} ${call.to || ''} ${call.problems.length ? '문제: ' + call.problems.join(' / ') : ''}`);
  return call;
}

function json(res, status, body) {
  const s = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json;charset=utf-8', 'Content-Length': Buffer.byteLength(s) });
  res.end(s);
}

function readBody(req) {
  return new Promise(resolve => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

const missing = (obj, keys) => keys.filter(k => obj[k] === undefined || obj[k] === null || obj[k] === '');

const handler = async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/__health') return json(res, 200, { ok: true, calls: calls.length, fail: FAIL, smtpPort: SMTP_PORT, hosts: HOSTS });
  if (url.pathname === '/__reset') { calls = []; seq = 0; try { fs.writeFileSync(LOG, ''); } catch (e) { /* */ } return json(res, 200, { ok: true }); }
  if (url.pathname === '/__calls') {
    const kind = url.searchParams.get('kind');
    return json(res, 200, kind ? calls.filter(c => c.kind === kind) : calls);
  }

  // ── 앱알림 (SendTalkAPI.sendTalkStep) ──
  if (req.method === 'POST' && url.pathname === '/talk/api/sendmsg') {
    const raw = await readBody(req);
    const problems = [];
    let body = {};
    try { body = JSON.parse(raw); } catch (e) { problems.push('본문이 JSON이 아님'); }
    if (req.headers['x-api-key'] !== TALK_KEY) problems.push('x-api-key 불일치');
    const miss = missing(body, ['email', 'title', 'body', 'fromEmail']);
    if (miss.length) problems.push('빠진 필드: ' + miss.join(','));
    const fail = FAIL.includes('talk');
    record({ kind: 'talk', to: body.email, title: body.title, body: body.body, from: body.fromEmail, problems, result: fail ? 'fail' : (problems.length ? 'rejected' : 'ok') });
    if (fail) return json(res, 500, { ok: false, error: 'simulated failure' });
    if (problems.length) return json(res, 400, { ok: false, error: problems.join('; ') });
    return json(res, 200, { ok: true, roomId: 'sim-room-' + seq });
  }

  // ── SMS (SendSMSAPI.smsSender: DirectSend sms_change_word) ──
  if (req.method === 'POST' && url.pathname === '/index.php/api_v2/sms_change_word') {
    const raw = await readBody(req);
    const problems = [];
    let body = {};
    try { body = JSON.parse(raw); } catch (e) { problems.push('본문이 JSON이 아님'); }
    const miss = missing(body, ['title', 'message', 'sender', 'username', 'key']);
    if (miss.length) problems.push('빠진 필드: ' + miss.join(','));
    const receivers = Array.isArray(body.receiver) ? body.receiver : [];
    if (receivers.length === 0) problems.push('receiver가 비어 있음');
    const bad = receivers.filter(r => !/^\d{9,11}$/.test(String(r.mobile || '')));
    if (bad.length) problems.push('번호 형식 오류(하이픈 제거 후 숫자 9~11자리): ' + bad.map(r => r.mobile).join(','));
    if (body.message && Buffer.byteLength(body.message, 'utf8') > 2000) problems.push('message 2000byte 초과');
    const fail = FAIL.includes('sms');
    record({ kind: 'sms', to: receivers.map(r => r.mobile).join(','), title: body.title, body: body.message, from: body.sender, problems, result: fail ? 'fail' : (problems.length ? 'rejected' : 'ok') });
    if (fail) return json(res, 200, { status: '101', msg: 'simulated failure' });
    if (problems.length) return json(res, 200, { status: '100', msg: problems.join('; ') });
    return json(res, 200, { status: '0', msg: 'success', success_cnt: receivers.length, fail_cnt: 0 });
  }

  json(res, 404, { error: 'not found', path: url.pathname });
};

// ── 메일: 받기만 하는 SMTP ──
// RFC 2047: 인접한 encoded-word 사이의 공백은 버리고, 같은 문자셋 바이트는 이어서 해석한다(멀티바이트가 단어 경계에 걸릴 수 있다)
const decodeWord = s => {
  const str = String(s || '').replace(/(\?=)\s+(?==\?)/g, '$1');
  return str.replace(/((?:=\?[^?]+\?[bBqQ]\?[^?]*\?=)+)/g, group => {
    const bytes = [];
    group.replace(/=\?([^?]+)\?([bBqQ])\?([^?]*)\?=/g, (m, cs, enc, txt) => {
      if (enc.toUpperCase() === 'B') bytes.push(...Buffer.from(txt, 'base64'));
      else {
        const t = txt.replace(/_/g, ' ');
        for (let i = 0; i < t.length; i++) {
          if (t[i] === '=' && /^[0-9A-Fa-f]{2}$/.test(t.substr(i + 1, 2))) { bytes.push(parseInt(t.substr(i + 1, 2), 16)); i += 2; }
          else bytes.push(t.charCodeAt(i));
        }
      }
      return m;
    });
    return Buffer.from(bytes).toString('utf8');
  });
};

function decodeBody(text, enc) {
  enc = (enc || '').toLowerCase();
  if (enc === 'base64') return Buffer.from(text.replace(/\s+/g, ''), 'base64').toString('utf8');
  if (enc === 'quoted-printable') {
    const bytes = [];
    const t = text.replace(/=\r?\n/g, '');
    for (let i = 0; i < t.length; i++) {
      if (t[i] === '=' && /^[0-9A-Fa-f]{2}$/.test(t.substr(i + 1, 2))) { bytes.push(parseInt(t.substr(i + 1, 2), 16)); i += 2; }
      else bytes.push(...Buffer.from(t[i], 'utf8'));
    }
    return Buffer.from(bytes).toString('utf8');
  }
  return text;
}

function parseHeaders(block) {
  const h = {};
  block.replace(/\r?\n[ \t]+/g, ' ').split(/\r?\n/).forEach(line => {
    const i = line.indexOf(':');
    if (i > 0) h[line.slice(0, i).toLowerCase()] = line.slice(i + 1).trim();
  });
  return h;
}

function parseMail(data) {
  const split = data.search(/\r?\n\r?\n/);
  const headers = parseHeaders(split < 0 ? data : data.slice(0, split));
  let body = split < 0 ? '' : data.slice(split).replace(/^\r?\n\r?\n/, '');
  const ct = headers['content-type'] || '';
  const m = ct.match(/boundary="?([^";]+)"?/i);
  if (m) {
    const parts = body.split('--' + m[1]).slice(1).filter(p => !p.startsWith('--'));
    const texts = parts.map(p => {
      const s2 = p.search(/\r?\n\r?\n/);
      const ph = parseHeaders(p.slice(0, s2).replace(/^\r?\n/, ''));
      return { type: ph['content-type'] || '', text: decodeBody(p.slice(s2).replace(/^\r?\n\r?\n/, '').replace(/\r?\n$/, ''), ph['content-transfer-encoding']) };
    });
    body = texts.map(t => t.text).join('\n');
  } else {
    body = decodeBody(body, headers['content-transfer-encoding']);
  }
  return { headers, body };
}

const smtpHandler = sock => {
  let buf = '';
  let inData = false;
  let authStep = null;
  const env = { from: '', to: [] };
  const send = s => sock.write(s + '\r\n');
  send('220 notice-simulator ESMTP');
  sock.on('data', chunk => {
    buf += chunk.toString('latin1');
    for (;;) {
      if (inData) {
        const end = buf.indexOf('\r\n.\r\n');
        if (end < 0) return;
        const raw = Buffer.from(buf.slice(0, end), 'latin1').toString('utf8').replace(/\r\n\.\./g, '\r\n.');
        buf = buf.slice(end + 5);
        inData = false;
        const { headers, body } = parseMail(raw);
        const problems = [];
        if (!headers.from) problems.push('From 헤더 없음');
        if (env.to.length === 0) problems.push('수신자 없음');
        const fail = FAIL.includes('mail');
        record({ kind: 'mail', to: env.to.join(','), from: decodeWord(headers.from), title: decodeWord(headers.subject), body, contentType: headers['content-type'], envelopeFrom: env.from, problems, result: fail ? 'fail' : (problems.length ? 'rejected' : 'ok') });
        if (fail) send('554 simulated failure'); else send('250 OK queued');
        env.from = ''; env.to = [];
        continue;
      }
      const nl = buf.indexOf('\r\n');
      if (nl < 0) return;
      const line = buf.slice(0, nl);
      buf = buf.slice(nl + 2);
      if (authStep === 'user') { authStep = 'pass'; send('334 UGFzc3dvcmQ6'); continue; }
      if (authStep === 'pass') { authStep = null; send('235 Authentication successful'); continue; }
      const cmd = line.toUpperCase();
      if (cmd.startsWith('EHLO')) { sock.write('250-notice-simulator\r\n250-AUTH LOGIN PLAIN\r\n250 8BITMIME\r\n'); }
      else if (cmd.startsWith('HELO')) send('250 notice-simulator');
      else if (cmd.startsWith('AUTH PLAIN')) send('235 Authentication successful');
      else if (cmd.startsWith('AUTH LOGIN')) { authStep = 'user'; send('334 VXNlcm5hbWU6'); }
      else if (cmd.startsWith('MAIL FROM')) { env.from = (line.match(/<([^>]*)>/) || [])[1] || ''; send('250 OK'); }
      else if (cmd.startsWith('RCPT TO')) { env.to.push((line.match(/<([^>]*)>/) || [])[1] || ''); send('250 OK'); }
      else if (cmd === 'DATA') { inData = true; send('354 End data with <CR><LF>.<CR><LF>'); }
      else if (cmd === 'RSET') { env.from = ''; env.to = []; send('250 OK'); }
      else if (cmd === 'NOOP') send('250 OK');
      else if (cmd === 'QUIT') { send('221 Bye'); sock.end(); return; }
      else send('502 command not implemented');
    }
  });
  sock.on('error', () => { /* 끊김은 무시 */ });
};

HOSTS.forEach(host => {
  http.createServer(handler).listen(PORT, host);
  net.createServer(smtpHandler).listen(SMTP_PORT, host);
});
console.log(`알림 시뮬레이터 http://${HOSTS.join(',')}:${PORT} (talk·sms), smtp :${SMTP_PORT}${FAIL.length ? ', 실패 주입: ' + FAIL.join(',') : ''}`);
