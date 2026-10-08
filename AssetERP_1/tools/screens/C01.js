// C01 사원정보 관리(Emp00_Tab_TransInfo) 1단계 화면 확인. 저장·등록·삭제는 서버로 보내지 않는다(데이터 그대로).
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/C01.js <스크린샷 폴더> [회사]'"
// 회사 메뉴(경영관리 > 01. 조직 및 사원관리 > 사원정보 관리)라 admin 테넌트에서 회사(기본 kfstest)를 골라 그 회사 관리자로 들어간다.
const { chromium } = require('playwright-core');
const [OUT, COMPANY = 'kfstest'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--host-resolver-rules=MAP *.localhost 127.0.0.1'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const out = { errs: [], msgs: [] };
  p.on('pageerror', e => out.errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('401')) out.errs.push(m.text().slice(0, 150)); });
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const lastMsg = async () => { await p.waitForTimeout(400); const t = await p.locator('.ant-message-notice').last().innerText().catch(() => ''); out.msgs.push(t); };
  try {
    await p.goto('http://admin.localhost:8082/AssetERP_1/', { waitUntil: 'networkidle' });
    await p.locator('.ant-select').first().click(); await p.keyboard.type(COMPANY); await p.waitForTimeout(500); await p.keyboard.press('Enter');
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('경영관리', { exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByText('사원정보 관리', { exact: true }).first().click(); await p.waitForTimeout(2500);
    const top = p.locator('.ant-splitter-panel').first(), bottom = p.locator('.ant-splitter-panel').last();
    await p.screenshot({ path: OUT + '/C01-open.png' });
    out.topButtons = await top.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.headers = await top.locator('.ag-header-cell-text').allInnerTexts();
    out.rowsWork = await countRows(top);
    out.tabs = await bottom.locator('.ant-tabs-tab').allInnerTexts();
    out.selectedName = await top.locator('.ag-row-selected .ag-cell[col-id="korNm"]').first().innerText().catch(() => '');
    out.personEmpNo = await bottom.locator('input').first().inputValue();
    out.personButtons = await bottom.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    // 재직구분 → 전체
    await top.locator('.ant-select').first().click(); await p.locator('.ant-select-item', { hasText: '전체' }).click(); await p.waitForTimeout(1500);
    out.rowsAll = await countRows(top);
    // 일반발령 탭
    await bottom.locator('.ant-tabs-tab', { hasText: '일반발령' }).click(); await p.waitForTimeout(1500);
    out.transButtons = await bottom.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.transHeaders = await bottom.locator('.ag-header-cell-text').allInnerTexts();
    out.transRows = await countRows(bottom);
    // 등록(임시 행) → 발령조직이 채워짐 → 그 행 삭제(서버 호출 없음: 임시 행)
    await bottom.getByRole('button', { name: '등록' }).click(); await p.waitForTimeout(1200);
    await p.keyboard.press('Escape');
    out.transRowsAfterInsert = await countRows(bottom);
    out.newRowOrg = await bottom.locator('.ag-row[row-index] .ag-cell[col-id="orgNm"]').allInnerTexts();
    // 발령조직 아이콘 → 조직찾기(기준일 고정) → 첫 조직 확인
    await bottom.locator('.ag-cell[col-id="orgNm"] button').first().click(); await p.waitForTimeout(1200);
    const lookup = p.locator('.ant-modal', { hasText: '조직찾기' });
    out.lookupHeaders = await lookup.locator('.ag-header-cell-text').allInnerTexts();
    out.lookupRows = await countRows(lookup);
    await lookup.getByRole('button', { name: '확인' }).click(); await lastMsg(); // 미선택 → "조직을 선택해주세요"
    await lookup.getByRole('button', { name: '닫기' }).click(); await p.waitForTimeout(400);
    // 조회로 임시 행 버리기
    await bottom.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1000);
    out.transRowsAfterRetrieve = await countRows(bottom);
    // 신규사원 등록 팝업: 빈 채로 저장 → 첫 필수 문구, 조직 클릭(입사일 없음) → 문구
    await top.getByRole('button', { name: '등록' }).click(); await p.waitForTimeout(800);
    const edit = p.locator('.ant-modal', { hasText: '신규사원 등록' });
    out.editLabels = (await edit.locator('.ant-typography').allInnerTexts()).filter(Boolean);
    await edit.getByRole('button', { name: '저장' }).click(); await lastMsg();
    await edit.locator('.ant-input-affix-wrapper input').click(); await lastMsg();
    await p.screenshot({ path: OUT + '/C01-edit.png' });
    await edit.getByRole('button', { name: '닫기' }).click(); await p.waitForTimeout(400);
    await p.screenshot({ path: OUT + '/C01.png' });
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/C01-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
