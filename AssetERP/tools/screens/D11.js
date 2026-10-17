// D11 수탁사정보 관리(관리자)(Fnd03_Tab_ConsignmentManager, #1102) 화면 확인: 열기 → 버튼·헤더·기본값(사용여부 체크, 검색칸 "전체") → 조회(admin 회사 = 공통 회사 0, 데이터 0행)
//   → 검색어 Enter · 사용여부 해제 조회(요청 확인) → 저장(변경 없음: 요청 없음) → ICAM가져오기(서버 거절 메시지).
// 데이터를 바꾸지 않는다. 이 DB의 fnd03_consignment에는 공통 회사(0) 행이 없어 그리드는 0행이다 — 셀 편집·저장은 이 화면 스크립트로 못 본다(FndConsignmentDbTest가 롤백으로 확인).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/D11.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  const gets = [];
  p.on('request', r => {
    const u = r.url();
    if (!u.includes('/api/v1/fnd/')) return;
    if (['PUT', 'POST', 'DELETE'].includes(r.method())) writes.push(r.method() + ' ' + u.split('/api/v1/fnd/')[1].split('?')[0]);
    else gets.push(decodeURIComponent(u.split('/api/v1/fnd/')[1]));
  });
  let scr;
  const btn = re => scr.locator('button').filter({ hasText: re }).first();
  const msgs = async () => (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' ');
  const rows = () => scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
  try {
    await login(p, COMPANY);
    await openMenu(p, 'I/F', '수탁사정보 관리(관리자)');
    scr = p.locator('.flexlayout__tab:visible').last();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.placeholder = await scr.locator('input.ant-input').first().getAttribute('placeholder');
    out.useYnChecked = await scr.locator('.ant-checkbox-input').last().isChecked();
    out.rowsOpen = await rows().count();                                           // 0 (열 때 조회 안 함)
    out.getsOpen = gets.length;                                                    // 0
    await btn(/^\s*조\s*회\s*$/).click(); await wait(1500);
    out.rowsRetrieve = await rows().count();                                       // 0 (공통 회사 0 행 없음)
    out.getsRetrieve = gets.slice();
    out.grid = await checkGrid(p, scr); out.gridOk = gridOk(out.grid);
    const q = scr.locator('input.ant-input').first();
    await q.fill('국민'); await q.press('Enter'); await wait(1000);
    await scr.locator('.ant-checkbox-input').last().click({ force: true }); await wait(300);
    await btn(/^\s*조\s*회\s*$/).click(); await wait(1000);
    out.getsAfter = gets.slice(out.getsRetrieve.length);                           // searchText=국민 x1, useYn=false
    await p.screenshot({ path: `${OUT}/D11-${COMPANY}.png` });
    out.saveDisabledNoChange = await btn(/저\s*장/).isDisabled();                    // true (UX-03: 변경 0건이면 저장(0) 비활성)
    await btn(/ICAM가져오기/).click(); await wait(1200);
    out.importMsg = await msgs();
  } catch (e) { out.err = e.message.split('\n')[0]; await p.screenshot({ path: `${OUT}/D11-err.png` }).catch(() => {}); }
  out.writes = writes;
  await b.close();
  console.log(JSON.stringify(out, null, 1));
})();
