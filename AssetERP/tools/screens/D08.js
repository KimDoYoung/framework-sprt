// D08 ICAM 보수(관리자용)(Icam10_Tab_FeeAdmin, #1203) 화면 확인: 열기 → 버튼·헤더·기본값(구분 사무관리보수, 운용사 칸 비활성) → 사무관리보수 조회(회사 1 고정)
//   → 구분 운용보수로 바꿈(운용사 칸 켜짐) → 운용사 없이 조회(경고) → 운용사 조회창(더블클릭) → 기간 넓혀 조회·첫 행 선택·페이징 → 검색어
//   → 구분을 사무관리보수로 되돌리면 운용사 비움 → 가져오기(운용사 있음: 서버 거절 메시지) → 가져오기 확인창(아니오).
// 데이터를 바꾸지 않는다(가져오기는 서버가 거절). 메뉴 #1203은 admin 회사에 켜져 있고, 회사 한국펀드서비스(주)(28000)에 ICAM 보수 데이터가 있다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/D08.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  p.on('request', r => { if (['PUT', 'POST', 'DELETE'].includes(r.method()) && r.url().includes('/api/v1/icam/')) writes.push(r.method() + ' ' + r.url().split('/api/v1/icam/')[1].split('?')[0]); });
  let scr;
  const btn = re => scr.locator('button').filter({ hasText: re }).first();
  const msgs = async () => (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' ');
  const rows = () => scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
  const paging = async () => (await scr.locator('text=/전체 \\d+ 중|표시할 데이터가 없습니다/').first().innerText().catch(() => '없음'));
  const company = () => scr.locator('input[placeholder="전체"]');
  const setDate = async (nth, v) => { const i = scr.locator('.ant-picker input').nth(nth); await i.click(); await i.fill(v); await i.press('Enter'); await wait(300); };
  const pickFeeType = async name => { await scr.locator('.ant-select').first().click(); await wait(400); await p.locator('.ant-select-item-option').filter({ hasText: name }).first().click(); await wait(400); };
  try {
    await login(p, COMPANY);
    await openMenu(p, 'I/F', 'ICAM 보수(관리자용)');
    scr = p.locator('.flexlayout__tab:visible').last();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.dates = (await scr.locator('.ant-picker input').evaluateAll(l => l.map(i => i.value))).join('~');   // 어제~어제
    out.feeTypeDefault = (await scr.locator('.ant-select-selection-item').first().innerText());
    out.companyDisabledDefault = await company().isDisabled();                    // true
    out.rowsOpen = await rows().count();                                          // 0 (열 때 조회 안 함)
    // 사무관리보수 조회 [E4] — 회사 1 고정 (경고 없이 조회)
    await setDate(0, '2026-04-01'); await setDate(1, '2026-04-19');
    await btn(/^\s*조\s*회\s*$/).click(); await wait(1500);
    out.msgOffice = await msgs(); out.rowsOffice = await rows().count(); out.pagingOffice = await paging();
    // 구분 바꾸기 [E1] → 운용사 칸 켜짐
    await pickFeeType('운용보수'); out.companyDisabledAfter = await company().isDisabled();   // false
    // 운용사 없이 조회: 경고
    await btn(/^\s*조\s*회\s*$/).click(); await wait(500); out.msgNoCompany = await msgs();
    // 운용사 조회창 [E3]
    await company().click(); await wait(1200);
    await p.locator('.ant-modal .ag-row[row-index]').filter({ hasText: '한국펀드서비스' }).first().locator('.ag-cell[col-id="companyNm"]').first().dblclick(); await wait(800);
    out.companyText = await company().inputValue();
    await setDate(0, '2022-10-01'); await setDate(1, '2026-01-31');
    await btn(/^\s*조\s*회\s*$/).click(); await wait(2000);
    out.rowsFee = await rows().count();                                           // 100 (페이지 크기)
    out.selectedFirst = await scr.locator('.ag-row-selected').count();            // 첫 행 자동 선택
    out.firstRow = (await rows().first().innerText()).replace(/\s+/g, ' ').slice(0, 160);
    out.pagingFee = await paging();                                               // 전체 285
    out.grid = await checkGrid(p, scr); out.gridOk = gridOk(out.grid);
    // 검색어 [E2] Enter
    await scr.locator('input.ant-input:not([placeholder="전체"])').last().fill('에스에스'); await scr.locator('input.ant-input:not([placeholder="전체"])').last().press('Enter'); await wait(1500);
    out.rowsSearch = await rows().count(); out.pagingSearch = await paging();
    await p.screenshot({ path: `${OUT}/D08-${COMPANY}.png` });
    // 가져오기 — 운용사 있음: 바로 호출 → 서버 거절 [E5]
    await btn(/발생보수/).click(); await wait(1000); out.batchMsg = await msgs();
    // 구분을 사무관리보수로 → 운용사 비움, 가져오기는 회사 1로 바로 호출
    await pickFeeType('사무관리보수'); out.companyAfterOffice = await company().inputValue(); out.companyDisabledOffice = await company().isDisabled();
    // 운용보수 + 운용사 비움(선택안함) → 가져오기 = 확인창(아니오 → 호출 없음) [E5][E6]
    await pickFeeType('운용보수');
    const before = writes.length;
    await btn(/발생보수/).click(); await wait(600);
    out.confirmText = (await p.locator('.ant-modal-confirm-content').allInnerTexts()).join('|');
    await p.locator('.ant-modal-confirm-btns button').filter({ hasText: /아니오/ }).first().click(); await wait(600);
    out.writesAfterNo = writes.length - before;
  } catch (e) { out.err = e.message.split('\n')[0]; await p.screenshot({ path: `${OUT}/D08-err.png` }).catch(() => {}); }
  out.writes = writes;
  await b.close();
  console.log(JSON.stringify(out, null, 1));
})();
