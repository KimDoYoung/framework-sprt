// A20 로그인내역 조회(1140) 화면 확인. admin 테넌트 admin. 삭제 단추는 누르지 않는다(첫 행이 자동 선택됨).
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=<playwright-core 상위 node_modules> node tools/screens/A20.js <스크린샷 폴더>'"
const { BASE, launch } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const labels = async scr => (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
  const wrapped = bar => bar.evaluate(el => new Set([...el.children].map(c => Math.round((c.getBoundingClientRect().top + c.getBoundingClientRect().bottom) / 2 / 4))).size > 1);
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await wait(2500);
    const item = p.getByText('로그인내역 조회', { exact: true }).first();
    if (!(await item.isVisible())) { await p.getByText('관리자', { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(3000);
    const scr = tab();
    out.buttons = await labels(scr);
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.rows = await scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]').count();
    out.firstRow = (await scr.locator('.ag-row[row-index="0"]').first().innerText()).replace(/\s+/g, ' ').slice(0, 200);
    out.selected = await scr.locator('.ag-row-selected').count();
    const reset = scr.locator('button').filter({ hasText: /^\s*초\s*기\s*화\s*$/ });
    if (await reset.count()) {
      const bar = reset.first().locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " ant-space ")][1]');
      out.toolbarWrap = await wrapped(bar);
    }
    await p.screenshot({ path: `${OUT}/A20-1.png` });
    // 접속구분 콤보 항목
    await scr.locator('.ant-select').nth(0).click(); await wait(500);
    out.modeOptions = (await p.locator('.ant-select-item-option').allInnerTexts()).join('|');
    await p.keyboard.press('Escape');
    // 기간을 넓혀 조회 (시작일 2022-03-01)
    const start = scr.locator('.ant-picker input').first();
    await start.click(); await start.fill('2026-10-01'); await p.keyboard.press('Enter'); await wait(300);
    await scr.locator('button').filter({ hasText: /^\s*조\s*회\s*$/ }).first().click(); await wait(2500);
    out.rowsWide = await scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]').count();
    // 초기화 → 오늘로
    if (await reset.count()) { await reset.first().click(); await wait(400); out.afterReset = await scr.locator('.ant-picker input').first().inputValue(); }
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/A20-err.png` }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
