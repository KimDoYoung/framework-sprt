// A02 권한그룹 관리(고객사별, Sys04_Tab_RoleAdmin) 화면 확인. admin 회사 메뉴라 admin 회사 admin으로 로그인한다(A10과 같음).
// 열기 → 고객 조회·첫 행 자동 선택 → 고객(COMPANY) 행 클릭 → 권한 행 수 → 조회(선택 유지) → 미선택 삭제 경고 → 등록·저장 → 체크 삭제(확인 문구) → 그리드 기본 점검 → 조회로 버림.
// 시험 행은 실패해도 cleanup이 지운다.
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/A02.js <스크린샷 폴더> [회사 서브도메인]'"
const { BASE, launch, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'kfstest'] = process.argv.slice(2);
const TEST_NM = 'ZZ_A02_화면시험';

(async () => {
  const { b, p, errs } = await launch();
  globalThis.page = p;
  const out = { errs, msgs: [] };
  const msgs = async () => (await p.locator('.ant-message-notice').allInnerTexts()).join(' / ');
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('기초자료', { exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByText('권한그룹 관리', { exact: true }).first().click(); await p.waitForTimeout(2500);
    const left = p.locator('.ant-splitter-panel').first(), right = p.locator('.ant-splitter-panel').last();
    out.buttons = await p.locator('.flexlayout__tab button').filter({ hasText: /\S/ }).allInnerTexts();
    out.leftHeaders = await left.locator('.ag-header-cell-text').allInnerTexts();
    out.rightHeaders = await right.locator('.ag-header-cell-text').allInnerTexts();
    out.companies = await countRows(left);
    out.firstSelected = await left.locator('.ag-row[row-index="0"].ag-row-selected').count() > 0;
    out.rolesFirst = await countRows(right);
    await p.screenshot({ path: OUT + '/A02-1-open.png' });

    // [E2] 고객 행 클릭 → 그 고객사 권한
    await left.locator('.ag-row', { hasText: COMPANY }).first().locator('.ag-cell[col-id="companyNm"]').click(); await p.waitForTimeout(1500);
    out.roles = await countRows(right);
    out.roleCompany = await right.locator('.ag-row[row-index="0"] .ag-cell[col-id="companyNm"]').innerText().catch(() => '');

    // 조회 → 선택한 고객사를 다시 선택해 그 권한 조회 (사용자 결정 2026-10-12)
    await p.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1500);
    out.reselected = await left.locator('.ag-row.ag-row-selected .ag-cell[col-id="locNm"]').innerText().catch(() => '');
    out.rolesAfterRetrieve = await countRows(right);

    // [E6] 체크 없이 삭제 → 경고
    await p.getByRole('button', { name: '삭제' }).click(); await p.waitForTimeout(500);
    out.msgs.push('미선택 삭제: ' + await msgs());
    await p.waitForTimeout(2500);

    // [E5] 등록 → 권한명 입력 → [E4] 저장
    await p.getByRole('button', { name: '등록' }).click(); await p.waitForTimeout(500);
    out.newRowCompany = await right.locator('.ag-row', { has: p.locator('.ag-cell-inline-editing') }).first().locator('.ag-cell[col-id="companyNm"]').innerText().catch(() => '');
    await p.keyboard.type(TEST_NM); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
    await p.getByRole('button', { name: '저장' }).click(); await p.waitForTimeout(1500);
    out.msgs.push('저장: ' + await msgs());
    out.rolesAfterSave = await countRows(right);
    const saved = right.locator('.ag-row', { hasText: TEST_NM }).first();
    out.savedCompany = await saved.locator('.ag-cell[col-id="companyNm"]').innerText().catch(() => '');
    await p.screenshot({ path: OUT + '/A02-2-saved.png' });
    await p.waitForTimeout(2500);

    // [E6]→[E7] 체크 → 삭제 → 확인 예
    const idx = await saved.getAttribute('row-index');
    await right.locator(`.ag-row[row-index="${idx}"] .ag-selection-checkbox input`).first().click({ force: true });
    await p.getByRole('button', { name: '삭제' }).click(); await p.waitForTimeout(500);
    out.confirm = await p.locator('.ant-modal-confirm-content').innerText().catch(() => '');
    await p.getByRole('button', { name: '예' }).click(); await p.waitForTimeout(1500);
    out.msgs.push('삭제: ' + await msgs());
    out.rolesAfterDelete = await countRows(right);

    // 그리드 기본 점검 (06 항목 7-1) → 조회로 버림
    out.gridLeft = await checkGrid(p, left);
    out.gridRight = await checkGrid(p, right);
    out.gridOk = gridOk(out.gridLeft) && gridOk(out.gridRight);
    await p.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1500);
    await p.screenshot({ path: OUT + '/A02-3-done.png' });
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/A02-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})().finally(() => cleanup().catch(e => console.error('cleanup 실패: ' + e.message)));

// 시험 행이 남았으면 지운다 (admin 로그인 → 고객사 권한 조회 → TEST_NM 행 DELETE)
async function cleanup() {
  const u = new URL('api/', BASE); const host = u.host; u.hostname = 'localhost'; const api = u.href;
  const login = await fetch(api + 'auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', host },
    body: JSON.stringify({ username: 'admin', password: '1111', companyCode: 'admin' }) });
  const cookie = (login.headers.getSetCookie?.() ?? []).map(c => c.split(';')[0]).join('; ');
  const token = (await login.json())?.data?.accessToken;
  const headers = { 'Content-Type': 'application/json', host, cookie, ...(token ? { Authorization: 'Bearer ' + token } : {}) };
  const companies = (await (await fetch(api + 'v1/sys/companies?useYn=true', { headers })).json()).data ?? [];
  const c = companies.find(x => x.locNm === COMPANY);
  if (!c) return;
  const roles = (await (await fetch(api + `v1/sys/companies/${c.companyId}/roles`, { headers })).json()).data ?? [];
  const ids = roles.filter(r => r.roleNm === TEST_NM).map(r => r.roleId);
  if (ids.length) {
    await fetch(api + `v1/sys/companies/${c.companyId}/roles`, { method: 'DELETE', headers, body: JSON.stringify(ids) });
    console.error('cleanup: 시험 행 ' + ids.length + '건 삭제');
  }
  await fetch(api + 'auth/logout', { method: 'POST', headers });
}
