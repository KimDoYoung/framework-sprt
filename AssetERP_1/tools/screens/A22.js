// A22 Admin 사용자 관리(1197) 화면 확인. admin 테넌트 admin. 시험 행(테스트행)을 등록→수정→삭제까지 하고 실패해도 cleanup(API) 한다.
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=<playwright-core 상위 node_modules> node tools/screens/A22.js <스크린샷 폴더>'"
const { BASE, launch } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const rows = scr => scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
  const btn = (scr, re) => scr.locator('button').filter({ hasText: re }).first();
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await wait(2500);
    const item = p.getByText('Admin 사용자 관리', { exact: true }).first();
    if (!(await item.isVisible())) { await p.getByText('관리자', { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(3000);
    const scr = tab();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.rows = await rows(scr).count();
    out.firstRow = (await rows(scr).first().innerText()).replace(/\s+/g, ' ');
    // 헤더 클릭 → 정렬 없음
    await scr.locator('.ag-header-cell').filter({ hasText: '성명' }).first().click(); await wait(300);
    out.sortedIcon = await scr.locator('.ag-header-icon.ag-sort-ascending-icon:visible, .ag-sort-indicator-icon:visible').count();
    await p.screenshot({ path: `${OUT}/A22-1.png` });
    // 등록 → 새 행 (저장(n)은 0 — 빈 행은 변경이 아니다)
    await btn(scr, /^\s*등\s*록\s*$/).click(); await wait(500);
    out.afterAdd = { rows: await rows(scr).count(), saveLabel: (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, '') };
    // 휴대폰 → 성명 → 비고 입력 (등록 직후 편집 시작)
    await p.keyboard.type('000-0000-0000'); await p.keyboard.press('Tab'); await p.keyboard.type('QQ테스트'); await p.keyboard.press('Tab'); await p.keyboard.type('시험행'); await p.keyboard.press('Enter'); await wait(500);
    out.afterType = { saveLabel: (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, '') };
    await p.screenshot({ path: `${OUT}/A22-2.png` });
    await btn(scr, /저\s*장/).click(); await wait(2000);
    out.afterSave = { rows: await rows(scr).count(), saveLabel: (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, ''), text: (await scr.locator('.ag-root-wrapper').first().innerText()).includes('테스트') };
    // 조회 → 시험 행 유지
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
    out.afterRetrieve = await rows(scr).count();
    // 삭제: 시험 행 체크 → 확인 창 문구 → 예
    const test = scr.locator('.ag-row[row-index]').filter({ hasText: '테스트' }).first();
    await test.locator('input[type=checkbox]').first().click(); await wait(300);
    await btn(scr, /^\s*삭\s*제\s*$/).click(); await wait(600);
    out.confirm = (await p.locator('.ant-modal-confirm-content, .ant-modal-body').last().innerText()).replace(/\s+/g, ' ');
    await p.screenshot({ path: `${OUT}/A22-3.png` });
    await p.locator('.ant-modal-confirm-btns button').last().click(); await wait(1500);
    out.afterDelete = await rows(scr).count();
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/A22-err.png` }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
