// B11 UX보강 부품 확인: 1410(Sys53_Tab_SpecificMenuRequestAdmin) 시범 + 공통 컴포넌트 테스트(Test_Tab_ReactComponents, mock).
// 저장하지 않는다(1410 데이터 변경 없음). admin 테넌트 admin으로 확인한다(사용자 계정으로 로그인하지 않음).
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더의 상위 node_modules> node tools/screens/B11.js <스크린샷 폴더>'"
const { BASE, launch } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);

    // ---- 1410 ----
    await p.getByText('관리자', { exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByText('고객별 특정화면 관리', { exact: true }).first().click(); await p.waitForTimeout(2500);
    const scr = p.locator('.flexlayout__tab').filter({ hasText: '특정업무구분' }).first();
    out.s1410 = {};
    const o = out.s1410;
    o.buttons = await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    o.rows = await countRows(scr);
    o.saveDisabled = await scr.getByRole('button', { name: /저장/ }).isDisabled();
    // UX-01: 조회 누른 직후 loading 클래스
    await scr.getByRole('button', { name: '조회' }).click();
    o.searchLoading = await scr.locator('button.ant-btn-loading').count();
    await p.waitForTimeout(1200);
    // 구분 = 완료 → 초기화(UX-02) → 값이 전체로, 자동 조회 없음(행 수 그대로)
    await scr.locator('.ant-select').nth(1).click(); await p.waitForTimeout(400);
    await p.locator('.ant-select-item-option:visible').filter({ hasText: /^완료$/ }).first().click(); await p.waitForTimeout(300);
    await scr.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1200);
    o.rowsDone = await countRows(scr);
    await scr.getByRole('button', { name: '초기화' }).click(); await p.waitForTimeout(800);
    o.afterReset = await scr.locator('.ant-select-selection-item').allInnerTexts();
    o.rowsAfterReset = await countRows(scr);
    // UX-03: 처리자 셀을 고치면 저장(1) 활성 → Esc 대신 원래 값으로 되돌리지 않고 재조회로 버린다(저장 안 함)
    const cell = scr.locator('.ag-row[row-index="0"] .ag-cell[col-id="confirmNm"]');
    if (await cell.count()) {
      await cell.dblclick(); await p.waitForTimeout(300);
      await p.keyboard.type('X'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
      o.saveLabel = await scr.getByRole('button', { name: /저장/ }).innerText();
      o.saveEnabled = !(await scr.getByRole('button', { name: /저장/ }).isDisabled());
      await scr.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1200);
      o.saveLabelAfterRetrieve = await scr.getByRole('button', { name: /저장/ }).innerText();
    }
    await p.screenshot({ path: OUT + '/B11-1-1410.png' });

    // ---- 공통 컴포넌트 테스트 ----
    const testMenu = p.getByText('테스트매뉴', { exact: true }).first();
    if (!(await testMenu.count())) {
      out.test = 'admin 계정에 테스트매뉴 없음';
    } else {
      await testMenu.click(); await p.waitForTimeout(600);
      await p.getByText('공통 컴포넌트 테스트', { exact: true }).first().click(); await p.waitForTimeout(2500);
      const t = p.locator('.flexlayout__tab').filter({ hasText: '셀 편집 CRUD' }).first();
      out.test = {};
      const q = out.test;
      q.paging = await t.locator('text=/전체 \\d+ 중/').first().innerText();
      const input = t.locator('input[placeholder^="성명"]');
      await input.fill('김'); await input.press('Enter');
      q.enterLoading = await t.locator('button.ant-btn-loading').count();
      await input.press('Enter');  // 조회 중 Enter → 무시
      await p.waitForTimeout(1200);
      q.pagingKim = await t.locator('text=/전체 \\d+ 중/').first().innerText();
      q.clearIcon = await t.locator('.ant-input-clear-icon').count();
      await t.getByRole('button', { name: '초기화' }).click(); await p.waitForTimeout(300);
      q.inputAfterReset = await input.inputValue();
      q.pagingAfterReset = await t.locator('text=/전체 \\d+ 중/').first().innerText();
      await t.locator('button[aria-label], .ant-btn').filter({ has: p.locator('.anticon-right') }).first().click(); await p.waitForTimeout(1200);
      q.page2 = await t.locator('text=/전체 \\d+ 중/').first().innerText();
      // 저장(n)
      q.saveBefore = await t.getByRole('button', { name: /저장/ }).innerText();
      const memo = t.locator('.ag-row[row-index="0"] .ag-cell[col-id="title"]').last();
      await memo.dblclick(); await p.waitForTimeout(300);
      await p.keyboard.type('a'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
      q.saveAfterEdit = await t.getByRole('button', { name: /저장/ }).innerText();
      await t.getByRole('button', { name: /저장/ }).click(); await p.waitForTimeout(1200);
      q.saveAfterSave = await t.getByRole('button', { name: /저장/ }).innerText();
      q.saveDisabledAfterSave = await t.getByRole('button', { name: /저장/ }).isDisabled();
      await p.screenshot({ path: OUT + '/B11-2-test.png' });
    }
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/B11-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
