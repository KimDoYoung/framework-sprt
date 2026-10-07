// A01 Sys04_Tab_Role 화면 확인 (06 항목 6·7): 열기 → 조회 행 수·컬럼 → 등록·저장 → 체크 삭제. 시험 행은 지우고 끝낸다.
// 준비·사용은 tools/smoke-frame.js와 같다: NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/A01.js <스크린샷 폴더> [base] [회사]
// 이 메뉴(#1069)는 고객사 메뉴라 admin 회사(0)에는 없다 → admin 테넌트 로그인 화면에서 회사(기본 kfstest)를 골라 그 회사 관리자로 들어간다.
const { chromium } = require('playwright-core');
const [OUT, BASE = 'http://admin.localhost:8082/AssetERP_1/', COMPANY = 'kfstest'] = process.argv.slice(2);
const TEST_NM = 'ZZ_A01_화면시험';

(async () => {
  const b = await chromium.launch({
    executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',
    args: ['--host-resolver-rules=MAP *.localhost 127.0.0.1'],
  });
  const p = await b.newPage({ viewport: { width: 1400, height: 850 } });
  globalThis.page = p; globalThis.browser = b;
  const out = { errs: [], msgs: [] };
  p.on('pageerror', e => out.errs.push(e.message));
  p.on('console', m => { if (m.type() === 'warning') out.errs.push('warn: ' + m.text().slice(0, 150)); });
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('401')) out.errs.push(m.text().slice(0, 150)); });
  const msgs = async () => (await p.locator('.ant-message-notice').allInnerTexts()).join(' / ');
  // AG Grid는 고정 컬럼(행번호)과 본문에 같은 row-index의 .ag-row를 따로 그린다 → 본문 행만 센다
  const rowCount = () => p.evaluate(() => new Set([...document.querySelectorAll('.ag-row[row-index]:not(.ag-row-pinned)')].map(r => r.getAttribute('row-index'))).size);

  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.locator('.ant-select').first().click();
  await p.keyboard.type(COMPANY);
  await p.waitForTimeout(500);
  await p.keyboard.press('Enter');
  await p.fill('input[placeholder^="사번"]', 'admin');
  await p.fill('input[type=password]', '1111');
  await p.click('button[type=submit]');
  await p.waitForTimeout(2500);
  await p.getByText('관리자', { exact: true }).first().click();
  await p.waitForTimeout(800);
  await p.getByText('권한그룹 관리', { exact: true }).first().click();
  await p.waitForTimeout(2000);
  const tab = p; // 열린 화면 중 그리드는 이 화면 하나뿐(MyPage에는 AG Grid 없음)
  out.headers = await tab.locator('.ag-header-cell-text').allInnerTexts();
  out.rows = await rowCount();
  await p.screenshot({ path: OUT + '/A01-1-retrieve.png' });

  // [E3] 등록 → 권한명 입력 → [E2] 저장
  await tab.getByRole('button', { name: '등록' }).click();
  await p.waitForTimeout(500);
  await p.keyboard.type(TEST_NM);
  await p.keyboard.press('Enter');
  await p.waitForTimeout(300);
  await tab.getByRole('button', { name: '저장' }).click();
  await p.waitForTimeout(1500);
  out.msgs.push('저장: ' + await msgs());
  out.rowsAfterSave = await rowCount();
  await p.screenshot({ path: OUT + '/A01-2-saved.png' });

  // [E4] 삭제 → [E5] 예
  const row = tab.locator('.ag-row', { hasText: TEST_NM }).first();
  const idx = await row.getAttribute('row-index');
  await tab.locator(`.ag-row[row-index="${idx}"] .ag-checkbox-input`).first().check();
  await tab.getByRole('button', { name: '삭제' }).click();
  await p.waitForTimeout(500);
  out.confirm = await p.locator('.ant-modal-confirm-content').innerText().catch(() => '');
  await p.getByRole('button', { name: '예' }).click();
  await p.waitForTimeout(1500);
  out.msgs.push('삭제: ' + await msgs());
  out.rowsAfterDelete = await rowCount();
  await p.screenshot({ path: OUT + '/A01-3-deleted.png' });

  console.log(JSON.stringify(out, null, 1));
  await b.close();
})().catch(async e => { console.error(e.message); process.exitCode = 1; })
  .finally(() => cleanup().catch(e => console.error('cleanup 실패: ' + e.message)));

// 실패해도 시험 행이 남지 않게: 같은 회사 관리자로 API 로그인 → 시험 행 조회·삭제 (06 원칙: 확인 작업은 데이터를 남기지 않는다)
async function cleanup() {
  await globalThis.page?.screenshot({ path: OUT + '/A01-9-last.png' }).catch(() => {});
  // node fetch는 *.localhost를 풀지 못할 수 있어 localhost + Host 헤더로 부른다
  const u = new URL('api/', BASE); const host = u.host; u.hostname = 'localhost'; const api = u.href;
  const login = await fetch(api + 'auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', host },
    body: JSON.stringify({ username: 'admin', password: '1111', companyCode: COMPANY }) });
  const cookie = (login.headers.getSetCookie?.() ?? []).map(c => c.split(';')[0]).join('; ');
  const h = { cookie, host, 'Content-Type': 'application/json' };
  const rows = (await (await fetch(api + 'v1/sys/roles?roleNm=' + encodeURIComponent(TEST_NM), { headers: h })).json()).data ?? [];
  if (rows.length) await fetch(api + 'v1/sys/roles', { method: 'DELETE', headers: h, body: JSON.stringify(rows.map(r => r.roleId)) });
  await fetch(api + 'auth/logout', { method: 'POST', headers: h });
  console.log('cleanup: 남은 시험 행 ' + rows.length + '개 삭제');
  await globalThis.browser?.close().catch(() => {});
}
