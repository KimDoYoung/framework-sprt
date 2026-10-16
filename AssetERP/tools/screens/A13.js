// A13 시스템 공통코드 관리(Sys08_Tab_CodeKindAdmin + Sys09_Grid_Code + Sys13_Lookup_CodeGroup + Sys13_TabPage_Code + Sys09_Lookup_CodeKind) 화면 확인.
// 시험 코드구분 "A13Test"(시스템)를 만들어 코드 1개·코드 그룹 1개·그룹 소속 코드 1개를 등록하고 모두 지운다
// (남으면 결과 JSON의 leftKind로 알 수 있다 — yunhee api DELETE로 지운다). admin 회사 메뉴라 admin 테넌트 admin으로 확인한다.
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/A13.js <스크린샷 폴더>'"
const { BASE, launch, checkGrid, gridOk } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, msgs: [] };
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const msg = async () => { await p.waitForTimeout(700); const t = await p.locator('.ant-message-notice').allInnerTexts(); out.msgs.push(t.join('|')); };
  const typeCell = async v => { await p.keyboard.press('Control+A'); await p.keyboard.type(v); };
  const confirmYes = async () => { await p.waitForTimeout(400); out.lastConfirm = await p.locator('.ant-modal-confirm-content').allInnerTexts(); await p.locator('.ant-modal-confirm').getByRole('button', { name: '예' }).click(); };
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('관리자', { exact: true }).first().click(); await p.waitForTimeout(600);
    const menu = p.getByText('시스템 공통코드 관리', { exact: true }).first();
    if (!(await menu.isVisible().catch(() => false))) { await p.getByText('03. 코드관리', { exact: true }).first().click(); await p.waitForTimeout(500); }
    await menu.click(); await p.waitForTimeout(2500);
    const left = p.locator('.ant-splitter-panel').first(), right = p.locator('.ant-splitter-panel').last();
    out.leftButtons = await left.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.leftHeaders = await left.locator('.ag-header-cell-text').allInnerTexts();
    out.rightButtons = await right.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.rightHeaders = await right.locator('.ag-header-cell-text').allInnerTexts();
    out.kinds = await countRows(left);
    out.leftGrid = await checkGrid(p, left);

    // [E1] 코드구분명 검색 → [E6] 선택 → 오른쪽 코드 (시스템 코드구분 → 편집 가능)
    const kindInput = left.locator('input').first();
    await kindInput.fill('MonthCode'); await kindInput.press('Enter'); await p.waitForTimeout(1200);
    out.kindsSearch = await countRows(left);
    await left.locator('.ag-row .ag-cell[col-id="kindCd"]', { hasText: /^MonthCode$/ }).first().click(); await p.waitForTimeout(1500);
    out.codes = await countRows(right);
    out.rightGrid = await checkGrid(p, right);
    out.rightDisabledSystem = await right.locator('button:disabled').allInnerTexts();
    // 코드 검색(상세코드구분명)
    await right.locator('input').first().fill('없는말'); await right.locator('input').first().press('Enter'); await p.waitForTimeout(1000);
    out.codesNoMatch = await countRows(right);
    await right.locator('input').first().fill('');

    // 시스템이 아닌 코드구분 → admin은 편집 불가(저장·등록·삭제 비활성)
    await kindInput.fill('EmpGradeCode'); await kindInput.press('Enter'); await p.waitForTimeout(1200);
    await left.locator('.ag-row .ag-cell[col-id="kindCd"]', { hasText: /^EmpGradeCode$/ }).first().click(); await p.waitForTimeout(1500);
    out.codesNonSystem = await countRows(right);
    out.rightDisabledNonSystem = await right.locator('button:disabled').allInnerTexts();

    // [E3][E4] 시험 코드구분 등록(시스템 체크) → 저장
    await left.getByRole('button', { name: '등록' }).click(); await p.waitForTimeout(600);
    await typeCell('A13Test'); await p.keyboard.press('Tab'); await p.waitForTimeout(200);
    await typeCell('A13시험'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
    // 방금 넣은 행 = 마지막 행 (조회 결과 아래)
    const newRow = left.locator('.ag-row').filter({ has: p.locator('.ag-cell[col-id="kindCd"]', { hasText: /^A13Test$/ }) }).first();
    await newRow.locator('.gb-check input').click(); await p.waitForTimeout(200);
    await left.getByRole('button', { name: '저장' }).click(); await msg();
    out.savedKind = await newRow.locator('.ag-cell[col-id="kindNm"]').allInnerTexts();
    await newRow.locator('.ag-cell[col-id="kindCd"]').click(); await p.waitForTimeout(1200);
    out.newKindRightEnabled = (await right.locator('button:disabled').count()) === 0;

    // 코드 등록 → 저장
    await right.getByRole('button', { name: '등록' }).click(); await p.waitForTimeout(600);
    await typeCell('T1'); await p.keyboard.press('Tab'); await p.waitForTimeout(200);
    await typeCell('시험코드'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
    out.newCodeApplyDate = await right.locator('.ag-row .ag-cell[col-id="applyDate"]').allInnerTexts();
    await right.getByRole('button', { name: '저장' }).click(); await msg();
    out.codesAfterSave = await countRows(right);

    // 그룹 칸 → 코드 그룹 팝업
    await newRow.locator('.ag-cell[col-id="actionCell"] span').first().dispatchEvent('click'); await p.waitForTimeout(1500);
    const dlg = p.locator('.ant-modal').filter({ has: p.locator('.ant-modal-title', { hasText: '코드 그룹' }) });
    const gLeft = dlg.locator('.ag-root-wrapper').nth(0), gRight = dlg.locator('.ag-root-wrapper').nth(1);
    out.groupButtons = await dlg.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.groupHeaders = await dlg.locator('.ag-header-cell-text').allInnerTexts();
    out.groupClosable = await dlg.locator('.ant-modal-close').count();
    // 그룹 등록 → 저장
    await dlg.getByRole('button', { name: '등록' }).first().click(); await p.waitForTimeout(600);
    await typeCell('GRP1'); await p.keyboard.press('Tab'); await p.waitForTimeout(200);
    await typeCell('시험그룹'); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
    await dlg.getByRole('button', { name: '저장' }).first().click(); await msg();
    out.groupRows = await countRows(gLeft);
    // [E3] 오른쪽 등록 전에 그룹을 안 골랐을 때
    await dlg.getByRole('button', { name: '등록' }).last().click(); await msg();
    // [E6] 그룹 행 클릭 → 오른쪽 조회
    await gLeft.locator('.ag-row .ag-cell[col-id="kindGroupCd"]').first().click(); await p.waitForTimeout(1200);
    out.memberRows0 = await countRows(gRight);
    // 오른쪽 등록 → 코드목록 → 선택 → 확인 → 저장
    await dlg.getByRole('button', { name: '등록' }).last().click(); await p.waitForTimeout(1500);
    const lk = p.locator('.ant-modal').filter({ has: p.locator('.ant-modal-title', { hasText: '코드목록' }) });
    out.lookupRows = await countRows(lk);
    out.lookupHeaders = await lk.locator('.ag-header-cell-text').allInnerTexts();
    out.lookupButtons = await lk.locator('.ant-modal-footer button').allInnerTexts();
    await lk.getByRole('button', { name: '확인' }).click(); await msg();   // 선택 없이 확인
    await lk.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').first().click({ force: true }); await p.waitForTimeout(300);
    await lk.getByRole('button', { name: '확인' }).click(); await p.waitForTimeout(800);
    out.memberRowsPicked = await countRows(gRight);
    await dlg.getByRole('button', { name: '저장' }).last().click(); await msg();
    out.memberRowsSaved = await countRows(gRight);
    out.memberSelectedFirst = await gRight.locator('.ag-row.ag-row-selected').count();
    // 소속 코드 삭제 (저장 뒤 다시 조회하면 체크가 풀려 있다 → 체크하고 삭제)
    await gRight.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').first().click({ force: true }); await p.waitForTimeout(300);
    await dlg.getByRole('button', { name: '삭제' }).last().click(); await confirmYes(); await msg();
    out.memberRowsDeleted = await countRows(gRight);
    // 그룹 삭제
    await gLeft.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').first().click({ force: true }); await p.waitForTimeout(300);
    await dlg.getByRole('button', { name: '삭제' }).first().click(); await confirmYes(); await msg();
    out.groupRowsDeleted = await countRows(gLeft);
    await dlg.getByRole('button', { name: '닫기' }).click(); await p.waitForTimeout(500);

    // 시험 코드 삭제 → 시험 코드구분 삭제
    await right.locator('.ag-row .ag-cell[col-id="code"]').first().click(); await p.waitForTimeout(200);
    await right.getByRole('button', { name: '삭제' }).click(); await confirmYes(); await msg();
    out.codesDeleted = await countRows(right);
    await newRow.locator('.ag-cell[col-id="kindCd"]').click(); await p.waitForTimeout(300);
    await left.getByRole('button', { name: '삭제' }).click(); await confirmYes(); await msg();
    out.leftKind = await left.locator('.ag-cell[col-id="kindCd"]', { hasText: /^A13Test$/ }).count();
    out.leftOk = gridOk(out.leftGrid); out.rightOk = gridOk(out.rightGrid);
    await p.screenshot({ path: OUT + '/A13.png' });
  } catch (e) {
    console.error(e.message.split('\n').slice(0, 12).join('\n')); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/A13-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
