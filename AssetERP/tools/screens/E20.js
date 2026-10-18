// E20 Sch10_Tab_IpoAdmin(공모주 일정등록 #1293) 화면 확인
// 시험 행: 일정 1건(등록→수정→삭제), 엑셀업로드 2건(삭제), 주간사 1건·종목코드매칭 1건·종목(주식) 1건(등록→삭제), 미일치내역 확인완료(켰다 끔).
// 미일치내역 조회는 DB 함수(f_create_ipoMismatch)가 쓰는 조회라 GET 응답을 DB의 실제 행으로 대체한다(03 원칙 2).
// 사용: XLSX=<시험 엑셀 경로> CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E20.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
const XLSX = process.env.XLSX;
(async () => {
  const { b, p, errs } = await launch();
  p.setDefaultTimeout(8000);
  const h = helpers(p);
  const { wait, msgs, btn } = { wait: h.wait, msgs: h.msgs, btn: h.btn };
  const out = { errs };
  const api = h.trackApi(['sch/', 'com/items']);
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '공모주 일정등록');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(2500);
    const grid = scr.locator('.ag-root-wrapper').first();
    out.buttons = await h.buttons(scr);
    out.headers = await h.headers(grid);
    out.rowsOpen = await h.rows(grid);
    out.firstRow = (await h.rowsText(grid))[0];
    out.dateInputs = await scr.locator('.ant-picker input').evaluateAll(els => els.map(e => e.value));
    await p.screenshot({ path: `${OUT}/E20-open.png` });

    // [E1][E2] 검색 + 선택 없는 삭제 안내 + 그리드 기본 점검
    const search = scr.locator('input[placeholder="종목명/주간사/발행기관코드"]');
    await search.fill('바이오');
    await btn(scr, /^\s*조\s*회\s*$/).click();
    await wait(1200);
    out.rowsSearch = await h.rows(grid);
    await search.fill('');
    await btn(scr, /^\s*조\s*회\s*$/).click();
    await wait(1200);
    await btn(scr, /^\s*삭\s*제\s*$/).click();
    out.msgDeleteNone = await msgs(); await wait(2800);
    out.grid = await checkGrid(p, scr);
    out.gridOk = gridOk(out.grid);
    await btn(scr, /^\s*조\s*회\s*$/).click();
    await wait(1200);

    // [E3] 등록 → 새 행에 입력 → [E4] 저장
    await btn(scr, /^\s*등\s*록\s*$/).click();
    await wait(1200);
    await p.keyboard.press('Escape');
    const newRow = grid.locator('.ag-row[row-index]').filter({ has: p.locator('[col-id="itemName"]:empty') }).first();
    out.newRowCount = await grid.locator('.ag-row[row-index]').count();
    await p.screenshot({ path: `${OUT}/E20-newrow.png` });
    const cell = (row, id) => row.locator(`[col-id="${id}"]`).first();
    const rowsAll = grid.locator('.ag-row[row-index]');
    // 새 행 = 종목 칸이 빈 행
    let target = null;
    for (let i = 0; i < await rowsAll.count(); i++) {
      const r = rowsAll.nth(i);
      if (!(await cell(r, 'itemName').innerText()).trim()) { target = r; break; }
    }
    out.foundNewRow = !!target;
    await cell(target, 'itemName').dblclick(); await p.keyboard.type('ZT20시험종목'); await p.keyboard.press('Enter');
    await cell(target, 'issCorpCode').dblclick(); await p.keyboard.type('ZT999'); await p.keyboard.press('Enter');
    await cell(target, 'marketName').dblclick(); await wait(400);
    await p.locator('.ag-picker-field-wrapper').first().click(); await wait(300);
    await p.locator('.ag-popup .ag-list-item').filter({ hasText: '코스닥' }).first().click(); await wait(300);
    await cell(target, 'demandStartDate').dblclick(); await wait(300);
    await p.locator('.ag-cell-editor input').first().fill('2026-12-01'); await p.keyboard.press('Enter');
    await cell(target, 'demandCloseDate').dblclick(); await wait(300);
    await p.locator('.ag-cell-editor input').first().fill('2026-12-02'); await p.keyboard.press('Enter');
    await cell(target, 'price').dblclick(); await p.keyboard.type('12345'); await p.keyboard.press('Enter');
    await wait(500);
    out.saveLabel = (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, '');
    await p.screenshot({ path: `${OUT}/E20-edited.png` });
    await btn(scr, /저\s*장/).click(); await wait(2200);
    await search.fill('ZT20시험'); await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
    out.rowsFound = await h.rowsText(grid);

    // 템플릿 받기
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 15000 }), btn(scr, /템\s*플\s*릿/).click()]);
    out.templateFile = dl.suggestedFilename();

    // 엑셀업로드 (숨은 파일 입력)
    if (XLSX) {
      await search.fill('ZT20엑셀');
      await scr.locator('input[type=file]').setInputFiles(XLSX); await wait(2500);
      out.rowsAfterUpload = await h.rowsText(grid);
      await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
      out.rowsExcel = await h.rowsText(grid);
    }

    // 시험 행 지우기: ZT20 모두 선택 → 삭제
    await search.fill('ZT20'); await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
    out.rowsToDelete = await h.rows(grid);
    await h.scrollX(grid, 0);  // 편집으로 가로 스크롤이 밀려 체크박스 열이 DOM에서 빠진다
    for (let i = 0; i < out.rowsToDelete; i++) await grid.locator(`.ag-row[row-index="${i}"] .ag-selection-checkbox input`).first().click({ force: true });
    out.selectedCount = await grid.locator('.ag-row-selected').count();
    await btn(scr, /^\s*삭\s*제\s*$/).click();
    out.confirmDelete = await h.confirmText();
    await h.confirmNo();
    await btn(scr, /^\s*삭\s*제\s*$/).click();
    await h.confirmYes();
    out.msgDeleted = await msgs(); await wait(2800);
    out.rowsAfterDelete = await h.rows(grid);
    await search.fill('');

    // ── 주간사 등록 ──
    await btn(scr, /홈페이지\s*등록/).click();
    const corp = h.modal('주간사 등록');
    await corp.waitFor(); await wait(1500);
    out.corpButtons = await h.buttons(corp);
    out.corpHeaders = await h.headers(corp.locator('.ag-root-wrapper').first());
    out.corpRows = await h.rows(corp.locator('.ag-root-wrapper').first());
    await corp.locator('input.ant-input').first().fill('ZZZNONE'); await btn(corp, /^\s*조\s*회\s*$/).click(); await wait(1000);  // 빈 목록에서 등록 — 새 행이 맨 위에 보인다
    await btn(corp, /^\s*등\s*록\s*$/).click(); await wait(1000);
    await p.keyboard.type('ZT20증권'); await p.keyboard.press('Tab'); await wait(400); await p.keyboard.type('www.zt20.example'); await p.keyboard.press('Enter'); await wait(400);
    await btn(corp, /저\s*장/).click(); await wait(1800);
    await corp.locator('input.ant-input').first().fill('ZT20'); await btn(corp, /^\s*조\s*회\s*$/).click(); await wait(1200);
    out.corpFound = await h.rowsText(corp.locator('.ag-root-wrapper').first());
    await corp.locator('.ag-row[row-index="0"] .ag-checkbox-input').first().check({ force: true });
    await btn(corp, /^\s*삭\s*제\s*$/).click();
    out.corpConfirm = await h.confirmText(); await h.confirmYes();
    out.corpAfterDelete = await h.rows(corp.locator('.ag-root-wrapper').first());
    await p.screenshot({ path: `${OUT}/E20-corp.png` });
    await btn(corp, /닫\s*기/).click(); await wait(600);

    // ── 종목코드 매칭 ──
    await btn(scr, /종목코드매칭/).click();
    const mt = h.modal('종목코드 매칭');
    await mt.waitFor(); await wait(1500);
    out.matchButtons = await h.buttons(mt);
    out.matchHeaders = await h.headers(mt.locator('.ag-root-wrapper').first());
    out.matchRows = await h.rows(mt.locator('.ag-root-wrapper').first());
    await mt.locator('input.ant-input').first().fill('ZZZNONE'); await btn(mt, /^\s*조\s*회\s*$/).click(); await wait(1000);
    await btn(mt, /^\s*등\s*록\s*$/).click(); await wait(1000);
    await p.keyboard.type('KRZT20000001'); await p.keyboard.press('Tab'); await wait(400); await p.keyboard.type('KRZT20000002'); await p.keyboard.press('Tab'); await wait(400); await p.keyboard.type('E20시험'); await p.keyboard.press('Enter'); await wait(400);
    await btn(mt, /저\s*장/).click(); await wait(1800);
    await mt.locator('input.ant-input').first().fill('KRZT20'); await btn(mt, /^\s*조\s*회\s*$/).click(); await wait(1200);
    out.matchFound = await h.rowsText(mt.locator('.ag-root-wrapper').first());
    await mt.locator('.ag-row[row-index="0"] .ag-checkbox-input').first().check({ force: true });
    await btn(mt, /^\s*삭\s*제\s*$/).click();
    out.matchConfirm = await h.confirmText(); await h.confirmYes();
    out.matchAfterDelete = await h.rows(mt.locator('.ag-root-wrapper').first());
    await btn(mt, /닫\s*기/).click(); await wait(600);

    // ── 미일치내역 (조회 GET은 실제 행으로 대체) ──
    const mm = [
      { ipoMismatchId: '202609220004290127', stkCode: '486510', target1: '공모주일정 없음', target2: 'IpoStock 시험\n둘째 줄', insertDateTimeStr: '2026-09-22 00:04:29', checkYn: 'false' },
      { ipoMismatchId: '202609220004290118', stkCode: '0012G0', target1: '공모주일정 없음', target2: null, insertDateTimeStr: '2026-09-22 00:04:29', checkYn: 'false' },
    ];
    await p.route('**/api/v1/sch/ipo-mismatches?*', route => {
      if (route.request().method() !== 'GET') return route.continue();
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, message: 'ok', data: mm }) });
    });
    await btn(scr, /미일치내역/).click();
    const mi = h.modal('공모주일정 미일치내역');
    await mi.waitFor(); await wait(1500);
    const mg = mi.locator('.ag-root-wrapper').first();
    out.mismatchButtons = await h.buttons(mi);
    out.mismatchHeaders = await h.headers(mg);
    out.mismatchRows = await h.rowsText(mg);
    out.mismatchChecked = await mi.locator('.ant-checkbox-input').first().isChecked();
    out.mismatchClosable = await mi.locator('.ant-modal-close').count();
    // 확인완료 켰다 끄기 (PUT은 실제로 간다)
    const chk = mg.locator('.ag-row[row-index="0"] .gb-check input[type=checkbox]').first();
    await chk.click(); await wait(1200);
    out.mismatchOn = await mg.locator('.ag-row[row-index="0"] .gb-check input[type=checkbox]').first().isChecked();
    await mg.locator('.ag-row[row-index="0"] .gb-check input[type=checkbox]').first().click(); await wait(1200);
    out.mismatchOff = await mg.locator('.ag-row[row-index="0"] .gb-check input[type=checkbox]').first().isChecked();
    // 더블클릭 → 알림창
    await mg.locator('.ag-row[row-index="0"] [col-id="target2"]').first().dblclick(); await wait(600);
    out.notice = await p.locator('.ant-modal-confirm:visible .ant-modal-confirm-content').allInnerTexts();
    await p.locator('.ant-modal-confirm .ant-btn-primary').click(); await wait(500);
    await p.screenshot({ path: `${OUT}/E20-mismatch.png` });
    await btn(mi, /닫\s*기/).click(); await wait(600);
    await p.unroute('**/api/v1/sch/ipo-mismatches?*');

    // ── 주식등록 (Com50 EDIT) ──
    await btn(scr, /주식등록/).click();
    const st = h.modal('상장주식 종목 등록');
    await st.waitFor(); await wait(1800);
    const sg = st.locator('.ag-root-wrapper').first();
    out.stkButtons = await h.buttons(st);
    out.stkHeaders = await h.headers(sg);
    out.stkRows = await h.rows(sg);
    out.stkPaging = (await st.locator('.ant-modal-body').innerText()).match(/전체[^\n]*/)?.[0];
    await st.locator('input.ant-input').first().fill('ZZZNONE'); await btn(st, /^\s*조\s*회\s*$/).click(); await wait(1200);
    await btn(st, /^\s*등\s*록\s*$/).click(); await wait(1000);
    await p.keyboard.type('SHORT'); await p.keyboard.press('Tab'); await wait(400); await p.keyboard.type('E20시험종목'); await p.keyboard.press('Enter'); await wait(300);
    await btn(st, /저\s*장/).click();
    out.msgShort = await msgs(); await wait(2800);
    // 12자리로 고쳐 저장
    const stRow = sg.locator('.ag-row[row-index]').filter({ hasText: 'SHORT' }).first();
    await stRow.locator('[col-id="itemCode"]').first().dblclick(); await p.keyboard.press('Control+A'); await p.keyboard.type('KRZT20TEST01'); await p.keyboard.press('Enter'); await wait(300);
    await btn(st, /저\s*장/).click(); await wait(1800);
    await st.locator('input.ant-input').first().fill('KRZT20'); await btn(st, /^\s*조\s*회\s*$/).click(); await wait(1500);
    out.stkFound = await h.rowsText(sg);
    out.stkPaging2 = (await st.locator('.ant-modal-body').innerText()).match(/전체[^\n]*/)?.[0];
    // 중복 코드 등록 → 서버 메시지
    await btn(st, /^\s*등\s*록\s*$/).click(); await wait(1000);
    await p.keyboard.type('KRZT20TEST01'); await p.keyboard.press('Tab'); await wait(400); await p.keyboard.type('중복'); await p.keyboard.press('Enter'); await wait(300);
    await btn(st, /저\s*장/).click();
    out.msgDup = await msgs(); await wait(2800);
    await btn(st, /^\s*조\s*회\s*$/).click(); await wait(1500);
    await sg.locator('.ag-row[row-index]').filter({ hasText: 'KRZT20TEST01' }).first().locator('[col-id="itemName"]').first().click();
    await btn(st, /^\s*삭\s*제\s*$/).click();
    out.stkConfirm = await h.confirmText(); await h.confirmYes();
    out.stkAfterDelete = await h.rows(sg);
    await p.screenshot({ path: `${OUT}/E20-stk.png` });
    await btn(st, /닫\s*기/).click(); await wait(600);
    out.writes = api.writes;
  } catch (e) {
    console.error(e.message.split('\n').slice(0, 5).join(' | ')); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E20-err.png` }).catch(() => {});
    out.writes = api.writes;
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
