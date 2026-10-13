// A14 고객사 공통코드(Sys08_Tab_CodeKindClient + Sys09_Grid_Code + Sys01_Lookup_SelectSingle + Sys01_Lookup_SelectMulti) 화면 확인.
// ① admin 회사 admin: 고객사 공통코드(#1079) — 회사명·코드복사 보임, 고객사 선택(확인·취소), 코드복사 검사 메시지·다중 선택창·확인 문구(아니오 — 복사하지 않음)
// ② kfstest admin: 공통코드(#1248) — 회사명·코드복사 없음, 자기 회사 코드, 버튼 켜짐. 데이터는 바꾸지 않는다(체크 클릭은 조회로 버림).
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/A14.js <스크린샷 폴더>'"
const { BASE, launch, login, checkGrid, gridOk } = require('./_common');
const [OUT] = process.argv.slice(2);

const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);

async function openScreen(p, sub, menuName) {
  await p.getByText('관리자', { exact: true }).first().click(); await p.waitForTimeout(600);
  const menu = p.getByText(menuName, { exact: true }).first();
  if (!(await menu.isVisible().catch(() => false))) { await p.getByText(sub, { exact: true }).first().click(); await p.waitForTimeout(500); }
  await menu.click(); await p.waitForTimeout(2500);
}

async function pickKind(p, left, kindCd) {
  const kindInput = left.locator('input.ant-input:not([readonly])').first();
  await kindInput.fill(kindCd); await kindInput.press('Enter'); await p.waitForTimeout(1200);
  await left.locator('.ag-row .ag-cell[col-id="kindCd"]', { hasText: new RegExp(`^${kindCd}$`) }).first().click(); await p.waitForTimeout(1500);
}

(async () => {
  const out = { admin: { msgs: [] }, kfstest: {} };
  // ── ① admin 회사 ──
  {
    const { b, p, errs } = await launch();
    const o = out.admin; o.errs = errs;
    const msg = async () => { await p.waitForTimeout(700); o.msgs.push((await p.locator('.ant-message-notice').allInnerTexts()).join('|')); };
    try {
      await p.goto(BASE, { waitUntil: 'networkidle' });
      await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
      await p.click('button[type=submit]'); await p.waitForTimeout(2500);
      await openScreen(p, '03. 코드관리', '고객사 공통코드');
      const left = p.locator('.ant-splitter-panel').first(), right = p.locator('.ant-splitter-panel').last();
      o.leftLabels = await left.locator('.ant-typography').allInnerTexts();
      o.companyText = await left.locator('input.ant-input[readonly]').first().inputValue();
      o.leftButtons = await left.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
      o.leftHeaders = await left.locator('.ag-header-cell-text').allInnerTexts();
      o.rightButtons = await right.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
      o.rightHeaders = await right.locator('.ag-header-cell-text').allInnerTexts();
      o.kinds = await countRows(left);
      o.leftGrid = await checkGrid(p, left);

      // [E2] 선택 없이 코드복사 → "복사할 코드를 선택해주세요" (checkGrid 헤더 클릭은 선택하지 않음)
      await left.getByRole('button', { name: '코드복사' }).click(); await msg();

      // [E4] 코드구분명 검색 → [E5] 선택 → 오른쪽 회사 0 코드, 항상 편집 가능
      await pickKind(p, left, 'EmpPosCode');
      o.codesAdmin = await countRows(right);
      o.rightDisabled = await right.locator('button:disabled').allInnerTexts();

      // [E3] 회사명 → 고객사 선택 → 한국펀드서비스 확인 → 오른쪽 그 회사 코드
      await left.locator('input.ant-input[readonly]').first().click(); await p.waitForTimeout(1200);
      const single = p.locator('.ant-modal').filter({ hasText: '고객사' }).last();
      await single.locator('input.ant-input').fill('한국펀드'); await single.locator('input.ant-input').press('Enter'); await p.waitForTimeout(1000);
      await single.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').first().click({ force: true });
      await single.getByRole('button', { name: '확인' }).click(); await p.waitForTimeout(1500);
      o.companyPicked = await left.locator('input.ant-input[readonly]').first().inputValue();
      o.codesPicked = await countRows(right);
      // 다시 열고 취소 → 회사 그대로, 다시 조회해도 같은 행 수
      await left.locator('input.ant-input[readonly]').first().click(); await p.waitForTimeout(1200);
      await p.locator('.ant-modal').filter({ hasText: '고객사' }).last().getByRole('button', { name: '취소' }).click(); await p.waitForTimeout(1500);
      o.companyAfterCancel = await left.locator('input.ant-input[readonly]').first().inputValue();
      o.codesAfterCancel = await countRows(right);

      // [E2] 코드복사 → Sys01_Lookup_SelectMulti: 선택 없이 확인 → 메시지, 2곳 체크 → 확인 → 확인 문구 → 아니오(복사 안 함)
      await left.getByRole('button', { name: '코드복사' }).click(); await p.waitForTimeout(1500);
      const multi = p.locator('.ant-modal').filter({ hasText: '고객사' }).last();
      o.multiHeaders = await multi.locator('.ag-header-cell-text').allInnerTexts();
      o.multiRows = await countRows(multi);
      await multi.getByRole('button', { name: '확인' }).click(); await msg();
      await multi.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').first().click({ force: true });
      await multi.locator('.ag-row[row-index="1"] .ag-selection-checkbox input').first().click({ force: true });
      await multi.getByRole('button', { name: '확인' }).click(); await p.waitForTimeout(600);
      o.copyConfirm = await p.locator('.ant-modal-confirm').allInnerTexts();
      await p.locator('.ant-modal-confirm').getByRole('button', { name: '아니오' }).click(); await p.waitForTimeout(400);
      if (OUT) await p.screenshot({ path: `${OUT}/A14-admin.png` });
    } catch (e) { o.error = e.message; if (OUT) await p.screenshot({ path: `${OUT}/A14-admin-err.png` }); }
    await b.close();
  }
  // ── ② kfstest 관리자 ──
  {
    const { b, p, errs } = await launch();
    const o = out.kfstest; o.errs = errs;
    try {
      await login(p, 'kfstest');
      await openScreen(p, '09. 기타', '공통코드');
      const left = p.locator('.ant-splitter-panel').first(), right = p.locator('.ant-splitter-panel').last();
      o.leftLabels = await left.locator('.ant-typography').allInnerTexts();
      o.leftButtons = await left.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
      o.kinds = await countRows(left);
      await pickKind(p, left, 'EmpPosCode');
      o.codes = await countRows(right);
      o.rightDisabled = await right.locator('button:disabled').allInnerTexts();
      o.rightGrid = await checkGrid(p, right);
      await right.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1000); // 체크 클릭 버림
      if (OUT) await p.screenshot({ path: `${OUT}/A14-kfstest.png` });
    } catch (e) { o.error = e.message; if (OUT) await p.screenshot({ path: `${OUT}/A14-kfstest-err.png` }); }
    await b.close();
  }
  out.gridOk = { left: gridOk(out.admin.leftGrid || {}), right: gridOk(out.kfstest.rightGrid || {}) };
  console.log(JSON.stringify(out));
})();
