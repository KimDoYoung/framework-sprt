// E03 법규개정내역 등록(Ics20_Tab_RevisionHistoryAdmin #1257 + Ics20_Edit_RevisionHistoryAdmin + Ics01_Lookup_SelectMulti·SelectParent) 화면 확인.
// 시험 개정내역 1건(제목 E03시험)을 등록·연결법규 추가·파일 첨부·내용 팝업 저장 후, 마지막에 삭제 버튼·아이콘으로 모두 지운다. 기존 개정내역은 바꾸지 않는다(조회만).
// 실패해서 남으면 마지막 줄 leftover를 보고 `yunhee api GET /api/v1/ics/revision-history-admin -p startDate=2020-01-01 -p searchText=E03시험`으로 id를 찾아
// `DELETE /api/v1/ics/revision-history-admin/laws`(body [id…]) → 첨부는 `POST /sys/files/<id>/check-delete -p parentId=<개정내역id>` → `DELETE /sys/files/<id>` → `DELETE /api/v1/ics/revision-history-admin/<id>`.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E03.js <스크린샷 폴더> [회사]
const fs = require('fs');
const path = require('path');
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, steps: {} };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  const gets = [];
  p.on('request', r => {
    const u = r.url();
    if (!u.includes('/api/v1/ics/') && !u.includes('/api/v1/sys/files')) return;
    const pathq = decodeURIComponent(u.split('/api/v1/')[1]);
    if (['PUT', 'POST', 'DELETE'].includes(r.method())) writes.push(r.method() + ' ' + pathq);
    else gets.push(pathq);
  });
  let scr;
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const modal = title => p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: title }) }).last();
  const grids = () => scr.locator('.ag-root-wrapper');
  const grid = () => grids().first();
  const countRows = g => g.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const btn = (scope, re) => scope.locator('button').filter({ hasText: re }).first();
  const rowIndexOf = (g, text) => g.evaluate((el, t) => { const r = [...el.querySelectorAll('.ag-row[row-index]')].find(x => x.innerText.includes(t)); return r ? r.getAttribute('row-index') : null; }, text);
  const dir = path.join(OUT, 'files'); fs.mkdirSync(dir, { recursive: true });
  const f1 = path.join(dir, 'E03시험1.txt'); fs.writeFileSync(f1, 'E03 test 1\n');
  const ta = i => scr.locator('textarea').nth(i);   // 0 법규명, 1 조문, 2 내용
  const dates = () => scr.locator('.ant-picker input');   // 0 시작 1 끝 | 2 등록일 3 의견제출일 4 시행일 5 법규반영일
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '법규개정내역 등록');
    scr = p.locator('.flexlayout__tab:visible').last();
    await wait(1500);
    out.toolbarButtons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.toolbarH = await scr.locator('.ant-space').first().evaluate(el => Math.round(el.getBoundingClientRect().height));   // 한 줄이면 ~32
    out.radios = (await scr.locator('.ant-radio-wrapper').allInnerTexts()).join('|');
    out.radioChecked = await scr.locator('.ant-radio-wrapper-checked').innerText();
    out.dateDefaults = [await dates().nth(0).inputValue(), await dates().nth(1).inputValue()];   // 올해 1월 1일 − 24개월 ~ 오늘
    out.placeholders = await scr.locator('input[placeholder="소관부처/법규명/비고"], input[placeholder="관련조문"]').count();
    out.headers = (await grid().locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.getsOpen = gets.slice();                                    // [E0] revision-history-admin?… 1건 (+ 하위 laws·files)
    out.rowsOpen = await countRows(grid());
    out.grid = await checkGrid(p, scr); out.gridOk = gridOk(out.grid);
    out.firstRowSelected = await grid().locator('.ag-row-selected').count();
    out.editButtons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).slice(-6).join(',');
    out.formTitle = await ta(0).inputValue();                       // [E1] 선택 → 편집 폼
    out.gridsCount = await grids().count();                         // 법규 그리드 + 연결법규 + 첨부파일
    out.lawHeaders = (await grids().nth(1).locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.fileHeaders = (await grids().nth(2).locator('.ag-header-cell-text').allInnerTexts()).join('|');

    // [E5] 시행일 기준 조회, [E2][E3] 검색어 Enter
    await scr.locator('.ant-radio-wrapper', { hasText: '시행일' }).click();
    await btn(scr, /조\s*회/).click(); await wait(1000);
    out.rowsEffect = await countRows(grid());
    await scr.locator('input[placeholder="소관부처/법규명/비고"]').fill('E03없는내용xyz'); await p.keyboard.press('Enter'); await wait(1000);
    out.rowsNoMatch = await countRows(grid());
    await scr.locator('input[placeholder="소관부처/법규명/비고"]').fill('');
    await scr.locator('input[placeholder="관련조문"]').fill('E03없는조문xyz'); await p.keyboard.press('Enter'); await wait(1000);
    out.rowsNoLaw = await countRows(grid());
    await scr.locator('input[placeholder="관련조문"]').fill(''); await scr.locator('.ant-radio-wrapper', { hasText: '등록일' }).click();
    await btn(scr, /조\s*회/).click(); await wait(1000);
    out.rowsBack = await countRows(grid());
    out.resetBtn = await btn(scr, /초\s*기\s*화/).count();

    // [E4] 등록 → 새 행(등록일 오늘)이 맨 위에 생기고 선택, 폼이 비어 있다
    await btn(scr, /^\s*등\s*록\s*$/).click(); await wait(800);
    out.rowsAfterInsert = await countRows(grid());
    out.newRowSelected = await grid().locator('.ag-row-selected').count();
    out.newFormTitle = await ta(0).inputValue();
    out.newRegDate = await dates().nth(2).inputValue();

    // 폼 입력
    await ta(0).fill('E03시험'); await ta(1).fill('E03시험 조문'); await ta(2).fill('E03시험 내용');
    await scr.locator('.ant-select').nth(1).click(); await wait(300);   // 0 = 툴바 소관부처, 1 = 폼 소관부처
    out.agencyOptions = (await p.locator('.ant-select-dropdown:visible .ant-select-item-option').allInnerTexts()).join('|');
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option').first().click(); await wait(300);
    await dates().nth(4).click(); await dates().nth(4).fill('2026-12-01'); await p.keyboard.press('Enter'); await wait(300);

    // [E6] 연결법규 행 추가 → 법규 분류 조회창
    await btn(scr, /행\s*추가/).click(); await wait(1200);
    const sm = modal('법규 분류');
    out.lookupOpen = await sm.count();
    out.lookupPlaceholders = await sm.locator('input[placeholder="법규코드/법규명"], input[placeholder="관련조문"]').count();
    out.lookupBtns = (await sm.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.lookupRows = await countRows(sm.locator('.ag-root-wrapper').first());
    out.lookupHeaders = (await sm.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.lookupPaging = (await sm.locator('text=/전체 \\d+ 중/').first().innerText()).trim();
    out.lookupDetailChk = await sm.locator('.ant-checkbox-wrapper', { hasText: '상세내용 포함' }).count();
    // 확인 없이 → 안내
    await btn(sm, /^\s*확\s*인\s*$/).click(); out.lookupNoneMsg = await msgs();
    // 법규검색 Enter
    await sm.locator('input[placeholder="법규코드/법규명"]').fill('자산건전성'); await p.keyboard.press('Enter'); await wait(1200);
    out.lookupRowsSearch = await countRows(sm.locator('.ag-root-wrapper').first());
    out.lookupPagingSearch = (await sm.locator('text=/전체 \\d+ 중|표시할 데이터/').first().innerText()).trim();
    // 분류 칸 → 분류 선택 창 [전체] / 닫기
    await sm.locator('input[readonly]').first().click(); await wait(1000);
    const sp = modal('법규 분류');   // 두 번째 같은 제목 창
    out.parentOpen = await p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: '법규 분류' }) }).count();
    out.parentBtns = (await sp.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.parentRows = await countRows(sp.locator('.ag-root-wrapper').first());
    await btn(sp, /^\s*확\s*인\s*$/).click(); out.parentNoneMsg = await msgs();
    await sp.locator('.ant-modal-footer button').filter({ hasText: /닫\s*기/ }).click(); await wait(500);
    // 검색어 지우고 첫 법규 체크 → 확인 → 연결법규 그리드에 새 행
    await sm.locator('input[placeholder="법규코드/법규명"]').fill(''); await btn(sm, /^\s*검\s*색\s*$/).click(); await wait(1200);
    await sm.locator('.ag-root-wrapper').first().locator('.ag-row[row-index="0"] .ag-selection-checkbox input, .ag-row[row-index="0"] .ag-checkbox-input').first().click(); await wait(300);
    const lookupFirst = (await sm.locator('.ag-root-wrapper').first().locator('.ag-row[row-index="0"] .ag-cell[col-id="classTreeName"]').first().innerText()).trim();
    out.lookupFirst = lookupFirst;
    await btn(sm, /^\s*확\s*인\s*$/).click(); await wait(800);
    out.lookupClosed = (await p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: '법규 분류' }) }).count()) === 0;
    out.lawRowsAdded = await countRows(grids().nth(1));
    out.lawRowName = (await grids().nth(1).locator('.ag-row[row-index="0"] .ag-cell[col-id="classTreeName"]').innerText()).trim();

    // [E4 편집] 저장 → PUT + POST laws, 그리드 행이 새 id로 바뀐다
    const w0 = writes.length;
    await btn(scr, /^\s*저\s*장\s*$/).click(); await wait(2500);
    out.saveWrites = writes.slice(w0);
    out.rowsAfterSave = await countRows(grid());
    out.savedRowIdx = await rowIndexOf(grid(), 'E03시험');
    out.savedAgency = (await grid().locator(`.ag-row[row-index="${out.savedRowIdx}"] .ag-cell[col-id="financeAgencyName"]`).innerText()).trim();
    await grid().locator('.ag-body-horizontal-scroll-viewport').evaluate(el => { el.scrollLeft = 99999; }); await wait(300);
    out.savedIcsCount = (await grid().locator(`.ag-row[row-index="${out.savedRowIdx}"] .ag-cell[col-id="icsCount"]`).innerText()).trim();   // 원본처럼 저장 시점 값(0)
    out.formAfterSave = [await ta(0).inputValue(), await ta(2).inputValue()];
    out.lawRowsAfterSave = await countRows(grids().nth(1));

    // [E3] 파일등록 → 첨부 목록에 나타남
    const w1 = writes.length;
    const [chooser] = await Promise.all([p.waitForEvent('filechooser'), btn(scr, /파일등록/).click()]);
    out.chooserMultiple = chooser.isMultiple();
    await chooser.setFiles([f1]); await wait(2500);
    out.uploadWrites = writes.slice(w1);
    out.fileRows = await countRows(grids().nth(2));
    // 받기 아이콘
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 8000 }).catch(() => null), grids().nth(2).locator('.ag-row[row-index="0"] .ag-cell[col-id="downloadCell"] .anticon').first().click()]);
    out.download = dl ? dl.suggestedFilename() : null;

    // [E8] "내용 :" 글자 → 내용 팝업(admin이라 저장 있음) → 수정 저장
    await scr.locator('text=내용 :').first().dispatchEvent('mousedown'); await wait(600);
    const cm = modal('내용');
    out.contentOpen = await cm.count();
    out.contentBtns = (await cm.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.contentValue = await cm.locator('textarea').inputValue();
    await cm.locator('textarea').fill('E03시험 내용 수정');
    const w2 = writes.length;
    await btn(cm, /저\s*장/).click(); await wait(1500);
    out.contentWrites = writes.slice(w2);
    out.contentClosed = (await modal('내용').count()) === 0;
    out.noteAfterContent = await ta(2).inputValue();

    // [E7] 연결법규 행 삭제: 선택 없이 → 안내, 체크 후 → 확인 창 → 삭제
    await btn(scr, /행\s*삭제/).click(); out.lawDelNoneMsg = await msgs();
    await grids().nth(1).locator('.ag-row[row-index="0"] .ag-selection-checkbox input, .ag-row[row-index="0"] .ag-checkbox-input').first().click(); await wait(300);
    const w3 = writes.length;
    await btn(scr, /행\s*삭제/).click(); await wait(500);
    out.lawDelConfirm = (await p.locator('.ant-modal-confirm-content').innerText()).trim();
    await p.locator('.ant-modal-confirm .ant-btn-primary').click(); await wait(1500);
    out.lawDelWrites = writes.slice(w3);
    out.lawRowsAfterDel = await countRows(grids().nth(1));

    // 첨부 삭제 아이콘 → 확인
    const w4 = writes.length;
    await grids().nth(2).locator('.ag-row[row-index="0"] .ag-cell[col-id="deleteCell"] .anticon').first().click(); await wait(500);
    out.fileDelConfirm = (await p.locator('.ant-modal-confirm-content').innerText()).trim();
    await p.locator('.ant-modal-confirm .ant-btn-primary').click(); await wait(2000);
    out.fileDelWrites = writes.slice(w4);
    out.fileRowsAfterDel = await countRows(grids().nth(2));

    // [E5 편집] 삭제 버튼 → 확인 → 개정내역 삭제, 그리드에서 행이 빠진다
    const w5 = writes.length;
    await btn(scr, /^\s*삭\s*제\s*$/).click(); await wait(500);
    out.delConfirm = (await p.locator('.ant-modal-confirm-content').innerText()).trim();
    await p.locator('.ant-modal-confirm .ant-btn-primary').click(); await wait(1800);
    out.delWrites = writes.slice(w5);
    out.rowsEnd = await countRows(grid());
    out.leftover = await grid().evaluate(el => [...el.querySelectorAll('.ag-row[row-index]')].filter(r => r.innerText.includes('E03시험')).length);
    out.writes = writes;
    await p.screenshot({ path: path.join(OUT, 'E03-end.png') });
  } catch (e) {
    out.fail = String(e).slice(0, 600);
    await p.screenshot({ path: path.join(OUT, 'E03-fail.png') }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
