// A09 메뉴 관리(Sys06_Tab_Menu + 편집·이동·일괄복사 팝업 + Sys01_Grid_CompanyMenu) 화면 확인.
// 시험 매뉴 "A09화면시험"을 루트로 등록 → 수정 → 삭제한다(남으면 결과 JSON의 leftTestMenu로 알 수 있다 — yunhee api DELETE로 지운다).
// 권한부여·회사 그리드 저장은 누르지 않는다(데이터 그대로). admin 회사 메뉴라 admin 테넌트 admin으로 확인한다.
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/A09.js <스크린샷 폴더>'"
const { BASE, launch, checkGrid, gridOk } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, msgs: [] };
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const msg = async () => { await p.waitForTimeout(600); const t = await p.locator('.ant-message-notice').allInnerTexts(); out.msgs.push(t.join('|')); };
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('관리자', { exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByText('메뉴 관리', { exact: true }).first().click(); await p.waitForTimeout(2500);
    const left = p.locator('.ant-splitter-panel').first(), right = p.locator('.ant-splitter-panel').last();
    out.leftButtons = await left.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.leftHeaders = await left.locator('.ag-header-cell-text').allInnerTexts();
    out.rightButtons = await right.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.rightHeaders = await right.locator('.ag-header-cell-text').allInnerTexts();
    out.roots = await countRows(left);
    out.leftGrid = await checkGrid(p, left);

    // [E4] 선택 없이 하위매뉴 등록
    await left.locator('.ag-row.ag-row-selected').count() && await p.keyboard.press('Escape');
    // [E1] 검색: '메뉴 관리' → 조상 펼침·선택
    await left.locator('input').first().fill('Sys06_Tab_Menu'); await left.locator('input').first().press('Enter'); await p.waitForTimeout(1200);
    out.searchSelected = await left.locator('.ag-row.ag-row-selected .ag-cell[col-id="menuNm"]').allInnerTexts();
    out.searchVisible = await countRows(left);
    // [E7] → 오른쪽 회사 그리드
    await p.waitForTimeout(1200);
    out.companies = await countRows(right);
    out.rightGrid = await checkGrid(p, right);
    await right.getByRole('button', { name: '전체선택' }).click(); await p.waitForTimeout(300);
    out.allChecked = await right.locator('.gb-check input:checked').count();
    await right.getByRole('button', { name: '전체취소' }).click(); await p.waitForTimeout(300);
    out.allUnchecked = await right.locator('.gb-check input:checked').count();

    // [E4] 클래스명이 있는 매뉴에 하위 등록 → 경고
    await left.getByRole('button', { name: '하위매뉴 등록' }).click(); await msg();

    // 수정 칸 → 매뉴 편집 팝업 (닫기)
    await left.locator('.ag-row.ag-row-selected .ag-cell[col-id="edit"] span').first().dispatchEvent('click'); await p.waitForTimeout(800);
    const dlg = p.locator('.ant-modal').filter({ hasText: '매뉴 편집' });
    out.editLabels = await dlg.locator('.ant-modal-body .ant-typography').allInnerTexts();
    out.editButtons = await dlg.locator('.ant-modal-footer button').allInnerTexts();
    out.editMenuNm = await dlg.locator('input').first().inputValue();
    await dlg.getByRole('button', { name: '닫기' }).click(); await p.waitForTimeout(400);

    // 이동 칸 → 이동 팝업 (닫기)
    await left.locator('.ag-row.ag-row-selected .ag-cell[col-id="move"] span').first().dispatchEvent('click'); await p.waitForTimeout(1200);
    const mv = p.locator('.ant-modal').filter({ hasText: '이동시킬 상위매뉴를 선택하세요.' });
    out.moveTreeNodes = await mv.locator('.ant-tree-treenode').count();
    out.moveButtons = await mv.locator('.ant-modal-footer button').allInnerTexts();
    await mv.getByRole('button', { name: '닫기' }).click(); await p.waitForTimeout(400);

    // [E3] 루트매뉴 등록 → 저장 → 다시 조회·선택 → 수정 → 삭제
    await left.getByRole('button', { name: '루트매뉴 등록' }).click(); await p.waitForTimeout(600);
    out.newNote = await dlg.locator('textarea').first().inputValue();
    await dlg.locator('input').first().fill('A09화면시험');
    await dlg.getByRole('button', { name: '저장' }).click(); await p.waitForTimeout(2000);
    out.afterCreateSelected = await left.locator('.ag-row.ag-row-selected .ag-cell[col-id="menuNm"]').allInnerTexts();
    await left.locator('.ag-row.ag-row-selected .ag-cell[col-id="edit"] span').first().dispatchEvent('click'); await p.waitForTimeout(800);
    await dlg.locator('input').nth(3).fill('99');
    await dlg.getByRole('button', { name: '저장' }).click(); await p.waitForTimeout(2000);
    out.afterEditSeq = await left.locator('.ag-row.ag-row-selected .ag-cell[col-id="seq"]').allInnerTexts();
    await left.locator('.ag-row.ag-row-selected .ag-cell[col-id="edit"] span').first().dispatchEvent('click'); await p.waitForTimeout(800);
    await dlg.getByRole('button', { name: '삭제' }).click(); await p.waitForTimeout(500);
    out.deleteConfirm = await p.locator('.ant-modal-confirm-content').allInnerTexts();
    await p.locator('.ant-modal-confirm').getByRole('button', { name: '예' }).click(); await p.waitForTimeout(2000);
    out.leftTestMenu = await left.locator('.ag-cell[col-id="menuNm"]', { hasText: 'A09화면시험' }).count();

    // [E6] 일괄복사 → 두 그리드 → 선택 없이 권한부여 → 경고 → 닫기
    await left.getByRole('button', { name: '일괄복사' }).click(); await p.waitForTimeout(2500);
    const cp = p.locator('.ant-modal').filter({ hasText: '일괄복사' });
    const grids = cp.locator('.ag-root-wrapper');
    out.copyMenus = await countRows(grids.nth(0));
    out.copyCompanies = await countRows(grids.nth(1));
    out.copyHeaders = await cp.locator('.ag-header-cell-text').allInnerTexts();
    out.copyButtons = await cp.locator('.ant-modal-footer button').allInnerTexts();
    out.copyClosable = await cp.locator('.ant-modal-close').count();
    await cp.getByRole('button', { name: '권한부여' }).click(); await p.waitForTimeout(400);
    out.grantConfirm = await p.locator('.ant-modal-confirm-content').allInnerTexts();
    await p.locator('.ant-modal-confirm').getByRole('button', { name: '예' }).click(); await msg();
    await cp.locator('input').first().fill('급여'); await cp.locator('input').first().press('Enter'); await p.waitForTimeout(1500);
    out.copyMenusSearch = await countRows(grids.nth(0));
    await cp.getByRole('button', { name: '닫기' }).click(); await p.waitForTimeout(1500);

    // [E5] 감추기
    await left.getByRole('button', { name: '감추기' }).click(); await p.waitForTimeout(600);
    out.collapsed = await countRows(left);
    out.leftOk = gridOk(out.leftGrid); out.rightOk = gridOk(out.rightGrid);
    await p.screenshot({ path: OUT + '/A09.png' });
  } catch (e) {
    console.error(e.message.split('\n').slice(0, 12).join('\n')); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/A09-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
