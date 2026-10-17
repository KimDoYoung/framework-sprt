// D09 ICAM DB Source Get(Icam50_Tab_DbSource, #1269) 화면 확인: 열기 → 버튼·헤더·기본값(기준일 오늘, 서버·소스 전체) → 조회(300행, 전체 3935, 첫 행 선택)
//   → 서버 자문서버 + 소스 TRIGGER + 소스명 검색(Enter) → 보기 아이콘(소스내용 창, 닫기) → 가져오기 확인창(아니오) → 예(서버 거절 메시지).
// 데이터를 바꾸지 않는다(가져오기는 서버가 거절). 메뉴 #1269는 admin 회사에 켜져 있다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/D09.js <스크린샷 폴더> [회사]
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
  const pick = async (nth, name) => { await scr.locator('.ant-select').nth(nth).click(); await wait(400); await p.locator('.ant-select-item-option').filter({ hasText: name }).first().click(); await wait(400); };
  try {
    await login(p, COMPANY);
    await openMenu(p, 'I/F', 'ICAM DB Source Get');
    scr = p.locator('.flexlayout__tab:visible').last();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.stdDate = await scr.locator('.ant-picker input').first().inputValue();
    out.selects = (await scr.locator('.ant-select-selection-item').allInnerTexts()).join('|');   // 전체|전체
    out.placeholders = (await scr.locator('input.ant-input[placeholder]').evaluateAll(l => l.map(i => i.placeholder))).join('|');
    out.rowsOpen = await rows().count();                                           // 0 (열 때 조회 안 함)
    await btn(/^\s*조\s*회\s*$/).click(); await wait(2500);
    out.rowsAll = await rows().count(); out.pagingAll = await paging();            // 300 / 전체 3935
    out.selectedFirst = await scr.locator('.ag-row-selected').count();
    out.firstRow = (await rows().first().innerText()).replace(/\s+/g, ' ').slice(0, 160);
    out.grid = await checkGrid(p, scr); out.gridOk = gridOk(out.grid);
    // 서버 자문서버 + 소스 TRIGGER + 소스명 A [E1]
    await pick(0, '자문서버'); await pick(1, 'TRIGGER');
    const name = scr.locator('input[placeholder="소스명"]');
    await name.fill('A'); await name.press('Enter'); await wait(1500);
    out.rowsFilter = await rows().count(); out.pagingFilter = await paging();      // 1
    // 보기 아이콘 → 소스내용 창
    await rows().first().locator('button').first().click(); await wait(800);
    out.viewTitle = await p.locator('.ant-modal-title').innerText().catch(() => '없음');
    out.viewText = ((await p.locator('.ant-modal textarea').inputValue().catch(() => '')) || '').slice(0, 60);
    out.viewReadonly = await p.locator('.ant-modal textarea').getAttribute('readonly');
    await p.screenshot({ path: `${OUT}/D09-${COMPANY}.png` });
    await p.locator('.ant-modal-footer button').filter({ hasText: /닫기/ }).click(); await wait(500);
    out.viewClosed = await p.locator('.ant-modal textarea').count();               // 0
    // 가져오기: 확인창 → 아니오(요청 0건) → 예(서버 거절)
    const before = writes.length;
    await btn(/DB소스/).click(); await wait(600);
    out.confirmText = (await p.locator('.ant-modal-confirm-content').allInnerTexts()).join('|');
    await p.locator('.ant-modal-confirm-btns button').filter({ hasText: /아니오/ }).first().click(); await wait(600);
    out.writesAfterNo = writes.length - before;
    await btn(/DB소스/).click(); await wait(600);
    await p.locator('.ant-modal-confirm-btns button').filter({ hasText: /예/ }).first().click(); await wait(1200);
    out.batchMsg = await msgs();
  } catch (e) { out.err = e.message.split('\n')[0]; await p.screenshot({ path: `${OUT}/D09-err.png` }).catch(() => {}); }
  out.writes = writes;
  await b.close();
  console.log(JSON.stringify(out, null, 1));
})();
