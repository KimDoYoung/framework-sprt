// A21 로그인 Mac 주소 관리(1442) 화면 확인. admin 테넌트 admin. 승인여부는 바꾸지 않는다(문자·승인일이 바뀜).
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=<playwright-core 상위 node_modules> node tools/screens/A21.js <스크린샷 폴더>'"
const { BASE, launch } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const labels = async scr => (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
  const wrapped = bar => bar.evaluate(el => new Set([...el.children].map(c => Math.round((c.getBoundingClientRect().top + c.getBoundingClientRect().bottom) / 2 / 4))).size > 1);
  const modal = () => p.locator('.ant-modal:visible').last();
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await wait(2500);
    const item = p.getByText('로그인 Mac 주소 관리', { exact: true }).first();
    if (!(await item.isVisible())) { await p.getByText('관리자', { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(3000);
    const scr = tab();
    out.buttons = await labels(scr);
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.rows = await scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]').count();
    out.firstRow = (await scr.locator('.ag-row[row-index="0"]').first().innerText()).replace(/\s+/g, ' ').slice(0, 200);
    out.checks = await scr.locator('.ag-row[row-index="0"] .ant-checkbox-checked').count();
    const reset = scr.locator('button').filter({ hasText: /^\s*초\s*기\s*화\s*$/ });
    if (await reset.count()) {
      const bar = reset.first().locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " ant-space ")][1]');
      out.toolbarWrap = await wrapped(bar);
    }
    await p.screenshot({ path: `${OUT}/A21-1.png` });
    // 회사 전체 상태에서 사원 돋보기 → 경고
    await scr.locator('input[readonly][value="전체"]').last().click(); await wait(600);
    out.warn = (await p.locator('.ant-message-notice').allInnerTexts()).join('|');
    // 회사 고르고 사원찾기
    await scr.locator('.ant-select').first().click(); await wait(400);
    await p.locator('.ant-select-item-option', { hasText: '한국펀드서비스' }).first().click(); await wait(400);
    await scr.locator('input[readonly][value="전체"]').last().click(); await wait(2000);
    out.lookup = { title: await modal().locator('.ant-modal-title').innerText(), buttons: await labels(modal()), rows: await modal().locator('.ag-row[row-index]').count() };
    await p.screenshot({ path: `${OUT}/A21-lookup.png` });
    await modal().locator('.ag-row[row-index="0"] .ag-cell').nth(2).dblclick(); await wait(1000);
    out.pickedPerson = await scr.locator('input[readonly]').last().inputValue();
    await scr.locator('button').filter({ hasText: /^\s*조\s*회\s*$/ }).first().click(); await wait(1500);
    out.rowsAfterPick = await scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]').count();
    // 감추기(체크 없음) → 다시 조회
    await scr.locator('button').filter({ hasText: /감추기/ }).first().click(); await wait(1000);
    // 초기화
    if (await reset.count()) { await reset.first().click(); await wait(400); out.afterReset = await scr.locator('input[readonly]').last().inputValue(); }
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/A21-err.png` }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
