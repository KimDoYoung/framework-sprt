// A35 고객별 매뉴사용기록(Sys96_Tab_OpenMenuLogAdmin + Sys06_Lookup_SelectMulti) 화면 확인. 조회만 있는 화면이라 데이터를 바꾸지 않는다.
// admin 회사 메뉴라 admin 테넌트 admin으로 확인한다.
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더의 상위 node_modules> node tools/screens/A35.js <스크린샷 폴더>'"
const { BASE, launch, checkGrid, gridOk } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const pagingText = async scr => scr.getByText(/^전체\s*[\d,]+\s*중/).first().innerText({ timeout: 1500 }).catch(async () => (await scr.locator('.ant-pagination, .paging-toolbar').allInnerTexts().catch(() => [])).join('|') || 'none');
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('관리자', { exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByText('고객별 매뉴사용기록', { exact: true }).first().click(); await p.waitForTimeout(3000);

    const scr = p.locator('.flexlayout__tab').filter({ hasText: '실사용 건만 조회' }).first();
    out.labels = await scr.locator('.ant-typography').allInnerTexts();
    out.buttons = await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.headers = await scr.locator('.ag-header-cell-text').allInnerTexts();
    out.menuInput = await scr.locator('input.ant-input[readonly]').first().inputValue();
    // [E0] 열림 → 조회 (1페이지 100건)
    out.rows = await countRows(scr);
    out.paging = await pagingText(scr);
    out.firstRow = await scr.locator('.ag-row[row-index="0"] .ag-cell').allInnerTexts();
    out.secondColor = await scr.locator('.ag-row[row-index="0"] .ag-cell[col-id="second"] b').evaluate(el => el.style.color).catch(() => null);
    await p.screenshot({ path: OUT + '/A35-1-main.png' });

    // 페이징 툴바가 화면 안에 보이는지(잘리지 않는지) + 다음·마지막·이전 페이지 이동
    const bar = scr.getByText(/^전체\s*[\d,]+\s*중/).first();
    const box = await bar.boundingBox(); const tab = await scr.boundingBox();
    out.barInside = !!box && !!tab && box.y + box.height <= tab.y + tab.height + 1;
    const firstCell = async () => (await scr.locator('.ag-row[row-index="0"] .ag-cell[col-id="dateStr"]').innerText().catch(() => null));
    const p1 = await firstCell();
    // 버튼을 누른 뒤 페이징 문구가 바뀔 때까지 기다린다(최대 6초)
    const go = async sel => {
      const before = await pagingText(scr);
      await scr.locator(sel).first().click();
      for (let i = 0; i < 30 && (await pagingText(scr)) === before; i++) await p.waitForTimeout(200);
      await p.waitForTimeout(300);
      return { paging: await pagingText(scr), input: await scr.locator('.ant-input-number-input').first().inputValue(), first: await firstCell(), rows: await countRows(scr) };
    };
    out.page2 = await go('button:has(.anticon-right)');
    out.pageLast = await go('button:has(.anticon-step-forward)');
    out.pagePrev = await go('button:has(.anticon-left)');
    out.pageFirst = await go('button:has(.anticon-step-backward)');
    out.pageFirst.same = out.pageFirst.first === p1;
    await p.screenshot({ path: OUT + '/A35-1b-paging.png' });

    // 실사용 건만 조회 → 조회
    await scr.getByText('실사용 건만 조회').click();
    await scr.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1500);
    out.pagingUsed = await pagingText(scr);

    // [E1] 고객사 콤보 → 한국펀드서비스(주)
    await scr.locator('.ant-select').first().click(); await p.waitForTimeout(400);
    out.companyOptions = await p.locator('.ant-select-item-option:visible').count();
    await p.locator('.ant-select-item-option:visible').filter({ hasText: '한국펀드서비스' }).first().click(); await p.waitForTimeout(1500);
    out.pagingCompany = await pagingText(scr);

    // [E2] 사원명 + Enter
    await scr.locator('input[placeholder="사원명"]').fill('홍'); await scr.locator('input[placeholder="사원명"]').press('Enter'); await p.waitForTimeout(1500);
    out.pagingName = await pagingText(scr);
    await scr.locator('input[placeholder="사원명"]').fill(''); await scr.locator('input[placeholder="사원명"]').press('Enter'); await p.waitForTimeout(1200);

    // [E3] 매뉴명 찾기 → 조회창 → 첫 행 선택 후 확인 → 입력값·조회 건수
    await scr.locator('input.ant-input[readonly]').first().click(); await p.waitForTimeout(1500);
    const dlg = p.locator('.ant-modal').filter({ hasText: '매뉴찾기' }).first();
    out.lookupHeaders = await dlg.locator('.ag-header-cell-text').allInnerTexts();
    out.lookupRows = await countRows(dlg);
    await p.screenshot({ path: OUT + '/A35-2-lookup.png' });
    await dlg.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').check().catch(() => {});
    await dlg.getByRole('button', { name: /확\s*인/ }).click(); await p.waitForTimeout(800);
    out.menuInputAfter = await scr.locator('input.ant-input[readonly]').first().inputValue();
    await scr.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1500);
    out.pagingMenu = await pagingText(scr);
    out.rowsMenu = await countRows(scr);
    out.그리드 = await checkGrid(p, scr);
    out.gridOk = gridOk(out.그리드);
    await p.screenshot({ path: OUT + '/A35-3-filtered.png' });
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/A35-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
