// A23 Admin 로그인내역 조회(1198) 화면 확인. admin 테넌트 admin. 조회만 한다(데이터를 바꾸지 않음).
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=<playwright-core 상위 node_modules> node tools/screens/A23.js <스크린샷 폴더>'"
const { BASE, launch } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const rows = scr => scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await wait(2500);
    const item = p.getByText('Admin 로그인내역 조회', { exact: true }).first();
    if (!(await item.isVisible())) { await p.getByText('관리자', { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(3000);
    const scr = tab();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.dates = await scr.locator('.ant-picker input').evaluateAll(els => els.map(e => e.value));
    out.rowsOnOpen = await rows(scr).count();
    await scr.locator('.ag-header-cell').filter({ hasText: '로그인 일자' }).first().click(); await wait(300);
    out.sortedIcon = await scr.locator('.ag-sort-ascending-icon:visible, .ag-sort-descending-icon:visible').count();
    await p.screenshot({ path: `${OUT}/A23-1.png` });
    // 시작일을 2022-01-01로 바꿔 조회
    const start = scr.locator('.ant-picker input').first();
    await start.click(); await start.fill('2022-01-01'); await p.keyboard.press('Enter'); await wait(300);
    await scr.locator('button').filter({ hasText: /^\s*조\s*회\s*$/ }).first().click(); await wait(2000);
    out.rows = await rows(scr).count();
    out.firstRow = (await rows(scr).first().innerText()).replace(/\s+/g, ' ');
    out.lastRow = (await rows(scr).last().innerText()).replace(/\s+/g, ' ');
    out.checked = await p.locator('.ag-row-selected').count();
    await rows(scr).first().locator('input[type=checkbox]').first().click(); await wait(200);
    out.checkedAfterClick = await scr.locator('.ag-row-selected').count();
    await p.screenshot({ path: `${OUT}/A23-2.png` });
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/A23-err.png` }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
