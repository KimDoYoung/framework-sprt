// A15-3 고객별 시스템정보 관리 아래 탭 2~4(Sys01_TabPage_Info02·03·04) 화면 확인. admin 회사 admin, 회사 = 한국펀드서비스(주)(28000).
// 탭마다: 버튼·헤더·첫 행 값, 그리드 기본 점검(checkGrid — 저장 안 함, 탭 전환 재조회로 버림), 콤보 목록.
// 저장: 기본정보 담당자 바꿔 저장 → 원래 값으로 되돌려 저장, 사업자번호 비우고 저장 → 서버 필수 문구,
//       경영·회계 휴가결산(월) 바꿔 저장 → 되돌려 저장. 끝난 뒤 값은 호출한 쪽이 yunhee api로 원래 JSON과 대조한다.
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/A15-3.js <스크린샷 폴더>'"
const { BASE, launch, checkGrid, gridOk } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, msgs: [] };
  const msg = async () => { await p.waitForTimeout(900); const t = (await p.locator('.ant-message-notice').allInnerTexts()).join('|'); out.msgs.push(t); return t; };
  const panel = p.locator('.ant-splitter-panel').last();
  const cell = col => panel.locator(`.ag-row[row-index="0"] .ag-cell[col-id="${col}"]`).first();
  const openTab = async name => { await p.getByRole('tab', { name }).click(); await p.waitForTimeout(1500); };
  const editText = async (col, value) => {
    await cell(col).dblclick(); await p.waitForTimeout(300);
    const input = panel.locator('.ag-cell-inline-editing input').first();
    await input.fill(value); await input.press('Enter'); await p.waitForTimeout(300);
  };
  const pickSelect = async (col, text) => {
    await cell(col).dblclick(); await p.waitForTimeout(500);
    await panel.locator('.ag-cell-inline-editing .ag-picker-field-wrapper').first().click(); await p.waitForTimeout(400);
    const items = p.locator('.ag-select-list .ag-list-item');
    const all = await items.allInnerTexts();
    if (text) {
      const item = p.locator('.ag-select-list').getByText(text, { exact: true }).first();
      for (let i = 0; i < 20 && !(await item.count()); i++) { // 가상 목록: 안 그려졌으면 내려 가며 찾는다
        await p.locator('.ag-select-list [class*=viewport], .ag-select-list').first().evaluate((el, n) => { el.scrollTop = n * 60; }, i); await p.waitForTimeout(150);
      }
      await item.click(); await p.waitForTimeout(300);
    }
    else { await p.keyboard.press('Escape'); await p.waitForTimeout(200); await p.keyboard.press('Escape'); await p.waitForTimeout(300); } // 목록 닫기 + 편집 취소
    return all;
  };
  const save = async () => { await panel.getByRole('button', { name: '저장' }).click(); return msg(); };
  // 가로 가상화로 안 그려진 헤더까지: 끝으로 스크롤해 다시 모은 뒤 col-id 순서로 합친다
  const headers = async () => {
    const read = () => panel.locator('.ag-header-cell[col-id]').evaluateAll(hs => hs.map(h => [h.getAttribute('col-id'), h.innerText.replace(/\n/g, ' ')]));
    const all = new Map(await read());
    await panel.locator('.ag-body-horizontal-scroll-viewport').last().evaluate(el => { el.scrollLeft = 5000; }); await p.waitForTimeout(400);
    for (const [k, v] of await read()) all.set(k, v);
    await panel.locator('.ag-body-horizontal-scroll-viewport').last().evaluate(el => { el.scrollLeft = 0; }); await p.waitForTimeout(400);
    return [...all.values()];
  };
  const tabInfo = async () => ({
    buttons: await panel.locator('button').filter({ hasText: /\S/ }).allInnerTexts(),
    headers: await headers(),
    rowNumber: await panel.locator('.ag-row[row-index="0"] [col-id="__rowNum"], .ag-row[row-index="0"] .ag-row-number').count(),
    rows: new Set(await panel.locator('.ag-row[row-index]').evaluateAll(rs => rs.map(r => r.getAttribute('row-index')))).size,
  });
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('관리자', { exact: true }).first().click(); await p.waitForTimeout(600);
    const menu = p.getByText('고객별 시스템정보 관리', { exact: true }).first();
    if (!(await menu.isVisible().catch(() => false))) { await p.getByText('01. 고객관리', { exact: true }).first().click(); await p.waitForTimeout(500); }
    await menu.click(); await p.waitForTimeout(2500);
    await p.locator('.ant-splitter-panel').first().locator('.ag-cell[col-id="companyNm"]', { hasText: '한국펀드서비스(주)' }).first().click();
    await p.waitForTimeout(1500);

    // ── 기본정보 (Info02) ──
    await openTab('기본정보');
    const i2 = out.info02 = await tabInfo();
    i2.headerColor = await panel.locator('.ag-header-cell[col-id="startDate"] .ag-header-cell-text').evaluate(el => getComputedStyle(el.closest('.ag-header-cell')).color);
    i2.plainHeaderColor = await panel.locator('.ag-header-cell[col-id="empInfo"] .ag-header-cell-text').evaluate(el => getComputedStyle(el.closest('.ag-header-cell')).color);
    i2.values = { bizNo: await cell('bizNo').innerText(), decCorpRegNo: await cell('decCorpRegNo').innerText(), startDate: await cell('startDate').innerText() };
    i2.grid = await checkGrid(p, panel);
    await p.screenshot({ path: OUT + '/A15-3-info02.png' });
    const emp = await cell('empInfo').innerText();
    await editText('empInfo', emp + 'X'); i2.saveMsg = await save(); i2.afterSave = await cell('empInfo').innerText();
    await editText('empInfo', emp); i2.restoreMsg = await save(); i2.restored = await cell('empInfo').innerText();
    await editText('bizNo', ''); i2.emptyBizMsg = await save();
    await openTab('관리정보'); await openTab('기본정보'); // 저장 안 한 변경 버림(탭 전환 재조회)
    i2.bizNoAfterDiscard = await cell('bizNo').innerText();

    // ── 전자결재·내부통제 (Info03) ──
    await openTab('전자결재·내부통제');
    const i3 = out.info03 = await tabInfo();
    i3.values = { dcrNumberingNm: await cell('dcrNumberingNm').innerText(), icsCheckCycleNm: await cell('icsCheckCycleNm').innerText(),
      apprStepLockYn: await cell('apprStepLockYn').locator('input').isChecked() };
    i3.grid = await checkGrid(p, panel);
    i3.dcrNumberingList = await pickSelect('dcrNumberingNm');
    i3.icsCycleList = await pickSelect('icsComplyCycleNm');
    await p.screenshot({ path: OUT + '/A15-3-info03.png' });
    await openTab('관리정보');

    // ── 경영·회계 (Info04) ──
    await openTab('경영·회계');
    const i4 = out.info04 = await tabInfo();
    i4.headerColor = await panel.locator('.ag-header-cell[col-id="taxTypeNm"] .ag-header-cell-text').evaluate(el => getComputedStyle(el.closest('.ag-header-cell')).color);
    i4.values = { leaveMonthNm: await cell('leaveMonthNm').innerText(), leaveCompulsionRt: await cell('leaveCompulsionRt').innerText(),
      empEvalCycleNm: await cell('empEvalCycleNm').innerText() };
    i4.grid = await checkGrid(p, panel);
    await openTab('관리정보'); await openTab('경영·회계');
    i4.empEvalCycleList = await pickSelect('empEvalCycleNm');
    i4.taxList = await pickSelect('taxTypeNm');
    const month = i4.values.leaveMonthNm;
    i4.monthList = await pickSelect('leaveMonthNm'); // 목록은 가상 스크롤 — 보이는 항목 중 지금 값이 아닌 첫 항목으로 바꾼다
    await pickSelect('leaveMonthNm', i4.monthList.find(m => m !== month));
    i4.saveMsg = await save(); i4.afterSave = await cell('leaveMonthNm').innerText();
    await pickSelect('leaveMonthNm', month); i4.restoreMsg = await save(); i4.restored = await cell('leaveMonthNm').innerText();
    await p.screenshot({ path: OUT + '/A15-3-info04.png' });

    out.gridOk = [i2.grid, i3.grid, i4.grid].every(gridOk);
  } catch (e) {
    out.error = e.message;
    await p.screenshot({ path: OUT + '/A15-3-error.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
  if (out.error) process.exit(1);
})();
