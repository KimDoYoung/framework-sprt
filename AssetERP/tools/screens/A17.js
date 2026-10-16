// A17 미사용 파일조회(1353) 화면 확인. admin 테넌트 admin. 실제 파일 삭제는 하지 않는다 — 삭제 아이콘은 확인 창까지만 보고 '아니오'.
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=<playwright-core 상위 node_modules> node tools/screens/A17.js <스크린샷 폴더>'"
const { BASE, launch } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const rows = scr => scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
  const btn = (scr, re) => scr.locator('button').filter({ hasText: re }).first();
  let delCalls = 0;
  p.on('request', r => { if (r.method() === 'DELETE' && r.url().includes('/sys/files')) delCalls++; });
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await wait(2500);
    const item = p.getByText('미사용 파일조회', { exact: true }).first();
    if (!(await item.isVisible())) { await p.getByText('관리자', { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(4000);
    const scr = tab();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.rowsOnOpen = await rows(scr).count();
    out.firstRow = (await rows(scr).first().innerText()).replace(/\s+/g, ' ');
    out.checkboxes = await scr.locator('.ag-row[row-index="0"] input[type=checkbox]').count();
    out.sortedIcon = (await scr.locator('.ag-header-cell').filter({ hasText: '등록일' }).first().click(), await wait(300), await scr.locator('.ag-sort-ascending-icon:visible, .ag-sort-descending-icon:visible').count());
    await p.screenshot({ path: `${OUT}/A17-1.png` });
    // 보기 → 조회창 → 닫기
    await rows(scr).first().locator('[col-id="viewCell"] button').click(); await wait(1500);
    out.viewer = await p.locator('.ant-modal').filter({ has: p.locator('.ant-modal-title', { hasText: '파일보기' }) }).isVisible();
    await p.screenshot({ path: `${OUT}/A17-2.png` });
    await p.locator('.ant-modal-footer button').filter({ hasText: /닫\s*기/ }).last().click(); await wait(600);
    // 받기 → 서버에 파일이 없어 오류 안내가 떠도 화면은 살아 있다
    await rows(scr).first().locator('[col-id="downloadCell"] button').click(); await wait(1500);
    out.downloadMsg = (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' ');
    // 삭제 → 확인 창 문구 → 아니오(삭제하지 않음)
    await rows(scr).first().locator('[col-id="deleteCell"] button').click(); await wait(600);
    out.confirm = (await p.locator('.ant-modal-confirm').last().innerText()).replace(/\s+/g, ' ');
    await p.locator('.ant-modal-confirm-btns button').first().click(); await wait(600);
    // 일괄삭제 → 아무 일도 없다
    await btn(scr, /일\s*괄\s*삭\s*제/).click(); await wait(800);
    out.afterBulk = { modal: await p.locator('.ant-modal-confirm').count(), msgs: await p.locator('.ant-message-notice').count() };
    // 조회 → 그대로
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(3000);
    out.rowsAfterRetrieve = await rows(scr).count();
    out.deleteRequests = delCalls;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/A17-err.png` }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
