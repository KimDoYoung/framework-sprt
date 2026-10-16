// A04 사용자별 권한그룹 맵핑(Sys05_Tab_PersonRole) 화면 확인. 저장은 바뀐 것 없이만 누른다(데이터 그대로) — 저장 API는 yunhee api로 확인.
// 사용: NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/A04.js <스크린샷 폴더> [회사] [검색어]
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'kfstest', SEARCH = '본부장'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, msgs: [] };
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const msgCount = () => p.locator('.ant-message-notice').count();
  try {
    await login(p, COMPANY);
    await openMenu(p, '관리자', '사용자별 권한그룹 맵핑');
    const top = p.locator('.ant-splitter-panel').first(), bottom = p.locator('.ant-splitter-panel').last();
    // [E0] 열림 → 재직 조회 → 첫 행 선택 → [E3] 권한 조회
    out.workType = await top.locator('.ant-select-selection-item').innerText();
    out.topButtons = await top.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.userHeaders = await top.locator('.ag-header-cell-text').allInnerTexts();
    out.users = await countRows(top);
    out.firstSelected = await top.locator('.ag-row-selected .ag-cell[col-id="korNm"]').first().innerText().catch(() => '');
    out.bottomButtons = await bottom.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.roleHeaders = await bottom.locator('.ag-header-cell-text').allInnerTexts();
    out.roles = await countRows(bottom);
    out.rolesChecked = await bottom.locator('.gb-check input:checked').count();
    // [E1] 재직구분 겸직 → 조회
    await top.locator('.ant-select').click(); await p.locator('.ant-select-item-option[title="겸직"]').click();
    await top.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1500);
    out.addTitleUsers = await countRows(top);
    // [E2] 검색어(직책명) Enter — 재직구분 전체
    await top.locator('.ant-select').click(); await p.locator('.ant-select-item-option[title="전체"]').click();
    await top.locator('input.ant-input').fill(SEARCH); await top.locator('input.ant-input').press('Enter'); await p.waitForTimeout(1500);
    out.searchUsers = await countRows(top);
    // [E3] 두 번째 사원 선택 → 권한 다시 조회
    await top.locator('.ag-row[row-index="1"] .ag-cell[col-id="korNm"]').click(); await p.waitForTimeout(1200);
    out.secondSelected = await top.locator('.ag-row-selected .ag-cell[col-id="korNm"]').first().innerText().catch(() => '');
    out.roles2Checked = await bottom.locator('.gb-check input:checked').count();
    // [E4] 바뀐 것 없이 저장 → 메시지 없음(05 §8)
    const before = await msgCount();
    await bottom.getByRole('button', { name: '저장' }).click(); await p.waitForTimeout(800);
    out.saveNoChangeMsg = (await msgCount()) > before;
    // 7-1 그리드 점검: 권한 그리드(체크 토글) → 사원 다시 선택으로 버림, 사원 그리드
    out.권한그리드 = await checkGrid(p, bottom);
    await top.locator('.ag-row[row-index="1"] .ag-cell[col-id="korNm"]').click(); await p.waitForTimeout(1200);
    out.사원그리드 = await checkGrid(p, top);  // 0행 체크 → 선택
    out.gridOk = gridOk(out.권한그리드) && gridOk(out.사원그리드);
    // 결과 0건 조회 → 선택 없음 → 권한 비움 → 저장 "선택된 사원이 없습니다"
    await top.locator('input.ant-input').fill('없는사원zzz'); await top.locator('input.ant-input').press('Enter'); await p.waitForTimeout(1500);
    out.noUserSelected = (await top.locator('.ag-row-selected').count()) === 0;
    out.rolesAfterDeselect = await countRows(bottom);
    await bottom.getByRole('button', { name: '저장' }).click(); await p.waitForTimeout(300);
    out.msgs.push(await p.locator('.ant-message-notice').last().innerText().catch(() => ''));
    await p.screenshot({ path: OUT + '/A04.png' });
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/A04-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
