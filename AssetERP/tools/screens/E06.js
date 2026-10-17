// E06 일일점검내역 분류(관리자)(Chk01_Tab_ClassTree #1244 + Chk01_Edit_ClassTree) 화면 확인.
// 시험 상위 분류 1개(E06시험)와 그 하위 분류 1개(E06시험하위)를 만들고 수정·삭제까지 해 본 뒤 지운다. 기존 분류는 열어 보기만 한다(저장 안 함).
// 실패해서 남으면 마지막 줄 created를 보고 `yunhee api DELETE /api/v1/chk/class-trees/{id}`로 지운다(하위 → 상위 순서).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E06.js <스크린샷 폴더> [회사]
const path = require('path');
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, steps: {} };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  const gets = [];
  const created = [];
  p.on('response', async r => {
    const u = r.url();
    if (!u.includes('/api/v1/chk/') && !u.includes('/api/v1/sys/codes')) return;
    const m = r.request().method();
    const pathq = decodeURIComponent(u.split('/api/v1/')[1]);
    if (['PUT', 'POST', 'DELETE'].includes(m)) writes.push(m + ' ' + pathq + ' ' + r.status()); else gets.push(pathq);
    if (m === 'POST' && r.ok() && u.includes('/chk/class-trees')) { try { created.push((await r.json())?.data?.classTreeId); } catch (e) { /* ignore */ } }
  });
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const modal = title => p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: title }) }).last();
  const countRows = g => g.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const btn = (scope, re) => scope.locator('button').filter({ hasText: re }).first();
  const rowIndexOf = (g, text) => g.evaluate((el, t) => { const r = [...el.querySelectorAll('.ag-row[row-index]')].find(x => x.innerText.includes(t)); return r ? r.getAttribute('row-index') : null; }, text);
  const confirmYes = async () => { await p.locator('.ant-modal-confirm .ant-btn-primary').click(); await wait(2000); };
  const confirmText = () => p.locator('.ant-modal-confirm:visible .ant-modal-confirm-title, .ant-modal-confirm:visible .ant-modal-confirm-content').allInnerTexts().then(a => a.join(' / ').replace(/\s+/g, ' '));
  const cell = (g, idx, colId) => g.locator(`.ag-row[row-index="${idx}"] .ag-cell[col-id="${colId}"]`);
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '일일점검내역 분류(관리자)');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(1500);
    const grid = scr.locator('.ag-root-wrapper').first();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await grid.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.getsOpen = gets.slice();
    out.rowsOpen = await countRows(grid);     // 맨 위 분류만 펼침
    out.rowFirst = (await grid.locator('.ag-row[row-index="0"]').innerText()).replace(/\s+/g, ' ');

    // [E3] 선택 없이 하위분류 등록 → 안내 (열자마자라 선택이 없다)
    await btn(scr, /하위분류\s*등록/).click(); out.msgNoSel = await msgs();
    await wait(2800);
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1800);
    out.rowsAfterRetrieve = await countRows(grid);
    // 하위 분류(원본: parentTreeId != 0)를 골라 하위분류 등록 → 안내
    const childIdx = await grid.evaluate(el => { const r = [...el.querySelectorAll('.ag-row[row-index]')].find(x => /[ ]{0}/.test(x.innerText) && x.querySelector('span[style*="padding-left: 16px"]')); return r ? r.getAttribute('row-index') : null; });
    out.childIdx = childIdx;
    if (childIdx != null) {
      await cell(grid, childIdx, 'classTreeName').click(); await wait(500);
      await btn(scr, /하위분류\s*등록/).click(); out.msgChild = await msgs();
      await wait(2800);
      // 수정 아이콘 → 편집 창 열기만 (저장 안 함)
      await cell(grid, childIdx, 'actionCell').locator('.anticon').click(); await wait(800);
      const ed0 = modal('분류 수정');
      out.editOpen = await ed0.count();
      out.editValues = await ed0.locator('input, textarea').evaluateAll(els => els.map(e => e.value.slice(0, 20)));
      out.editLinkDisabled = await ed0.locator('.ant-select-disabled').count();    // 하위 분류라 매뉴링크 꺼짐
      out.editBtns = (await ed0.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
      await btn(ed0, /닫\s*기/).click(); await wait(500);
    }

    // [E2] 상위분류 등록 → 신규등록 창 → 저장
    await btn(scr, /상위분류\s*등록/).click(); await wait(800);
    let ed = modal('분류 신규등록');
    out.newOpen = await ed.count();
    out.newLinkDisabled = await ed.locator('.ant-select-disabled').count();    // admin 회사의 상위 분류라 켜짐
    out.newUseYn = (await ed.locator('.ant-select-selection-item').allInnerTexts()).join('|');
    await ed.locator('input[type=text], input:not([type])').first().fill('E06시험');
    await ed.locator('.ant-input-number input').fill('98');
    const w0 = writes.length;
    await btn(ed, /저\s*장/).click(); await wait(2500);
    out.createRootWrites = writes.slice(w0);
    out.rowsAfterRoot = await countRows(grid);
    const rootIdx = await rowIndexOf(grid, 'E06시험');
    out.rootSelected = await grid.locator('.ag-row-selected').count();

    // [E3] 시험 상위 분류에서 하위분류 등록
    await cell(grid, rootIdx, 'classTreeName').click(); await wait(500);
    await btn(scr, /하위분류\s*등록/).click(); await wait(800);
    ed = modal('분류 신규등록');
    out.childNewOpen = await ed.count();
    out.childLinkDisabled = await ed.locator('.ant-select-disabled').count();
    await ed.locator('input[type=text], input:not([type])').first().fill('E06시험하위');
    await ed.locator('textarea').fill('E06 비고');
    await ed.locator('.ant-input-number input').fill('1');
    const w1 = writes.length;
    await btn(ed, /저\s*장/).click(); await wait(2500);
    out.createChildWrites = writes.slice(w1);
    out.rowsAfterChild = await countRows(grid);
    const subIdx = await rowIndexOf(grid, 'E06시험하위');
    out.subText = subIdx == null ? null : (await grid.locator(`.ag-row[row-index="${subIdx}"]`).innerText()).replace(/\s+/g, ' ');

    // [E5] 수정(비고 바꾸고 저장) → [E4] 삭제(하위 → 상위)
    await cell(grid, subIdx, 'actionCell').locator('.anticon').click(); await wait(800);
    ed = modal('분류 수정');
    await ed.locator('textarea').fill('E06 수정됨');
    const w2 = writes.length;
    await btn(ed, /저\s*장/).click(); await wait(2500);
    out.updateWrites = writes.slice(w2);
    out.subTextAfterEdit = (await grid.locator(`.ag-row[row-index="${await rowIndexOf(grid, 'E06시험하위')}"]`).innerText()).replace(/\s+/g, ' ');
    const del = async text => {
      const i = await rowIndexOf(grid, text);
      await cell(grid, i, 'actionCell').locator('.anticon').click(); await wait(800);
      const m = modal('분류 수정');
      await btn(m, /삭\s*제/).click(); await wait(600);
      const txt = await confirmText();
      const w = writes.length;
      await confirmYes();
      return { txt, writes: writes.slice(w) };
    };
    out.delChild = await del('E06시험하위');
    out.rowsAfterDelChild = await countRows(grid);
    out.delRoot = await del('E06시험');
    out.rowsFinal = await countRows(grid);
    created.length = 0;
    out.grid = await checkGrid(p, scr); out.gridOk = gridOk(out.grid);
    await p.screenshot({ path: path.join(OUT, 'E06-final.png') });
  } catch (e) {
    out.error = String(e).slice(0, 400);
    try { await p.screenshot({ path: path.join(OUT, 'E06-error.png') }); } catch (e2) { /* ignore */ }
  }
  out.created = created;
  out.errs = errs.slice(0, 6);
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
