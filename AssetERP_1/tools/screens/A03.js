// A03 권한그룹별 사용자 맵핑(Sys05_Tab_UserRole + Sys05_Page_UserRole) 화면 확인. 저장·삭제는 서버로 보내지 않는다(데이터 그대로).
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/A03.js <스크린샷 폴더> [회사] [권한명]'"
// 고객사 메뉴라 admin 테넌트 로그인 화면에서 회사(기본 kfstest)를 골라 그 회사 관리자로 들어간다(A01과 같음).
const { chromium } = require('playwright-core');
const [OUT, COMPANY = 'kfstest', ROLE = '경영 관리자'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--host-resolver-rules=MAP *.localhost 127.0.0.1'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  const out = { errs: [], msgs: [] };
  p.on('pageerror', e => out.errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('401')) out.errs.push(m.text().slice(0, 150)); });
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const lastMsg = async () => { await p.waitForTimeout(400); out.msgs.push(await p.locator('.ant-message-notice').last().innerText().catch(() => '')); };
  try {
    await p.goto('http://admin.localhost:8082/AssetERP_1/', { waitUntil: 'networkidle' });
    await p.locator('.ant-select').first().click(); await p.keyboard.type(COMPANY); await p.waitForTimeout(500); await p.keyboard.press('Enter');
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('관리자', { exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByText('권한그룹별 사용자 맵핑', { exact: true }).first().click(); await p.waitForTimeout(2500);
    const left = p.locator('.ant-splitter-panel').first(), right = p.locator('.ant-splitter-panel').last();
    out.leftButtons = await left.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.leftHeaders = await left.locator('.ag-header-cell-text').allInnerTexts();
    out.roles = await countRows(left);
    out.firstSelected = await left.locator('.ag-row-selected .ag-cell[col-id="roleNm"]').first().innerText().catch(() => '');
    out.rightButtons = await right.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.rightHeaders = await right.locator('.ag-header-cell-text').allInnerTexts();
    out.firstRoleUsers = await countRows(right);
    await left.locator('.ag-row', { hasText: ROLE }).first().locator('.ag-cell[col-id="roleNm"]').click(); await p.waitForTimeout(1500);
    out.roleUsers = await countRows(right);
    // [E2] 등록 → 사원찾기: 미선택 확인 → 문구, 첫 사원 체크 → 확인 → 행 추가
    await right.getByRole('button', { name: '등록' }).click(); await p.waitForTimeout(1500);
    const pick = p.locator('.ant-modal', { hasText: '사원찾기' });
    out.pickHeaders = await pick.locator('.ag-header-cell-text').allInnerTexts();
    out.pickRows = await countRows(pick);
    await pick.getByRole('button', { name: '확인' }).click(); await lastMsg();
    await pick.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').first().click();
    await pick.getByRole('button', { name: '확인' }).click(); await p.waitForTimeout(800);
    out.afterAdd = await countRows(right);
    // [E5] 권한조직 아이콘 → 조직찾기(기준일 편집 가능)
    await right.locator('.ag-cell[col-id="parentFullNm"] button').first().click(); await p.waitForTimeout(1200);
    const org = p.locator('.ant-modal', { hasText: '조직찾기' });
    out.orgDateEnabled = await org.locator('.ant-picker').evaluate(el => !el.classList.contains('ant-picker-disabled'));
    out.orgRows = await countRows(org);
    await org.getByRole('button', { name: '닫기' }).click(); await p.waitForTimeout(300);
    // 조회로 임시 행 버리기(저장하지 않음)
    await right.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1000);
    out.afterRetrieve = await countRows(right);
    await p.screenshot({ path: OUT + '/A03.png' });
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/A03-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
