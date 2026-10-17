// D07 ICAM 펀드정보(Icam03_Tab_Fund, #1096) 화면 확인: 열기 → 버튼·헤더 → 운용사 없이 조회(경고) → 운용사 조회창(더블클릭) → 조회 → 첫 펀드 선택·오른쪽 이력·페이징 → 펀드 바꾸기
//   → ICAM Get(운용사 있음: 서버 거절 메시지) → 운용사 비움(선택안함) → ICAM Get 확인창(아니오).
// 데이터를 바꾸지 않는다(ICAM Get·타사무 Get은 서버가 거절). 메뉴 #1096은 admin 회사에 켜져 있고, 회사 한국펀드서비스(주)(28000)에 ICAM 데이터가 있다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/D07.js <스크린샷 폴더> [회사]
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
  const grids = () => scr.locator('.ag-root-wrapper');
  const rowsOf = n => grids().nth(n).locator('.ag-row[row-index]');
  try {
    await login(p, COMPANY);
    await openMenu(p, 'I/F', 'ICAM 펀드정보');
    scr = p.locator('.flexlayout__tab:visible').last();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headersLeft = (await grids().nth(0).locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.headersRight = (await grids().nth(1).locator('.ag-header-cell-text').allInnerTexts()).slice(0, 8).join('|');
    out.rowsOpen = await rowsOf(0).count();                                       // 0 (열 때 조회 안 함)
    // 운용사 없이 조회 [E2]
    await btn(/^\s*조\s*회\s*$/).click(); await wait(500); out.msgNoCompany = await msgs();
    // 운용사 조회창 [E1]
    await scr.locator('input[readonly]').first().click(); await wait(1200);
    out.lookupRows = await p.locator('.ant-modal .ag-row[row-index]').count();
    await p.locator('.ant-modal .ag-row[row-index]').filter({ hasText: '한국펀드서비스' }).first().locator('.ag-cell[col-id="companyNm"]').first().dblclick(); await wait(800);
    out.companyText = await scr.locator('input[readonly]').first().inputValue();
    await btn(/^\s*조\s*회\s*$/).click(); await wait(1500);
    out.rowsRecent = await rowsOf(0).count();                                     // 4
    out.selectedLeft = await grids().nth(0).locator('.ag-row-selected').count();  // 첫 행 자동 선택
    out.firstLeft = (await rowsOf(0).first().innerText()).replace(/\s+/g, ' ');
    out.rowsRight = await rowsOf(1).count();                                      // 선택한 펀드의 이력
    out.firstRight = (await rowsOf(1).first().innerText()).replace(/\s+/g, ' ').slice(0, 120);
    out.selectedRight = await grids().nth(1).locator('.ag-row-selected').count();
    out.paging = (await scr.locator('text=/전체 \\d+ 중|표시할 데이터가 없습니다/').first().innerText());
    out.gridLeft = await checkGrid(p, scr); out.gridOk = gridOk(out.gridLeft);
    // 펀드 바꾸기 [E5]
    const second = rowsOf(0).nth(1);
    const secondCd = (await second.innerText()).replace(/\s+/g, ' ').split(' ')[1];
    await second.locator('.ag-cell').first().click(); await wait(1200);
    out.rightAfterChange = (await rowsOf(1).first().innerText()).replace(/\s+/g, ' ').slice(0, 60);
    out.secondCd = secondCd;
    await p.screenshot({ path: `${OUT}/D07-${COMPANY}.png` });
    // ICAM Get·타사무 Get — 운용사 있음: 바로 호출 → 서버 거절 [E3][E4]
    await btn(/ICAM\s*Get/).click(); await wait(1000); out.icamMsg = await msgs();
    await btn(/타사무\s*Get/).click(); await wait(1000); out.extrMsg = await msgs();
    // 운용사 비움(선택안함) → ICAM Get = 확인창(아니오 → 호출 없음)
    const before = writes.length;
    await scr.locator('input[readonly]').first().click(); await wait(1000);
    await p.locator('.ant-modal-footer button').filter({ hasText: /선택안함/ }).first().click(); await wait(600);
    out.companyAfterClear = await scr.locator('input[readonly]').first().inputValue();
    await btn(/ICAM\s*Get/).click(); await wait(600);
    out.confirmText = (await p.locator('.ant-modal-confirm-content').allInnerTexts()).join('|');
    await p.locator('.ant-modal-confirm-btns button').filter({ hasText: /아니오/ }).first().click(); await wait(600);
    out.writesAfterNo = writes.length - before;
  } catch (e) { out.err = e.message.split('\n')[0]; await p.screenshot({ path: `${OUT}/D07-err.png` }).catch(() => {}); }
  out.writes = writes;
  await b.close();
  console.log(JSON.stringify(out, null, 1));
})();
