// A26 연차휴가 결산기준(1036, 고객사 관리자 kfstest) 화면 확인. 시험 행 근속연수 99/연차 1을 등록→저장→삭제하고, 휴가초과허용여부는 바꿨다가 원래대로 저장한다.
// 실패하면 부른 쪽이 `yunhee sql`로 sys30_leave_year(28000, year=99)를 보고 API DELETE로 지우고 sys01_leave_yn을 원래(true, 12월)로 PUT 한다.
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=<playwright-core 상위 node_modules> node tools/screens/A26.js <스크린샷 폴더>'"
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
    const item = p.getByText('연차휴가 결산기준', { exact: true }).first();
    if (!(await item.isVisible())) { await p.getByText('경영관리', { exact: true }).first().click(); await wait(500); }
    if (!(await item.isVisible())) { await p.getByText('02. 휴가/출장 관리', { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(3000);
    const scr = tab();
    const grids = scr.locator('.ag-root-wrapper');
    const left = grids.nth(0), right = grids.nth(1);
    const rrows = () => right.locator('.ag-row[row-index]');
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.leftHeaders = (await left.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.rightHeaders = (await right.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.leftRow = (await left.locator('.ag-row[row-index]').first().innerText()).replace(/\s+/g, ' ');
    out.leftChecked = await left.locator('[col-id="leaveYn"] input[type=checkbox]').first().isChecked();
    out.rightOnOpen = await rrows().count();
    out.rightFirst = (await rrows().first().innerText()).replace(/\s+/g, ' ');
    await p.screenshot({ path: `${OUT}/A26-1.png` });
    // 행 추가 → 근속연수 99, 연차개수 1 → 저장 → 서버 값으로 교체
    await btn(scr, /행\s*추\s*가/).click(); await wait(500);
    await p.keyboard.type('99'); await p.keyboard.press('Tab'); await wait(200);
    await p.keyboard.type('1'); await p.keyboard.press('Enter'); await wait(300);
    out.saveLabelDirty = (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, '');
    await btn(scr, /^\s*저\s*장/).click(); await wait(1500);
    out.saveMsg = await msgs();
    out.rightAfterSave = await rrows().count();
    // 삭제: 99행 체크 → 행 삭제 (확인 창 없음)
    const row99 = right.locator('.ag-row[row-index]').filter({ hasText: '99' }).first();
    out.row99 = (await row99.count()) ? (await row99.innerText()).replace(/\s+/g, ' ') : null;
    await row99.locator('input[type=checkbox]').first().check(); await wait(200);
    await btn(scr, /행\s*삭\s*제/).click(); await wait(1500);
    out.rightAfterDelete = await rrows().count();
    out.confirmModal = await p.locator('.ant-modal-confirm').count();
    // 휴가초과허용여부: 바꾸고 저장 → 다시 바꿔 저장(원래대로)
    const chk = left.locator('[col-id="leaveYn"] input[type=checkbox]').first();
    await chk.click(); await wait(300);
    out.leftAfterToggle = await chk.isChecked();
    out.saveLabelAfterToggle = (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, '');
    await btn(scr, /^\s*저\s*장/).click(); await wait(1500);
    await chk.click(); await wait(300);
    await btn(scr, /^\s*저\s*장/).click(); await wait(1500);
    out.leftRestored = await chk.isChecked();
    // 조회 → 서버 값과 같은지
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
    out.leftAfterReload = await left.locator('[col-id="leaveYn"] input[type=checkbox]').first().isChecked();
    out.writes = writes;
    await p.screenshot({ path: `${OUT}/A26-2.png` });
  } catch (e) { out.error = String(e).slice(0, 400); try { await p.screenshot({ path: `${OUT}/A26-err.png` }); } catch (_) {} }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
