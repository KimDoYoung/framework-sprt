// D10 작업용(Icam99_Tab_Test, #1097) 화면 확인: 열기 → 툴바 버튼 3줄·아래 버튼 줄·헤더·기본값(날짜 3개 오늘) → 조회(첫 행 선택, 체크박스 한 행 선택)
//   → 작업 버튼 3개(종목정보·펀드원장·소실파일: 서버 거절 메시지) → test(test!! 메시지) → 아래 버튼(요청 없음).
// 데이터를 바꾸지 않는다(작업 버튼은 서버가 거절). 회사에 따라 조회 행 수가 다르다: admin(0) = 0행, (ICAM연계테스트) 한채투(100) = 160행.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/D10.js <스크린샷 폴더> [회사]
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
  try {
    await login(p, COMPANY);
    await openMenu(p, 'I/F', '작업용');
    scr = p.locator('.flexlayout__tab:visible').last();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.buttonCount = (await scr.locator('button').filter({ hasText: /\S/ }).count());           // 31
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.dates = (await scr.locator('.ant-picker input').evaluateAll(l => l.map(i => i.value))).join(',');   // 오늘 x3
    out.checkbox = await scr.locator('.ant-checkbox-wrapper').filter({ hasText: '기간조건 제외' }).count();
    out.rowsOpen = await rows().count();
    await btn(/^\s*조\s*회\s*$/).click(); await wait(2000);
    out.rowsRetrieve = await rows().count();
    out.selectedFirst = await scr.locator('.ag-row-selected').count();
    out.firstRow = out.rowsRetrieve ? (await rows().first().innerText()).replace(/\s+/g, ' ').slice(0, 160) : '';
    out.rowCheckbox = await scr.locator('.ag-root-wrapper').first().locator('.ag-selection-checkbox').count();
    out.grid = await checkGrid(p, scr); out.gridOk = gridOk(out.grid);
    await p.screenshot({ path: `${OUT}/D10-${COMPANY}.png` });
    for (const re of [/종목정보/, /펀드원장/, /소실파일/, /보유종목Get/]) {
      await btn(re).click(); await wait(900); out['msg_' + re.source] = await msgs();
    }
    await btn(/^\s*test\s*$/).click(); await wait(900); out.msgTest = await msgs();
    const before = writes.length;
    for (const re of [/^\s*확정\s*$/, /^\s*삭제\s*$/, /^\s*적용\s*$/, /인사정보/]) { await btn(re).click(); await wait(300); }
    out.confirmOpen = await p.locator('.ant-modal-confirm').count();
    out.writesBottom = writes.length - before;                                     // 0
  } catch (e) { out.err = e.message.split('\n')[0]; await p.screenshot({ path: `${OUT}/D10-err.png` }).catch(() => {}); }
  out.writes = writes;
  await b.close();
  console.log(JSON.stringify(out, null, 1));
})();
