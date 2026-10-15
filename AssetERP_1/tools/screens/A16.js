// A16 고객별 서버사용량(Sys10_Tab_TotalSize + Sys10_TabPage_Detail) 화면 확인.
// 조회만 있는 화면이라 데이터를 바꾸지 않는다. admin 회사 메뉴라 admin 테넌트 admin으로 확인한다.
// 지금 DB의 파일 경로가 원본 가정(`/data1/IDMS/docs/{고객}/{yyyyMM}`)과 달라 조회가 0건이므로 빈 상태만 본다 — 데이터가 있을 때의 SQL·매핑은 SysFileTotalDbTest.
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더의 상위 node_modules> node tools/screens/A16.js <스크린샷 폴더>'"
const { BASE, launch, checkGrid } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('관리자', { exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByText('고객별 서버사용량', { exact: true }).first().click(); await p.waitForTimeout(2500);

    const left = p.locator('.ant-splitter-panel').first(), right = p.locator('.ant-splitter-panel').nth(1);
    out.panelCount = await p.locator('.ant-splitter-panel').count();
    out.leftButtons = await left.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.useYnLabel = await left.locator('.ant-checkbox-wrapper').allInnerTexts();
    out.useYnChecked = await left.locator('.ant-checkbox-wrapper input').first().isChecked();
    out.leftHeaders = await left.locator('.ag-header-cell-text').allInnerTexts();
    out.rows = await countRows(left);
    out.rightGridCount = await right.locator('.ag-root-wrapper').count();
    out.rightHeaders = await right.locator('.ag-header-cell-text').allInnerTexts();
    out.yearRows = await countRows(right.locator('.ag-root-wrapper').first());
    out.monthRows = await countRows(right.locator('.ag-root-wrapper').nth(1));
    out.leftGrid = await checkGrid(p, left);
    // 사용고객만 보기 해제 → 조회, 다시 체크 → 조회 (오류 없이)
    await left.locator('.ant-checkbox-wrapper').click(); await left.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1200);
    out.rowsAllCustomers = await countRows(left);
    await left.locator('.ant-checkbox-wrapper').click(); await left.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1200);
    out.msgs = await p.locator('.ant-message-notice').allInnerTexts();
    await p.screenshot({ path: `${OUT}/A16-1-main.png` });
  } catch (e) {
    out.fail = String(e).slice(0, 400);
    await p.screenshot({ path: `${OUT}/A16-fail.png` }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
