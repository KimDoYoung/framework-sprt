// E10 회사규정관리(Bbs15_Tab_CompanyRuleManager #1483 + Bbs15_Edit_CompanyRuleManager + Bbs15_Lookup_File) 화면 확인.
// 시험 회사규정(코드 ZZE1x)을 만들었다가 끝에 모두 지운다(화면 삭제 + 남은 것은 fetch로 정리). 시험 파일은 규정 첨부파일 창에서 올렸다가 지운다.
// 엑셀업로드는 EXCEL 환경변수의 xlsx(ZZE11·ZZE12 두 행)를 올린다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules EXCEL=<xlsx> node tools/screens/E10.js <스크린샷 폴더> [회사]
const fs = require('fs');
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [], gets = [];
  p.on('response', r => {
    const u = r.url();
    if (!u.includes('/api/v1/bbs/company-rules') && !u.includes('/api/v1/sys/files')) return;
    const m = r.request().method();
    const pathq = decodeURIComponent(u.split('/api/v1/')[1]);
    if (['PUT', 'POST', 'DELETE'].includes(m)) writes.push(m + ' ' + pathq + ' ' + r.status()); else gets.push(pathq);
  });
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const btn = (scope, re) => scope.locator('button').filter({ hasText: re }).first();
  const rowsOf = g => g.locator('.ag-row[row-index]').count();
  const TMP = '/tmp/claude-1000/E10시험.txt';
  fs.writeFileSync(TMP, 'E10 시험 파일');
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '회사규정관리');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(2500);
    const grid = scr.locator('.ag-root-wrapper').first();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await grid.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.placeholder = await scr.locator('input[placeholder*=규정명]').getAttribute('placeholder');
    out.companyField = await scr.locator('input[readonly]').first().inputValue();
    out.getsOpen = gets.slice();
    out.rowsOpen = await rowsOf(grid);
    out.gridCheck = await checkGrid(p, scr);
    out.gridOk = gridOk(out.gridCheck);
    await btn(scr, /조\s*회/).click(); await wait(1500);
    await p.screenshot({ path: `${OUT}/E10-open.png` });

    // 구분 콤보 → 조회, 없는 검색어 → 0건
    await scr.locator('input[placeholder*=규정명]').fill('없는검색어zzz'); await scr.locator('input[placeholder*=규정명]').press('Enter'); await wait(1500);
    out.rowsNoMatch = await rowsOf(grid);
    await scr.locator('input[placeholder*=규정명]').fill(''); await btn(scr, /조\s*회/).click(); await wait(1500);

    // [E7] 등록(복사): 선택 없음 → 메시지
    await btn(scr, /등록\(복사\)/).click(); out.msgCopyNone = await msgs(); await wait(1500);

    // [E5] 등록
    await btn(scr, /^\s*등\s*록\s*$/).click(); await wait(1500);
    const m = p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: '회사규정' }) }).last();
    out.editButtons = (await m.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.fileBtnInit = (await m.locator('button', { hasText: '첨부파일' }).innerText()).replace(/\s/g, '');
    // 필수 검사 메시지 순서
    await btn(m, /^\s*저\s*장\s*$/).click(); out.msgV1 = await msgs(); await wait(2800);
    await m.locator('.ant-select').first().click(); await wait(500);
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option').nth(0).click(); await wait(300);
    out.ruleTypeText = (await m.locator('.ant-select-selection-item').first().innerText()).trim();
    await btn(m, /^\s*저\s*장\s*$/).click(); out.msgV2 = await msgs(); await wait(2800);
    const inputs = m.locator('input.ant-input, .ant-input-number-input');
    await m.locator('input.ant-input').nth(0).fill('ZZE10S');
    await btn(m, /^\s*저\s*장\s*$/).click(); out.msgV3 = await msgs(); await wait(2800);
    const dates = m.locator('.ant-picker input');
    await dates.nth(1).click(); await dates.nth(1).fill('2026-10-17'); await p.keyboard.press('Enter'); await wait(300);
    await m.locator('.ant-input-number-input').fill('1');
    await btn(m, /^\s*저\s*장\s*$/).click(); out.msgV4 = await msgs(); await wait(2800);
    await m.locator('input.ant-input').nth(1).fill('E10시험 규정');
    await m.locator('.tiptap').click(); await p.keyboard.type('시험 내용'); 
    await m.locator('textarea').fill('시험 비고');
    await p.screenshot({ path: `${OUT}/E10-edit.png` });

    // 첨부파일 창: 올리고 → 지운다
    await m.locator('button', { hasText: '첨부파일' }).click(); await wait(1000);
    const fm = p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: '첨부파일' }) }).last();
    out.fileModalButtons = (await fm.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.fileHeaders = (await fm.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    await fm.locator('input[type=file]').setInputFiles(TMP); await wait(2000);
    const fg = fm.locator('.ag-root-wrapper').first();
    out.filesAfterUpload = (await fg.locator('.ag-row[row-index]').allInnerTexts()).map(t => t.replace(/\s+/g, ' '));
    await p.screenshot({ path: `${OUT}/E10-file.png` });
    // 삭제 아이콘(확인 창 없음) → 목록에서 사라짐
    await fg.locator('.ag-row', { hasText: 'E10시험' }).locator('.ag-cell[col-id="deleteCell"]').click(); await wait(1500);
    out.filesAfterDelete = await rowsOf(fg);
    await fm.locator('input[type=file]').setInputFiles(TMP); await wait(2000);
    out.filesReupload = await rowsOf(fg);
    await btn(fm, /닫\s*기/).click(); await wait(1500);
    out.fileBtnAfterUpload = (await m.locator('button', { hasText: '첨부파일' }).innerText()).replace(/\s/g, '');

    // 저장
    await btn(m, /^\s*저\s*장\s*$/).click(); out.msgSave = await msgs(); await wait(2500);
    out.rowAfterSave = (await grid.locator('.ag-row', { hasText: 'ZZE10S' }).first().innerText()).replace(/\s+/g, ' ');
    out.getsAfterSave = gets.slice(-1);

    // 같은 코드·회차 한 번 더 → 사용중 메시지 (등록(복사): 시험 행 선택)
    const row = grid.locator('.ag-row', { hasText: 'ZZE10S' }).first();
    await row.locator('.ag-selection-checkbox input').click({ force: true }); await wait(300);
    await btn(scr, /등록\(복사\)/).click(); await wait(1500);
    const m2 = p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: '회사규정' }) }).last();
    out.copyCode = await m2.locator('input.ant-input').nth(0).inputValue();
    out.copyTitle = await m2.locator('input.ant-input').nth(1).inputValue();
    out.copyDate = await m2.locator('.ant-picker input').nth(1).inputValue();
    out.copyRevNo = await m2.locator('.ant-input-number-input').inputValue();
    out.copyPublic = await m2.locator('.ant-checkbox-input').first().isChecked();
    await m2.locator('.ant-picker input').nth(1).click(); await m2.locator('.ant-picker input').nth(1).fill('2026-10-18'); await p.keyboard.press('Enter'); await wait(300);
    await btn(m2, /^\s*저\s*장\s*$/).click(); out.msgCopyDup = await msgs(); await wait(2800);
    await btn(m2, /닫\s*기/).click(); await wait(800);

    // 수정: 시험 행의 수정 아이콘 → 제목 변경 → 저장
    const rowIdx = await row.getAttribute('row-index');
    const scrollRight = () => grid.locator('.ag-body-horizontal-scroll-viewport').evaluate(el => { el.scrollLeft = el.scrollWidth; });
    await scrollRight(); await wait(500);
    out.headersRight = (await grid.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    await grid.locator(`.ag-row[row-index="${rowIdx}"] .ag-cell[col-id="actionCell"]`).click(); await wait(1500);
    const m3 = p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: '회사규정' }) }).last();
    out.editFileBtn = (await m3.locator('button', { hasText: '첨부파일' }).innerText()).replace(/\s/g, '');
    out.editTitle = await m3.locator('input.ant-input').nth(1).inputValue();
    out.editContent = (await m3.locator('.tiptap').innerText()).trim();
    // 수정 창에서 첨부파일 창을 열어 시험 파일을 지운다 (보기·다운로드 아이콘도 확인)
    await m3.locator('button', { hasText: '첨부파일' }).click(); await wait(1000);
    const fm2 = p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: '첨부파일' }) }).last();
    out.editFileRows = await rowsOf(fm2.locator('.ag-root-wrapper').first());
    const [fdl] = await Promise.all([p.waitForEvent('download', { timeout: 15000 }).catch(() => null), fm2.locator('.ag-row', { hasText: 'E10시험' }).locator('.ag-cell[col-id="downloadCell"]').click()]);
    out.fileDownloadName = fdl ? fdl.suggestedFilename() : null;
    await fm2.locator('.ag-row', { hasText: 'E10시험' }).locator('.ag-cell[col-id="deleteCell"]').click(); await wait(1500);
    out.editFileRowsAfterDelete = await rowsOf(fm2.locator('.ag-root-wrapper').first());
    await btn(fm2, /닫\s*기/).click(); await wait(1500);
    out.editFileBtnAfterDelete = (await m3.locator('button', { hasText: '첨부파일' }).innerText()).replace(/\s/g, '');
    await m3.locator('input.ant-input').nth(1).fill('E10시험 규정(수정)');
    await btn(m3, /^\s*저\s*장\s*$/).click(); out.msgUpdate = await msgs(); await wait(2500);
    await scrollRight(); await wait(300);
    out.rowAfterUpdateRight = (await grid.locator(`.ag-row[row-index="${rowIdx}"]`).allInnerTexts()).join(' / ').replace(/\s+/g, ' ');
    await grid.locator('.ag-body-horizontal-scroll-viewport').evaluate(el => { el.scrollLeft = 0; }); await wait(300);
    out.rowAfterUpdate = (await grid.locator('.ag-row', { hasText: 'ZZE10S' }).first().innerText()).replace(/\s+/g, ' ');

    // 엑셀다운로드
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 15000 }), btn(scr, /엑셀다운로드/).click()]);
    out.downloadName = dl.suggestedFilename();
    const dlPath = `${OUT}/E10-download.xlsx`; await dl.saveAs(dlPath); out.downloadSize = fs.statSync(dlPath).size;

    // 엑셀업로드 (EXCEL 환경변수)
    if (process.env.EXCEL) {
      await scr.locator('input[type=file]').setInputFiles(process.env.EXCEL); out.msgExcel = await msgs(); await wait(1500);
      await btn(scr, /조\s*회/).click(); await wait(1500);
      out.excelRows = (await grid.locator('.ag-row', { hasText: /ZZE1[12]/ }).allInnerTexts()).map(t => t.replace(/\s+/g, ' '));
    }

    // [E10] 내보내기: 선택 없음 → 메시지, 있으면 고객사 조회창만 열고 취소 (실제 복사는 API로 확인)
    // 선택된 행이 있으면 고객사 조회창이 열린다 → 취소 (실제 복사는 API로 확인)
    await btn(scr, /내보내기/).click(); await wait(1200);
    out.pushCompanyModal = await p.locator('.ant-modal:visible .ant-modal-title').allInnerTexts();
    await p.locator('.ant-modal:visible button').filter({ hasText: /취\s*소/ }).first().click(); await wait(800);
    // 선택을 풀면 메시지
    await grid.locator(`.ag-row[row-index="${rowIdx}"] .ag-selection-checkbox input`).first().click({ force: true }); await wait(300);
    await btn(scr, /내보내기/).click(); out.msgPushNone = await msgs(); await wait(2800);

    // 삭제: 시험 행 모두 선택 → 확인 문구 → 삭제
    await p.screenshot({ path: `${OUT}/E10-before-delete.png` });
    const testRows = grid.locator('.ag-row', { hasText: /ZZE1/ });
    const n = await testRows.count();
    for (let i = 0; i < n; i++) {
      const cb = testRows.nth(i).locator('.ag-selection-checkbox input');
      if (!(await testRows.nth(i).evaluate(el => el.classList.contains('ag-row-selected')))) await cb.click({ force: true });
    }
    out.testRows = n;
    await btn(scr, /^\s*삭\s*제\s*$/).click(); await wait(500);
    out.deleteConfirm = await p.locator('.ant-modal-confirm:visible .ant-modal-confirm-content').allInnerTexts();
    await p.locator('.ant-modal-confirm .ant-btn-primary').click(); await wait(2000);
    out.rowsAfterDelete = await grid.locator('.ag-row', { hasText: /ZZE1/ }).count();
    out.writes = writes;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E10-err.png` }).catch(() => {});
    out.writes = writes;
  } finally {
    // 남은 시험 행 정리 (화면 삭제가 실패했을 때)
    out.cleanup = await p.evaluate(async () => {
      const base = location.origin + '/AssetERP/api/v1/bbs/company-rules';
      const tok = document.cookie;
      const list = await (await fetch(base + '?ruleType=%25&searchText=ZZE1', { credentials: 'include' })).json().catch(() => null);
      const ids = (list?.data ?? []).filter(r => (r.companyRuleCode || '').startsWith('ZZE1')).map(r => r.companyRuleId);
      if (!ids.length) return 'none';
      for (const id of ids) {
        const files = await (await fetch(location.origin + '/AssetERP/api/v1/sys/files?parentId=' + id, { credentials: 'include' })).json().catch(() => null);
        for (const f of files?.data ?? []) await fetch(location.origin + '/AssetERP/api/v1/sys/files/' + f.fileId, { method: 'DELETE', credentials: 'include' });
      }
      const res = await fetch(base, { method: 'DELETE', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ids) });
      return 'deleted ' + ids.length + ' ' + res.status;
    }).catch(e => 'cleanup-error ' + e.message);
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
