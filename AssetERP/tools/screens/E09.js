// E09 법규등록신청확인(Ics17_Tab_UserRequestAdmin #1339 + Ics17_Edit_UserRequestAdmin + Ics17_Lookup_LawContent + Ics17_Grid_FileList) 화면 확인.
// 기존 요청은 열어 보기만 하고 저장은 같은 값으로만 한다. 서식파일은 시험 파일(E09시험.txt) 하나를 올렸다가 지운다.
// 실패해서 남으면 마지막 줄 created를 보고 파일을 화면에서 지운다(sys10_file의 parent_id = 요청 ID).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E09.js <스크린샷 폴더> [회사]
const fs = require('fs');
const { launch, login, openMenu } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [], gets = [];
  p.on('response', r => {
    const u = r.url();
    if (!u.includes('/api/v1/ics/user-requests') && !u.includes('/api/v1/sys/files') && !u.includes('/api/v1/sys/companies')) return;
    const m = r.request().method();
    const pathq = decodeURIComponent(u.split('/api/v1/')[1]);
    if (['PUT', 'POST', 'DELETE'].includes(m)) writes.push(m + ' ' + pathq + ' ' + r.status()); else gets.push(pathq);
  });
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const btn = (scope, re) => scope.locator('button').filter({ hasText: re }).first();
  const rowsOf = g => g.locator('.ag-row[row-index]').count();
  const TMP = '/tmp/claude-1000/E09시험.txt';
  fs.writeFileSync(TMP, 'E09 시험 파일');
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '법규등록신청확인');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(2500);
    const panels = scr.locator('.ant-splitter-panel');
    const top = panels.nth(0), bot = panels.nth(1);
    const grid = top.locator('.ag-root-wrapper').first();
    out.buttonsTop = (await top.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.buttonsBot = (await bot.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await grid.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.checkboxes = (await top.locator('.ant-checkbox-wrapper').allInnerTexts()).join('|');
    out.placeholder = await top.locator('input[placeholder*=법규명]').getAttribute('placeholder');
    out.getsOpen = gets.slice();
    out.rowsOpen = await rowsOf(grid);
    out.editDisabledOpen = await bot.locator('button').filter({ hasText: /저\s*장/ }).first().isDisabled();
    await p.screenshot({ path: `${OUT}/E09-open.png` });

    // 체크 풀고 조회 → 전체(발생일은 올해라 0건일 수 있어 시작일을 2024로)
    await top.locator('.ant-checkbox-wrapper').nth(0).click(); await top.locator('.ant-checkbox-wrapper').nth(1).click();
    const dates = top.locator('.ant-picker input');
    await dates.nth(0).click(); await dates.nth(0).fill('2024-01-01'); await p.keyboard.press('Enter'); await wait(400);
    await btn(top, /조\s*회/).click(); await wait(1800);
    out.rowsAll = await rowsOf(grid);
    out.getsAll = gets.slice(-1);
    out.firstRow = (await grid.locator('.ag-row[row-index="0"]').innerText()).replace(/\s+/g, ' ');
    out.editDisabledAfter = await bot.locator('button').filter({ hasText: /저\s*장/ }).first().isDisabled();
    out.regDate = await bot.locator('input[readonly]').first().inputValue();
    out.lawTitle = await bot.locator('input[readonly]').nth(2).inputValue();
    out.fileHeaders = (await bot.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    await p.screenshot({ path: `${OUT}/E09-all.png` });

    // [E5] 법규내용 눌러 팝업(읽기 전용, 닫기만)
    await bot.locator('a', { hasText: '법규내용' }).dispatchEvent('mousedown'); await wait(800);
    const lm = p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: '법규내용' }) }).last();
    out.lawModalButtons = (await lm.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.lawReadonly = await lm.locator('textarea').first().getAttribute('readonly');
    await p.screenshot({ path: `${OUT}/E09-law.png` });
    await btn(lm, /닫\s*기/).click(); await wait(500);

    // [E4] 같은 값으로 저장 → PUT 200
    await btn(bot, /^\s*저\s*장\s*$/).click(); out.msgSave = await msgs(); await wait(1200);

    // [E3][E1][E2] 시험 파일 올리기 → 서식파일에 나타남 → 지우기
    const fileBefore = await rowsOf(bot.locator('.ag-root-wrapper').first());
    await bot.locator('input[type=file]').setInputFiles(TMP); await wait(2000);
    const fg = bot.locator('.ag-root-wrapper').first();
    out.filesBefore = fileBefore;
    out.filesAfterUpload = (await fg.locator('.ag-row[row-index]').allInnerTexts()).map(t => t.replace(/\s+/g, ' '));
    await p.screenshot({ path: `${OUT}/E09-upload.png` });
    const trow = fg.locator('.ag-row[row-index]').filter({ hasText: 'E09시험' }).first();
    await trow.locator('.ag-cell[col-id="deleteCell"]').click(); await wait(500);
    out.fileDelConfirm = await p.locator('.ant-modal-confirm:visible .ant-modal-confirm-content').allInnerTexts();
    await p.locator('.ant-modal-confirm .ant-btn-primary').click(); await wait(2000);
    out.filesAfterDelete = await rowsOf(fg);

    // 검색어: 없는 말 → 0건
    await top.locator('input[placeholder*=법규명]').fill('없는검색어zzz'); await top.locator('input[placeholder*=법규명]').press('Enter'); await wait(1500);
    out.rowsNoMatch = await rowsOf(grid);
    out.editDisabledNoRow = await bot.locator('button').filter({ hasText: /저\s*장/ }).first().isDisabled();
    out.writes = writes;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E09-err.png` }).catch(() => {});
    out.writes = writes;
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
