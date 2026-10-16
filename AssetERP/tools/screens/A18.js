// A18 일자관리(1080 관리자 메뉴) 화면 확인. admin 테넌트 admin(회사 0). 일자 "생성"은 확인 창에서 '아니오'(그 해 일자를 지우고 다시 만드는 동작),
// 휴일관리는 먼 미래 일자(2099-12-31)로 등록→저장→삭제까지 하고, 실패하면 부른 쪽이 `yunhee sql`로 2099-12-31 행을 보고 API DELETE로 지운다(kfstest). 고객사반영은 확인 창 앞(저장 안 함)까지.
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=<playwright-core 상위 node_modules> node tools/screens/A18.js <스크린샷 폴더>'"
const { BASE, launch, login } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const rows = scr => scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
  const btn = (scr, re) => scr.locator('button').filter({ hasText: re }).first();
  const modal = title => p.locator('.ant-modal').filter({ has: p.locator('.ant-modal-title', { hasText: title }) });
  const wrapped = bar => bar.evaluate(el => new Set([...el.children].map(c => Math.round((c.getBoundingClientRect().top + c.getBoundingClientRect().bottom) / 2 / 4))).size > 1);
  let writes = [];
  p.on('request', r => { if (['PUT', 'POST', 'DELETE'].includes(r.method()) && r.url().includes('/api/v1/sys/')) writes.push(r.method() + ' ' + r.url().split('/api/v1/sys/')[1]); });
  try {
    await login(p, 'kfstest');  // 이 메뉴는 admin 회사(0)에는 켜져 있지 않다(sys03_company_menu) — 고객사 관리자로
    const item = p.getByText('일자관리', { exact: true }).first();
    if (!(await item.isVisible())) { await p.getByText('관리자', { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(3000);
    const scr = tab();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.year = await scr.locator('input.ant-input').first().inputValue();
    out.rowsOnOpen = await rows(scr).count();
    out.firstRow = (await rows(scr).first().innerText()).replace(/\s+/g, ' ');
    const reset = btn(scr, /^\s*초\s*기\s*화\s*$/);
    if (await reset.count()) out.toolbarWrap = await wrapped(reset.locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " ant-space ")][1]'));
    await scr.locator('.ag-header-cell').filter({ hasText: '요일' }).first().click(); await wait(300);
    out.sortedIcon = await scr.locator('.ag-sort-ascending-icon:visible, .ag-sort-descending-icon:visible').count();
    await p.screenshot({ path: `${OUT}/A18-1.png` });
    // 월 콤보 → 3월: 고르면 바로 조회
    await scr.locator('.ant-select').first().click(); await wait(400);
    await p.locator('.ant-select-item-option').filter({ hasText: /^3월$/ }).first().click(); await wait(1500);
    out.rowsMarch = (await rows(scr).count());
    // 영업일 체크박스 클릭 → 저장(1) → 한 번 더 클릭해 원래대로(저장(0)이 되는지)
    const wk = rows(scr).first().locator('[col-id="workingYn"] input[type=checkbox]');
    out.workingBefore = await wk.isChecked();
    await wk.click(); await wait(300);
    out.saveLabelAfterClick = (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, '');
    out.workingAfter = await wk.isChecked();
    await wk.click(); await wait(300);
    out.saveLabelAfterRestore = (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, '');
    // 고객사반영(관리자 회사만) — 고객사 계정에는 버튼이 없다
    out.customerButtonCount = await btn(scr, /고\s*객\s*사\s*반\s*영/).count();
    if (out.customerButtonCount) {
    await btn(scr, /고\s*객\s*사\s*반\s*영/).click(); await wait(500);
    out.warnNoSelect = (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' ');
    await rows(scr).first().locator('input[type=checkbox]').first().click(); await wait(300);
    await btn(scr, /고\s*객\s*사\s*반\s*영/).click(); await wait(2000);
    const cm = modal('고객사반영');
    out.customer = { visible: await cm.isVisible(), buttons: (await cm.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(','), headers: (await cm.locator('.ag-header-cell-text').allInnerTexts()).join('|'), rows: await cm.locator('.ag-row[row-index]').count() };
    await p.screenshot({ path: `${OUT}/A18-2.png` });
    // 반영 버튼: 선택 없이 → 경고, 체크 후 → 확인 창 문구 → 아니오
    await cm.locator('button').filter({ hasText: /Admin/ }).click(); await wait(400);
    out.customerWarn = (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' ');
    if (await cm.locator('.ag-row[row-index]').count()) {
      await cm.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click(); await wait(200);
      await cm.locator('button').filter({ hasText: /Admin/ }).click(); await wait(500);
      out.customerConfirm = (await p.locator('.ant-modal-confirm').last().innerText()).replace(/\s+/g, ' ');
      await p.locator('.ant-modal-confirm-btns button').first().click(); await wait(400);
    }
    await cm.locator('.ant-modal-footer button').filter({ hasText: /닫\s*기/ }).click(); await wait(600);
    }
    // 생성: 확인 창 문구 → 아니오
    await btn(scr, /^\s*생\s*성\s*$/).click(); await wait(500);
    out.generateConfirm = (await p.locator('.ant-modal-confirm').last().innerText()).replace(/\s+/g, ' ');
    await p.locator('.ant-modal-confirm-btns button').first().click(); await wait(500);
    // 휴일관리
    await btn(scr, /휴\s*일\s*관\s*리/).click(); await wait(1500);
    const hm = modal('휴일관리');
    out.holiday = { visible: await hm.isVisible(), buttons: (await hm.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(','), headers: (await hm.locator('.ag-header-cell-text').allInnerTexts()).join('|'), rowsOnOpen: await hm.locator('.ag-row[row-index]').count() };
    const yr = hm.locator('input.ant-input').first();
    await yr.fill('2026'); await yr.press('Enter'); await wait(1500);
    out.holidayRows2026 = await hm.locator('.ag-row[row-index]').count();
    await p.screenshot({ path: `${OUT}/A18-3.png` });
    // 등록 → 일자 2099-12-31 / 휴일명 A18시험 → 저장 → 연도 2099 조회 → 삭제
    await hm.locator('button').filter({ hasText: /등\s*록/ }).click(); await wait(1200);  // 날짜 편집기가 뜰 때까지(0.5초로는 입력이 조회연도 칸으로 간다)
    await hm.locator('input.ag-date-field-input').fill('2099-12-31'); await p.keyboard.press('Tab');  // 날짜 편집기는 <input type=date>라 키 입력이 아니라 fill await p.keyboard.type('QA18시험'); await p.keyboard.press('Enter'); await wait(500);
    out.holidaySaveLabel = (await hm.locator('button').filter({ hasText: /저\s*장/ }).first().innerText()).replace(/\s/g, '');
    await hm.locator('button').filter({ hasText: /저\s*장/ }).first().click(); await wait(1500);
    await yr.fill('2099'); await yr.press('Enter'); await wait(1500);
    out.holidayRows2099 = (await hm.locator('.ag-row[row-index]').allInnerTexts()).map(t => t.replace(/\s+/g, ' '));
    await hm.locator('.ag-row[row-index]').filter({ hasText: '2099-12-31' }).first().locator('input[type=checkbox]').first().click(); await wait(300);
    await hm.locator('button').filter({ hasText: /삭\s*제/ }).first().click(); await wait(500);
    out.holidayDeleteConfirm = (await p.locator('.ant-modal-confirm').last().innerText()).replace(/\s+/g, ' ');
    await p.locator('.ant-modal-confirm-btns button').last().click(); await wait(1500);
    out.holidayRowsAfterDelete = await hm.locator('.ag-row[row-index]').count();
    // 기초데이터생성(관리자 회사만) — 고객사 계정에는 버튼·고객사 칸이 없다
    out.initButtonCount = await hm.locator('button').filter({ hasText: /기초데이터생성/ }).count();
    await hm.locator('.ant-modal-footer button').filter({ hasText: /닫\s*기/ }).click(); await wait(500);
    out.writes = writes;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/A18-err.png` }).catch(() => {});
    out.writes = writes;
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
