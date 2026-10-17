// E08 임직원매매 종목유형관리(Flt05_Tab_ItemTypeAdmin #1267) 화면 확인.
// 시험 종목유형 1개(ZZ/E08시험)를 admin 회사에 만들고, 한국펀드서비스로 복사한 뒤 둘 다 지운다. 기존 데이터는 열어 보기만 한다.
// 실패해서 남으면 마지막 줄 created를 보고 `yunhee api DELETE /api/v1/flt/item-types [-p companyId=…] -b '[id]'`로 지운다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E08.js <스크린샷 폴더> [회사]
const { launch, login, openMenu } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, steps: {} };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  const gets = [];
  p.on('response', r => {
    const u = r.url();
    if (!u.includes('/api/v1/flt/') && !u.includes('/api/v1/sys/companies')) return;
    const m = r.request().method();
    const pathq = decodeURIComponent(u.split('/api/v1/')[1]);
    if (['PUT', 'POST', 'DELETE'].includes(m)) writes.push(m + ' ' + pathq + ' ' + r.status()); else gets.push(pathq);
  });
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const btn = (scope, re, n = 0) => scope.locator('button').filter({ hasText: re }).nth(n);
  const rows = g => g.locator('.ag-row[row-index]').count();
  const rowsText = async g => (await g.locator('.ag-row[row-index]').allInnerTexts()).map(t => t.replace(/\s+/g, ' '));
  const confirmText = () => p.locator('.ant-modal-confirm:visible .ant-modal-confirm-title, .ant-modal-confirm:visible .ant-modal-confirm-content').allInnerTexts().then(a => a.join(' / ').replace(/\s+/g, ' '));
  const confirmYes = async () => { await p.locator('.ant-modal-confirm .ant-btn-primary').click(); await wait(2000); };
  const created = [];
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '임직원매매 종목유형관리');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(2000);
    const panels = scr.locator('.ant-splitter-panel');
    const L = panels.nth(0), R = panels.nth(1);
    const gl = L.locator('.ag-root-wrapper').first(), gr = R.locator('.ag-root-wrapper').first();
    out.buttonsL = (await L.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.buttonsR = (await R.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headersL = (await gl.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.headersR = (await gr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.checkboxL = await gl.locator('.ag-header-select-all, .ag-selection-checkbox').count() > 0;
    out.checkboxR = await gr.locator('.ag-selection-checkbox').count() > 0;
    out.getsOpen = gets.slice();
    out.rowsL = await rows(gl);
    out.rowsROpen = await rows(gr);
    await p.screenshot({ path: `${OUT}/E08-open.png` });

    // [E11] 선택 0건 삭제 → 안내
    await btn(L, /^\s*삭\s*제\s*$/).click(); out.msgDelNoSelL = await msgs(); await wait(2800);
    // [E8] 고객사 없이 조회·등록·등록(복사) → 안내
    await btn(R, /^\s*조\s*회\s*$/).click(); out.msgRetNoCo = await msgs(); await wait(2800);
    await btn(R, /^\s*등\s*록\s*$/).click(); out.msgInsNoCo = await msgs(); await wait(2800);
    await btn(R, /등록\(복사\)/).click(); out.msgCopyNoCo = await msgs(); await wait(2800);
    await btn(R, /^\s*삭\s*제\s*$/).click(); out.msgDelNoSelR = await msgs(); await wait(2800);

    // [E4][E5] 왼쪽 등록 → 코드 ZZ / 유형명 E08시험 → 저장
    await btn(L, /^\s*등\s*록\s*$/).click(); await wait(1200);
    await p.keyboard.type('ZZ'); await p.keyboard.press('Tab');
    await p.keyboard.type('E08시험'); await p.keyboard.press('Enter'); await wait(500);
    out.saveLabelL = (await btn(L, /저\s*장/).innerText()).replace(/\s/g, '');
    await btn(L, /저\s*장/).click(); await wait(1800);
    const found = (await rowsText(gl)).filter(t => t.includes('E08시험'));
    out.leftAfterSave = found;
    await p.screenshot({ path: `${OUT}/E08-saved.png` });
    // [E1] 검색 Enter
    const search = L.locator('input.ant-input').first();
    await search.fill('E08'); await search.press('Enter'); await wait(1500);
    out.rowsSearch = await rows(gl);
    out.getsSearch = gets.slice(-1);

    // [E2] 고객사 조회창 → 한국펀드서비스 선택
    await R.locator('input[readonly]').first().click(); await wait(1500);
    const lk = p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: '고객사 찾기' }) }).last();
    out.lookupRows = await lk.locator('.ag-row[row-index]').count();
    await lk.locator('input.ant-input').first().fill('한국펀드'); await lk.locator('input.ant-input').first().press('Enter'); await wait(1500);
    await lk.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click(); await wait(300);
    await lk.locator('button').filter({ hasText: /확\s*인/ }).first().click(); await wait(2000);
    out.companyField = await R.locator('input[readonly]').first().inputValue();
    out.rowsR = await rows(gr);
    out.getsAfterLookup = gets.slice(-1);

    // [E13] 왼쪽 시험 행 체크 → 등록(복사) → 오른쪽에 생김
    await gl.locator('.ag-row[row-index]').filter({ hasText: 'E08시험' }).first().locator('input[type=checkbox]').first().click(); await wait(300);
    await btn(R, /등록\(복사\)/).click(); out.msgCopy = await msgs(); await wait(1800);
    out.rightAfterCopy = (await rowsText(gr)).filter(t => t.includes('E08시험'));
    await p.screenshot({ path: `${OUT}/E08-copied.png` });

    // [E11][E12] 오른쪽 시험 행 선택 → 삭제 → 확인 문구 → 예
    await gr.locator('.ag-row[row-index]').filter({ hasText: 'E08시험' }).first().locator('.ag-cell').nth(2).click(); await wait(300);
    await btn(R, /^\s*삭\s*제\s*$/).click(); await wait(500);
    out.delConfirmR = await confirmText();
    await confirmYes();
    out.rightAfterDelete = (await rowsText(gr)).filter(t => t.includes('E08시험')).length;

    // [E6][E7] 왼쪽 시험 행 삭제
    // 복사할 때 체크한 채로 남아 있다 — 풀려 있을 때만 체크
    const cbL = gl.locator('.ag-row[row-index]').filter({ hasText: 'E08시험' }).first().locator('input[type=checkbox]').first();
    if (!(await cbL.isChecked())) { await cbL.click(); await wait(300); }
    await btn(L, /^\s*삭\s*제\s*$/).click(); await wait(500);
    out.delConfirmL = await confirmText();
    await confirmYes();
    out.leftAfterDelete = (await rowsText(gl)).filter(t => t.includes('E08시험')).length;
    out.writes = writes;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E08-err.png` }).catch(() => {});
    out.writes = writes;
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
