// A25 거래처 등록(1146, 고객사 관리자 kfstest — 이 DB에서 kfstest에는 1146만, admin 회사(0)에는 1155만 켜져 있다) 화면 확인. 시험 거래처 "ZZ-A25시험"을 등록→계좌 추가→저장→계좌 삭제→거래처 삭제까지 하고 모두 지운다.
// 실패하면 부른 쪽이 `yunhee sql`로 sys15_corp_nm like 'ZZ-A25%' 행을 보고 API DELETE로 지운다(kfstest).
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=<playwright-core 상위 node_modules> node tools/screens/A25.js <스크린샷 폴더>'"
const { launch, login } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const btn = (scr, re) => scr.locator('button').filter({ hasText: re }).first();
  const msgs = async () => (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' ');
  const writes = [];
  p.on('request', r => { if (['PUT', 'POST', 'DELETE'].includes(r.method()) && r.url().includes('/api/v1/sys/')) writes.push(r.method() + ' ' + r.url().split('/api/v1/sys/')[1].split('?')[0]); });
  try {
    await login(p, 'kfstest');
    const item = p.getByText('거래처 등록', { exact: true }).first();
    if (!(await item.isVisible())) { await p.getByText('관리자', { exact: true }).first().click(); await wait(500); }
    if (!(await item.isVisible())) { await p.getByText('09. 기타', { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(3000);
    const scr = tab();
    const grid = scr.locator('.ag-root-wrapper').first();
    const rows = () => grid.locator('.ag-row[row-index]');
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await grid.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.rowsOnOpen = await rows().count();      // 원본은 열 때 조회하지 않는다 → 0
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(2000);
    out.rowsAfterSearch = await rows().count();
    out.firstRow = (await rows().first().innerText()).replace(/\s+/g, ' ');
    out.selectedFirst = await grid.locator('.ag-row-selected').count();
    // 지제이텍(계좌 5건) 선택 → 편집 칸·계좌 그리드
    await scr.locator('input.ant-input').nth(0).fill('지제이텍'); await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
    out.rowsGj = await rows().count();
    out.editName = await scr.locator('label:has-text("거래처명")').locator('xpath=following-sibling::div//input').inputValue();
    const accGrid = scr.locator('.ag-root-wrapper').nth(1);
    out.accountHeaders = (await accGrid.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.accountRows = await accGrid.locator('.ag-row[row-index]').count();
    out.accountFirst = (await accGrid.locator('.ag-row[row-index]').first().innerText()).replace(/\s+/g, ' ');
    await p.screenshot({ path: `${OUT}/A25-1.png` });
    // 삭제: 미선택 알림은 선택 행이 없을 때만 → 사용중 거래처 삭제 시도(확인 창 → 예 → 오류 문구)
    await btn(scr, /^\s*삭\s*제\s*$/).click(); await wait(500);
    out.confirmText = (await p.locator('.ant-modal-confirm').innerText()).replace(/\s+/g, ' ');
    await p.locator('.ant-modal-confirm button').filter({ hasText: /아니오/ }).click(); await wait(300);
    // 시험 거래처 등록
    await btn(scr, /^\s*등\s*록\s*$/).click(); await wait(600);
    out.rowsAfterInsert = await rows().count();
    out.newType = await scr.locator('label:has-text("거래처구분")').locator('xpath=following-sibling::div').innerText();
    const name = scr.locator('label:has-text("거래처명")').locator('xpath=following-sibling::div//input');
    await name.fill('ZZ-A25시험');
    await scr.locator('label:has-text("사업자번호")').locator('xpath=following-sibling::div//input').fill('9998877665');
    // 계좌 추가는 저장 전에도 되지만 corpId가 없어 막힌다
    await btn(scr, /행\s*추\s*가/).click(); await wait(400);
    out.addRowWarnNew = await msgs();
    await btn(scr, /^\s*저\s*장\s*$/).click(); await wait(1500);
    out.saveMsg = await msgs();
    out.savedBizNo = await scr.locator('label:has-text("사업자번호")').locator('xpath=following-sibling::div//input').inputValue();
    out.savedCode = await scr.locator('label:has-text("거래처코드")').locator('xpath=following-sibling::div//input').inputValue();
    // 계좌 행 추가 → 은행·번호·예금주 입력 → 저장
    await btn(scr, /행\s*추\s*가/).click(); await wait(500);
    await accGrid.locator('.ag-row[row-index]').first().locator('[col-id="accountNoDec"]').dblclick(); await wait(200);
    await p.keyboard.type('111-222-333'); await p.keyboard.press('Enter'); await wait(300);
    await accGrid.locator('.ag-row[row-index]').first().locator('[col-id="accountName"]').dblclick(); await wait(200);
    await p.keyboard.type('시험예금주'); await p.keyboard.press('Enter'); await wait(300);
    await btn(scr, /^\s*저\s*장\s*$/).click(); await wait(2000);
    out.accountsSaved = await accGrid.locator('.ag-row[row-index]').count();
    // 대표계좌 두 개 → 막힘
    await btn(scr, /행\s*추\s*가/).click(); await wait(500);
    const checks = accGrid.locator('[col-id="mainAccountYn"] input[type=checkbox]');
    out.mainChecks = await checks.count();
    for (let i = 0; i < await checks.count(); i++) await checks.nth(i).check();
    await wait(200);
    await accGrid.locator('.ag-row[row-index]').last().locator('[col-id="accountNoDec"]').dblclick(); await wait(200);
    await p.keyboard.type('444'); await p.keyboard.press('Enter'); await wait(300);
    await btn(scr, /^\s*저\s*장\s*$/).click(); await wait(800);
    out.mainWarn = await msgs();
    await p.screenshot({ path: `${OUT}/A25-2.png` });
    // 새 행·계좌 정리: 조회로 버리고 → 계좌 삭제(행 삭제 + 저장) → 거래처 삭제
    await scr.locator('input.ant-input').nth(0).fill('ZZ-A25'); await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
    out.rowsZz = await rows().count();
    await wait(800);
    out.accountsAfterReload = await accGrid.locator('.ag-row[row-index]').count();
    await accGrid.locator('.ag-row[row-index] input[type=checkbox]').first().check(); await wait(200);
    await btn(scr, /행\s*삭\s*제/).click(); await wait(400);
    out.accountsAfterRemove = await accGrid.locator('.ag-row[row-index]').count();
    await btn(scr, /^\s*저\s*장\s*$/).click(); await wait(2000);
    await btn(scr, /^\s*삭\s*제\s*$/).click(); await wait(500);
    await p.locator('.ant-modal-confirm button').filter({ hasText: /^\s*예\s*$/ }).click(); await wait(1500);
    out.deleteMsg = await msgs();
    out.rowsAfterDelete = await rows().count();
    out.writes = writes;
  } catch (e) { out.error = String(e).slice(0, 400); try { await p.screenshot({ path: `${OUT}/A25-err.png` }); } catch (_) {} }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
