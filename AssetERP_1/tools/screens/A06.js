// A06 권한그룹별 메뉴 맵핑(Sys07_Tab_RoleMenu + Sys07_Tree_RoleMenu) 화면 확인. 저장은 누르지 않는다(데이터 그대로).
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/A06.js <스크린샷 폴더> [회사] [권한명]'"
// 고객사 메뉴라 admin 테넌트 로그인 화면에서 회사(기본 kfstest)를 골라 그 회사 관리자로 들어간다(A01과 같음).
const { chromium } = require('playwright-core');
const [OUT, COMPANY = 'kfstest', ROLE = '일반 사용자'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--host-resolver-rules=MAP *.localhost 127.0.0.1'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  const out = { errs: [] };
  p.on('pageerror', e => out.errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('401')) out.errs.push(m.text().slice(0, 150)); });
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const selected = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row-selected[row-index]')].map(r => r.getAttribute('row-index'))).size);
  try {
    await p.goto('http://admin.localhost:8082/AssetERP_1/', { waitUntil: 'networkidle' });
    await p.locator('.ant-select').first().click(); await p.keyboard.type(COMPANY); await p.waitForTimeout(500); await p.keyboard.press('Enter');
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('관리자', { exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByText('권한그룹별 메뉴 맵핑', { exact: true }).first().click(); await p.waitForTimeout(2000);
    const left = p.locator('.ant-splitter-panel').first(), right = p.locator('.ant-splitter-panel').last();
    out.leftButtons = await left.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.leftHeaders = await left.locator('.ag-header-cell-text').allInnerTexts();
    out.roles = await countRows(left);
    out.rightButtons = await right.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.rightHeaders = await right.locator('.ag-header-cell-text').allInnerTexts();
    await left.locator('.ag-row', { hasText: ROLE }).first().locator('.ag-cell[col-id="roleNm"]').click(); await p.waitForTimeout(2000);
    out.treeTop = await countRows(right);
    await right.getByRole('button', { name: '펼치기' }).click(); await p.waitForTimeout(800);
    out.treeExpandedRendered = await countRows(right);
    await right.getByRole('button', { name: '감추기' }).click(); await p.waitForTimeout(500);
    out.treeCollapsed = await countRows(right);
    // 펼침 단추 두 번 → 펼쳤다가 다시 접힘
    await right.locator('.ag-row[row-index="0"] [data-tree-toggle]').click(); await p.waitForTimeout(500);
    out.toggleOpen = await countRows(right);
    await right.locator('.ag-row[row-index="0"] [data-tree-toggle]').click(); await p.waitForTimeout(500);
    out.toggleClosed = await countRows(right);
    // [E1] 매뉴명 검색 Enter → 찾은 행 선택 + 조상 펼침
    await right.locator('input').first().fill('결재'); await right.locator('input').first().press('Enter'); await p.waitForTimeout(800);
    out.searchVisible = await countRows(right); out.searchSelected = await selected(right);
    await right.locator('input').first().fill(''); await right.locator('input').first().press('Enter'); await p.waitForTimeout(500);
    // 첫 루트의 권한 칸 클릭 → 루트와 자손이 같은 값으로 (저장하지 않음)
    const first = right.locator('.ag-row[row-index="0"]');
    out.rootBefore = await first.locator('.ag-cell[col-id="useYn"] input').isChecked();
    await first.locator('.ag-cell[col-id="useYn"]').click(); await p.waitForTimeout(600);
    out.rootAfter = await first.locator('.ag-cell[col-id="useYn"] input').isChecked();
    out.childAfter = await right.locator('.ag-row[row-index="1"] .ag-cell[col-id="useYn"] input').isChecked();
    await p.screenshot({ path: OUT + '/A06.png' });
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/A06-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
