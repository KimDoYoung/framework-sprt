// A12 화면안내등록(1360) 화면 확인. admin 테넌트 admin. 첫 행 화면안내 끝에 'ZZ'를 붙여 저장한 뒤 부른 쪽(API)이 원래 값으로 되돌린다.
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=<playwright-core 상위 node_modules> node tools/screens/A12.js <스크린샷 폴더>'"
const { BASE, launch } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const rows = scr => scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
  const btn = (scr, re) => scr.locator('button').filter({ hasText: re }).first();
  const wrapped = bar => bar.evaluate(el => new Set([...el.children].map(c => Math.round((c.getBoundingClientRect().top + c.getBoundingClientRect().bottom) / 2 / 4))).size > 1);
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await wait(2500);
    const item = p.getByText('화면안내등록', { exact: true }).first();
    if (!(await item.isVisible())) { await p.getByText('관리자', { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(3000);
    const scr = tab();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.rowsOnOpen = await rows(scr).count();
    out.firstRow = (await rows(scr).first().innerText()).replace(/\s+/g, ' ').slice(0, 120);
    const reset = btn(scr, /^\s*초\s*기\s*화\s*$/);
    if (await reset.count()) out.toolbarWrap = await wrapped(reset.locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " ant-space ")][1]'));
    await scr.locator('.ag-header-cell').filter({ hasText: '화면명' }).first().click(); await wait(300);
    out.sortedIcon = await scr.locator('.ag-sort-ascending-icon:visible, .ag-sort-descending-icon:visible').count();
    await p.screenshot({ path: `${OUT}/A12-1.png` });
    // 메뉴명 콤보 → 문서작성: 고르면 바로 조회
    await scr.locator('.ant-select').first().click(); await wait(400);
    await p.locator('.ant-select-item-option').filter({ hasText: '문서작성' }).first().click(); await wait(1500);
    out.rowsMenu = await rows(scr).count();
    // 검색어 + Enter
    const input = scr.locator('input.ant-input').first();
    await input.fill('신규'); await input.press('Enter'); await wait(1500);
    out.rowsSearch = await rows(scr).count();
    // 초기화 → 전체·빈 검색어 (자동 조회 없음)
    if (await reset.count()) { await reset.click(); await wait(500); out.afterReset = { combo: await scr.locator('.ant-select-selection-item').first().innerText(), text: await input.inputValue(), rows: await rows(scr).count() }; }
    // 전체 조회 후 첫 행 화면안내 편집 → 저장
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
    const noteCell = rows(scr).first().locator('[col-id="note"]');
    out.noteBefore = (await noteCell.innerText()).replace(/\s+/g, ' ');
    await noteCell.dblclick(); await wait(500);
    await p.keyboard.press('Control+End'); await p.keyboard.type('ZZ'); await p.keyboard.press('Enter'); await wait(500);
    out.saveLabel = (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, '');
    await btn(scr, /저\s*장/).click(); await wait(2000);
    out.afterSave = { saveLabel: (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, ''), note: (await rows(scr).first().locator('[col-id="note"]').innerText()).replace(/\s+/g, ' '), rows: await rows(scr).count() };
    await p.screenshot({ path: `${OUT}/A12-2.png` });
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/A12-err.png` }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
