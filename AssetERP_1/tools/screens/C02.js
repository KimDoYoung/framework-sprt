// C02 조직정보 등록(Org01_Tab_OrgCode + Org01_Edit_OrgCode·Org02_Lookup_OrgInfo·Org02_Edit_Info·Org01_Move_OrgCode) 화면 확인.
// 시험 조직(조직코드 ZZC02)을 하위조직등록으로 만들고, 이력 조회창에서 같은 값 저장 → 상위조직변경 팝업 → [삭제](조직 전체)로 지운다.
// 실패해서 남으면 마지막 줄 leftover의 codeId를 `yunhee api DELETE /api/v1/org/org-codes/<id>/all -c kfstest`로 지운다.
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/C02.js <스크린샷 폴더> [회사] [1차 메뉴]'" (#1451은 1차 메뉴 '기본정보')
const { chromium } = require('playwright-core');
const [OUT, COMPANY = 'kfstest', MENU1 = '경영관리', USER = 'admin'] = process.argv.slice(2);
const NAME = '시험조직C02';
(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--host-resolver-rules=MAP *.localhost 127.0.0.1'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  const out = { errs: [], msgs: [] };
  p.on('pageerror', e => out.errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('401')) out.errs.push(m.text().slice(0, 150)); });
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const msg = async () => { await p.waitForTimeout(700); const t = await p.locator('.ant-message-notice').allInnerTexts(); out.msgs.push(...t); return t.join('|'); };
  const modal = title => p.locator('.ant-modal', { has: p.locator('.ant-modal-title', { hasText: title }) });
  const field = (m, label) => m.locator('div', { has: p.locator(`span.ant-typography:text-is("${label}")`) }).last();
  try {
    await p.goto('http://admin.localhost:8082/AssetERP_1/', { waitUntil: 'networkidle' });
    await p.locator('.ant-select').first().click(); await p.keyboard.type(COMPANY); await p.waitForTimeout(500); await p.keyboard.press('Enter');
    await p.fill('input[placeholder^="사번"]', USER); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText(MENU1, { exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByText('조직정보 등록', { exact: true }).first().click(); await p.waitForTimeout(2500);
    const tab = p.locator('.flexlayout__tab').filter({ has: p.locator('.ag-root') }).first();
    // BASE=yyyy-mm-dd면 기준일을 바꿔 조회하고, 등록 팝업의 개설일도 그날로 (자식 없는 최상위 조직 재현용)
    if (process.env.BASE) {
      const bd = tab.locator('.ant-picker input').first();
      await bd.click(); await bd.fill(process.env.BASE); await bd.press('Enter');
      await tab.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1500);
    }
    out.buttons = await tab.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.headers = await tab.locator('.ag-header-cell-text').allInnerTexts();
    out.rowsOnOpen = await countRows(tab);

    // [E2] 선택 없이 하위조직등록 → 경고
    await tab.getByRole('button', { name: '하위조직등록' }).click(); out.noSel = await msg();
    // 첫 행(최상위) 선택 → 등록 팝업
    // 상위 조직: 기본 첫 행. PARENT_ROW=n이면 n번째 보이는 행(자식 없는 조직에 등록하는 경우)
    await tab.locator(`.ag-row[row-index="${process.env.PARENT_ROW || 0}"] .ag-cell[col-id="orgCd"]`).click();
    await tab.getByRole('button', { name: '하위조직등록' }).click(); await p.waitForTimeout(1200);
    const ed = modal('조직상세 정보');
    out.editButtons = await ed.locator('.ant-modal-footer button').allInnerTexts();
    out.editLabels = await ed.locator('.ant-modal-body span.ant-typography').allInnerTexts();
    out.editParent = await ed.locator('input[readonly]').first().inputValue();
    await ed.getByRole('button', { name: '저장' }).click(); out.saveEmpty = await msg();
    if (process.env.BASE) { const od = field(ed, '개설일').locator('input'); await od.click(); await od.fill(process.env.BASE); await od.press('Enter'); }
    await field(ed, '개설사유').locator('input').fill('시험개설');
    await field(ed, '조직코드').locator('input').fill('ZZC02');
    await field(ed, '조직명').locator('input').fill(NAME);
    await field(ed, '조직레벨').locator('.ant-select').click(); await p.waitForTimeout(500);
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option').first().click();
    const dcr = field(ed, '문서코드').locator('input');
    out.dcrEnabled = await dcr.isEnabled();
    if (out.dcrEnabled) { await ed.getByRole('button', { name: '저장' }).click(); out.saveNoDcr = await msg(); await dcr.fill('ZZ'); }
    await ed.getByRole('button', { name: '저장' }).click(); await p.waitForTimeout(2000);
    out.editClosed = !(await ed.isVisible());
    const newRow = tab.locator('.ag-row-selected', { hasText: NAME });
    out.newSelected = await newRow.count();
    out.rowsAfterInsert = await countRows(tab);
    out.rowsTextAfterInsert = (await tab.locator('.ag-center-cols-container .ag-row').allInnerTexts()).map(t => t.split('\n')[0]);
    await tab.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1500);
    out.rowsAfterRetrieve = await countRows(tab);
    out.baseDateBox = await tab.locator('.ant-picker input').first().evaluate(el => [el.clientWidth, el.scrollWidth, el.value]);

    // [수정] 칸 → 이력 조회창
    await tab.locator('.ag-row', { hasText: NAME }).first().locator('.ag-cell[col-id="actionCell"] .anticon').click(); await p.waitForTimeout(1500);
    const lk = modal('조직정보 History');
    out.lookupButtons = await lk.locator('.ant-modal-footer button').allInnerTexts();
    out.lookupHeaders = await lk.locator('.ag-header-cell-text').allInnerTexts();
    out.lookupRows = await countRows(lk);
    out.lookupSelected = await lk.locator('.ag-row-selected').count();
    out.oldMsgs = out.msgs.length; await p.waitForTimeout(2500); // 앞 메시지가 사라지게
    out.formName = await field(lk, '조직명').locator('input').inputValue();
    out.formParent = await lk.locator('input[readonly]').first().inputValue();
    // [E2] 같은 값 저장
    await lk.getByRole('button', { name: '저장' }).click(); out.saveSame = await msg();
    // 상위조직변경 → 이동 팝업, 선택 없이 확인 → 경고 → 취소
    await lk.getByRole('button', { name: '상위조직변경' }).click(); await p.waitForTimeout(1200);
    const mv = modal('이동시킬 상위조직을 선택하세요.');
    out.moveNodes = await mv.locator('.ant-tree-treenode').count();
    out.moveButtons = await mv.locator('.ant-modal-footer button').allInnerTexts();
    await mv.getByRole('button', { name: '확인' }).click(); out.moveNoSel = await msg();
    await mv.getByRole('button', { name: '취소' }).click(); await p.waitForTimeout(500);
    // 변경일을 바꿔 저장 → 새 이력(INSERT) → 그 이력을 클릭해 삭제(오래된 정보 경고 → [E5] deleteRow)
    const md = field(lk, '변경일').locator('input');
    await md.click(); await md.fill('2026-12-01'); await md.press('Enter');
    await field(lk, '변경사유').locator('input').fill('시험변경');
    await lk.getByRole('button', { name: '저장' }).click(); out.saveHist = await msg(); await p.waitForTimeout(1000);
    out.histRows = await countRows(lk);
    out.histFirst = await lk.locator('.ag-row[row-index="0"]').innerText();
    await lk.locator('.ag-row[row-index="0"] .ag-cell[col-id="korNm"]').click(); await p.waitForTimeout(500);
    await lk.getByRole('button', { name: '삭제' }).click(); await p.waitForTimeout(1000);
    out.oldConfirm = await p.locator('.ant-modal-confirm-content').last().innerText();
    await p.locator('.ant-modal-confirm-btns button', { hasText: '예' }).last().click(); await p.waitForTimeout(1500);
    out.histRowsAfterDelete = await countRows(lk);
    await lk.locator('.ag-row[row-index="0"] .ag-cell[col-id="korNm"]').click(); await p.waitForTimeout(500);
    // [E1] 삭제(개설 이력) → deleteCheck 1 → 확인 → 조직 전체 삭제
    await lk.getByRole('button', { name: '삭제' }).click(); await p.waitForTimeout(1000);
    out.confirm = await p.locator('.ant-modal-confirm-content').last().innerText();
    await p.locator('.ant-modal-confirm-btns button', { hasText: '예' }).last().click(); out.deleted = await msg();
    await p.waitForTimeout(1500);
    out.lookupClosed = !(await lk.isVisible());
    out.leftover = await tab.locator('.ag-row', { hasText: NAME }).count();
    await p.screenshot({ path: OUT + '/C02.png' });
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/C02-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
