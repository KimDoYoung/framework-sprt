// E16 문서분류(Dcr01_Tab_ClassTree #1110 + Edit/Grid_DocType/Move/DcrCopyAdmin/Dcr06·07·20·21) 화면 확인.
// 시험 분류 2개(E16시험·E16시험하위)를 만들고 수정·이동 창 열기·삭제까지 한 뒤 지운다. 기존 데이터는 열어 보기만 한다(저장 안 함). 문서분류복사는 안내 문구만 확인(실행 안 함).
// 실패해서 남으면 마지막 줄 created를 보고 `yunhee api DELETE /api/v1/dcr/class-trees/{id}`로 지운다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E16.js <스크린샷 폴더> [회사]
const path = require('path');
const { launch, login, openMenu } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, steps: {} };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  const created = [];
  p.on('response', async r => {
    const u = r.url();
    if (!u.includes('/api/v1/dcr/') && !u.includes('/api/v1/apr/')) return;
    const m = r.request().method();
    const pathq = decodeURIComponent(u.split('/api/v1/')[1]);
    if (['PUT', 'POST', 'DELETE'].includes(m)) writes.push(m + ' ' + pathq + ' ' + r.status());
    if (m === 'POST' && r.ok() && /dcr\/class-trees$/.test(u)) { try { created.push((await r.json())?.data?.classTreeId); } catch (e) { /* ignore */ } }
  });
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const modal = title => p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: title }) }).last();
  const countRows = g => g.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const btn = (scope, re) => scope.locator('button').filter({ hasText: re }).first();
  const rowIndexOf = (g, text) => g.evaluate((el, t) => { const r = [...el.querySelectorAll('.ag-row[row-index]')].find(x => x.innerText.includes(t)); return r ? r.getAttribute('row-index') : null; }, text);
  const cell = (g, idx, colId) => g.locator(`.ag-row[row-index="${idx}"] .ag-cell[col-id="${colId}"]`);
  const confirmYes = async () => { await p.locator('.ant-modal-confirm .ant-btn-primary').click(); await wait(2000); };
  const confirmText = () => p.locator('.ant-modal-confirm:visible .ant-modal-confirm-title, .ant-modal-confirm:visible .ant-modal-confirm-content').allInnerTexts().then(a => a.join(' / ').replace(/\s+/g, ' '));
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '문서분류');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(2000);
    const grids = scr.locator('.ag-root-wrapper');
    const tree = grids.nth(0);
    const right = grids.nth(1);
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.treeHeaders = (await tree.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.rightHeaders = (await right.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.rowsOpen = await countRows(tree);
    out.rightDisabled = await scr.locator('button[disabled]').count();   // 문서분류를 고르기 전에는 삭제·등록·저장이 꺼져 있다

    // [E6] 선택 없이 하위등록 → 안내
    await btn(scr, /하위등록/).click(); out.msgNoSel = await msgs(); await wait(2800);
    // [E3] 펼치기 / [E4] 감추기
    await btn(scr, /펼치기/).click(); await wait(600); out.rowsExpanded = await countRows(tree);
    await btn(scr, /감추기/).click(); await wait(600); out.rowsCollapsed = await countRows(tree);

    // [E5] 업무등록 → 신규 → 저장
    await btn(scr, /업무등록/).click(); await wait(800);
    let ed = modal('루트등록');
    out.rootOpen = await ed.count();
    const inputs = ed.locator('input');
    await inputs.nth(0).fill('ZE16A'); await inputs.nth(1).fill('99990'); await inputs.nth(2).fill('E16시험');
    const w0 = writes.length;
    await btn(ed, /저\s*장/).click(); await wait(2500);
    out.createRootWrites = writes.slice(w0);
    const rootIdx = await rowIndexOf(tree, 'E16시험');
    out.rootSelected = await tree.locator('.ag-row-selected').count();
    out.rightRowsAfterRoot = await countRows(right);

    // 하위등록
    await btn(scr, /하위등록/).click(); await wait(800);
    ed = modal('하위분류 등록');
    out.childOpen = await ed.count();
    const ci = ed.locator('input');
    await ci.nth(0).fill('ZE16B'); await ci.nth(1).fill('99991'); await ci.nth(2).fill('E16시험하위');
    await ed.locator('textarea').fill('E16 개요');
    const w1 = writes.length;
    await btn(ed, /저\s*장/).click(); await wait(2500);
    out.createChildWrites = writes.slice(w1);

    // 이동 창 열기만
    const subIdx = await rowIndexOf(tree, 'E16시험하위');
    out.subIdx = subIdx;
    if (subIdx != null) {
      await cell(tree, subIdx, 'actionMove').locator('.anticon').click(); await wait(1000);
      const mv = modal('이동시킬');
      out.moveOpen = await mv.count();
      out.moveBtns = (await mv.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
      await btn(mv, /닫\s*기/).click(); await wait(500);
      // 수정 → 개요 수정 저장
      await cell(tree, subIdx, 'actionEdit').locator('.anticon').click(); await wait(800);
      ed = modal('문서분류 수정');
      out.editBtns = (await ed.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
      await ed.locator('textarea').fill('E16 수정됨');
      const w2 = writes.length;
      await btn(ed, /저\s*장/).click(); await wait(2500);
      out.updateWrites = writes.slice(w2);
    }

    // 문서구분 그리드: 시험 하위를 고른 상태에서 등록(빈 행, 서버 호출 없음) 후 저장 → 검사 문구
    const si = await rowIndexOf(tree, 'E16시험하위');
    if (si != null) await cell(tree, si, 'classTreeName').click();
    await wait(1500);
    out.rightEnabled = await scr.locator('button[disabled]').count();
    await btn(scr, /^\s*등\s*록\s*$/).click(); await wait(600);
    out.rightRowsAfterInsert = await countRows(right);
    await btn(scr, /^\s*저\s*장/).click(); out.msgSaveEmpty = await msgs(); await wait(2800);
    await btn(scr, /^\s*삭\s*제\s*$/).click(); out.msgDelNoSel = await msgs(); await wait(2800);

    // 기존 문서분류의 문서구분 열고 연결 창 열어 보기 (저장 안 함)
    await btn(scr, /^\s*조\s*회\s*$/).first().click(); await wait(1500);
    await scr.locator('input[placeholder="분류명"]').fill('결재');
    await btn(scr, /^\s*조\s*회\s*$/).first().click(); await wait(2500);
    out.searchSelected = await tree.locator('.ag-row-selected').count();
    out.rightRowsExisting = await countRows(right);
    if (out.rightRowsExisting > 0) {
      const open = async (colId, title) => {
        await cell(right, 0, colId).locator('.anticon').first().click(); await wait(1500);
        const m = modal(title);
        const r = { open: await m.count(), btns: (await m.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',') };
        await btn(m, /닫\s*기/).click(); await wait(500);
        return r;
      };
      out.form = await open('actionForm', '문서양식 연결');
      out.ics = await open('actionIcs', '법규 연결');
      out.icr = await open('actionIcr', '내규 연결');
      out.detail = await open('actionDetail', '문서분류 :');
    }

    // 문서분류복사: 안내 문구만 (실행 안 함)
    await btn(scr, /문서분류복사/).click(); await wait(1500);
    const cp = modal('운용사별 문서분류 반영');
    out.copyOpen = await cp.count();
    await btn(cp, /문서분류복사/).click(); out.copyMsg1 = await msgs(); await wait(2800);
    await btn(cp, /닫\s*기/).click(); await wait(500);

    // 정리: 하위 → 상위 삭제 (삭제 확인 → 서버 점검)
    await scr.locator('input[placeholder="분류명"]').fill('');
    await btn(scr, /^\s*조\s*회\s*$/).first().click(); await wait(1500);
    await btn(scr, /펼치기/).click(); await wait(800);
    const del = async text => {
      const i = await rowIndexOf(tree, text);
      await cell(tree, i, 'actionEdit').locator('.anticon').click(); await wait(800);
      const m = modal('문서분류 수정');
      await btn(m, /삭\s*제/).click(); await wait(600);
      const txt = await confirmText();
      const w = writes.length;
      await confirmYes();
      return { txt, writes: writes.slice(w) };
    };
    out.delChild = await del('E16시험하위');
    out.delRoot = await del('E16시험');
    out.rowsFinal = await countRows(tree);
    created.length = 0;
    await p.screenshot({ path: path.join(OUT, 'E16-final.png') });
  } catch (e) {
    out.error = String(e).slice(0, 400);
    try { await p.screenshot({ path: path.join(OUT, 'E16-error.png') }); } catch (e2) { /* ignore */ }
  }
  out.created = created;
  out.errs = errs.slice(0, 6);
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
