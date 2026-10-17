// C07 PDF 생성 테스트(Dbm10_Tab_MakePdf, #1108) 화면 확인: 열기 → 버튼·헤더·행 수 → 조회 → 행 선택 → PDF 생성(서버 연동 없음 → 오류 안내) 후 다시 조회.
// 데이터를 바꾸지 않는다(PDF 생성은 PdfMaker 기본 구현이 거절).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/C07.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'kfstest'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  p.on('request', r => { if (['PUT', 'POST', 'DELETE'].includes(r.method()) && r.url().includes('/api/v1/dbm/')) writes.push(r.method() + ' ' + r.url().split('/api/v1/dbm/')[1].split('?')[0]); });
  try {
    await login(p, COMPANY);
    await openMenu(p, '관리자', 'PDF 생성 테스트');
    const scr = p.locator('.flexlayout__tab:visible').last();
    const btn = re => scr.locator('button').filter({ hasText: re }).first();
    const msgs = async () => (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' ');
    const rows = () => scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.rowsOpen = await rows().count();                       // [E0]
    out.firstRow = (await rows().first().innerText()).replace(/\s+/g, ' ');
    await btn(/^\s*조\s*회\s*$/).click(); await wait(1200);     // [E1]
    out.rowsRetrieve = await rows().count();
    // 선택 없이 PDF 생성 → 아무 일 없음
    await btn(/PDF\s*생성/).click(); await wait(600);
    out.noSelectWrites = writes.length;
    out.grid = await checkGrid(p, scr); out.gridOk = gridOk(out.grid);
    // 선택 후 PDF 생성 [E2] → 서버 오류 안내 → 다시 조회
    await rows().first().locator('.ag-selection-checkbox input').first().click({ force: true }); await wait(300);
    out.selected = await scr.locator('.ag-row-selected').count();
    await btn(/PDF\s*생성/).click(); await wait(1200);
    out.createMsg = await msgs();
    out.rowsAfter = await rows().count();
    await p.screenshot({ path: `${OUT}/C07-${COMPANY}.png` });
    out.writes = writes;
  } catch (e) { out.err = e.message.split('\n')[0]; out.writes = writes; await p.screenshot({ path: `${OUT}/C07-err.png` }).catch(() => {}); }
  await b.close();
  console.log(JSON.stringify(out, null, 1));
})();
