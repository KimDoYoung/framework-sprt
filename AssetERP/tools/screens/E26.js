// E26 Emp41_Tab_EvalList(인사평가 항목(Admin) #1398) + Emp42_Lookup_EvalGrade(평가등급) + Emp40_Lookup_Insert(생성) 화면 확인
// 시험 데이터: 기준 적용일 2099-01-01 한 건(생성 창에서 만든다 → 항목·등급이 복사됨) — 마지막에 [삭제]로 지운다. 기존 적용일(2025-01-01·2024-01-01)은 읽기만 하고 바꾸지 않는다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E26.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
const TEST_DATE = '2099-01-01';
(async () => {
  const { b, p, errs } = await launch();
  const h = helpers(p);
  const out = { errs };
  const api = h.trackApi(['emp/eval-']);
  const scr = () => p.locator('.flexlayout__tab:visible').last();
  const g1 = () => scr().locator('.ag-root-wrapper').nth(0);
  const g2 = () => scr().locator('.ag-root-wrapper').nth(1);
  const cell = (grid, idx, col) => grid.locator(`.ag-row[row-index="${idx}"] [col-id="${col}"]`).first();
  const type = async (grid, idx, col, text) => {
    await cell(grid, idx, col).dblclick(); await h.wait(300);
    await p.keyboard.press('Control+A'); await p.keyboard.type(text); await p.keyboard.press('Enter'); await h.wait(400);
  };
  const pick = async (grid, idx, col, text) => {   // 콤보 셀: 더블클릭 → 목록에서 글자로 고르기
    await cell(grid, idx, col).dblclick(); await h.wait(300);
    await p.locator('.ag-picker-field-wrapper:visible').first().click(); await h.wait(300);
    await p.locator('.ag-popup .ag-list-item').filter({ hasText: new RegExp('^\\s*' + text + '\\s*$') }).first().click(); await h.wait(400);
  };
  const uncheckAll = async g => { for (const c of await g.locator('.ag-row .ag-checkbox-input:checked').all()) await c.uncheck(); };
  const need = (i, what) => { if (i < 0) throw new Error('행 못 찾음: ' + what); return i; };
  const top = () => scr().locator('div').filter({ has: p.locator('button') }).first();
  const clickRow = async (grid, idx) => { await cell(grid, idx, 'startDate').click(); await h.wait(1500); };
  const dis = async re => h.btn(scr(), re).isDisabled();
  const numAt = async (grid, idx, col) => Number((await cell(grid, idx, col).innerText()).trim() || 0);
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '인사평가 항목(Admin)');
    await h.wait(2500);

    // [E0] 열 때 기준 적용일 조회 + 첫 행 선택(최근 적용일) → 항목 조회
    out.buttons = await h.buttons(scr());
    out.headers1 = await h.headers(g1());
    out.headers2 = await h.headers(g2());
    out.rows1Open = await h.rows(g1());
    out.rows2Open = await h.rows(g2());
    out.first1 = (await h.rowsText(g1()))[0];
    out.sumRowOpen = await scr().locator('.ag-floating-bottom .ag-row, .ag-pinned-bottom .ag-row').allInnerTexts().then(a => a.map(t => t.replace(/\s+/g, ' ')));
    out.enabledOnUnfixed = { del: !(await dis(/삭\s*제/)), addRow: !(await dis(/행\s*추가/)), delRow: !(await dis(/행\s*삭제/)) };
    await p.screenshot({ path: `${OUT}/E26-open.png` });

    // 확정 행(2024-01-01)을 고르면 [삭제]·[행 추가]·[행 삭제]·[저장]이 꺼진다
    const fixedIdx = need(await h.findRowIdx(g1(), { startDate: '2024-01-01' }), '확정 행');
    await clickRow(g1(), fixedIdx);
    out.disabledOnFixed = { del: await dis(/삭\s*제/), addRow: await dis(/행\s*추가/), delRow: await dis(/행\s*삭제/), save: await dis(/저\s*장/) };
    out.rows2Fixed = await h.rows(g2());
    await h.btn(scr(), /^\s*확\s*정\s*$/).click(); out.msgFixAgain = await h.msgs(); await h.wait(2800);
    // 확정취소: 사용중이 아니라서 확인창이 뜬다 → [아니오]
    await h.btn(scr(), /확정\s*취소/).click(); await h.wait(1200);
    out.cancelFixConfirm = await h.confirmText(); await h.confirmNo();
    // 확정 전 행(2025-01-01)에서 확정취소 → 안내
    const openIdx = need(await h.findRowIdx(g1(), { startDate: '2025-01-01' }), '확정 전 행');
    await clickRow(g1(), openIdx);
    await h.btn(scr(), /확정\s*취소/).click(); out.msgCancelBeforeFix = await h.msgs(); await h.wait(2800);

    // 평가등급 창 — 확정 행: [조회]만, [저장] 없음
    await cell(g1(), fixedIdx, 'actionCell').locator('.anticon').first().click(); await h.wait(1500);
    let m = h.modal('평가등급');
    await m.waitFor();
    out.gradeFixedButtons = await h.buttons(m);
    out.gradeFixedHeaders = await h.headers(m.locator('.ag-root-wrapper').first());
    out.gradeFixedRows = await h.rows(m.locator('.ag-root-wrapper').first());
    out.gradeFixedFirst = (await h.rowsText(m.locator('.ag-root-wrapper').first()))[0];
    await p.screenshot({ path: `${OUT}/E26-grade-fixed.png` });
    await h.btn(m, /닫\s*기/).click(); await h.wait(600);

    // 그리드 기본 점검(06 항목 6) — 항목 그리드
    out.grid2Check = await checkGrid(p, scr().locator('.ag-root-wrapper').nth(1).locator('xpath=..'));
    out.gridOk = gridOk(out.grid2Check);

    // ── [등록] → 생성 창
    await h.btn(scr(), /^\s*등\s*록\s*$/).click(); await h.wait(800);
    m = h.modal('생성');
    await m.waitFor();
    out.insertButtons = await h.buttons(m);
    out.insertDefault = { year: await m.locator('input').first().inputValue(), month: (await m.locator('.ant-select-selection-item').first().innerText()).trim() };
    await p.screenshot({ path: `${OUT}/E26-insert.png` });
    await m.locator('input').first().fill('');
    await h.btn(m, /생\s*성/).click(); out.msgInsertNoYear = await h.msgs(); await h.wait(2800);
    await m.locator('input').first().fill('2025');
    await m.locator('.ant-select').first().click(); await h.wait(300);
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option').filter({ hasText: /^1월$/ }).first().click(); await h.wait(300);
    await h.btn(m, /생\s*성/).click(); out.msgInsertDup = await h.msgs(); await h.wait(2800);
    await m.locator('input').first().fill('2099');   // 월은 위에서 고른 1월 그대로 (목록이 가상화라 12월은 스크롤해야 보인다)
    await h.btn(m, /생\s*성/).click(); await h.wait(2500);
    out.insertClosed = (await h.modal('생성').count()) === 0;
    out.rows1AfterInsert = await h.rows(g1());
    out.first1AfterInsert = (await h.rowsText(g1()))[0];
    out.rows2AfterInsert = await h.rows(g2());   // 가장 최근(오늘 이전) 적용일의 항목이 복사됨
    out.enabledOnNew = { del: !(await dis(/삭\s*제/)), addRow: !(await dis(/행\s*추가/)), saveDisabled: await dis(/저\s*장/) };
    const testIdx = need(await h.findRowIdx(g1(), { startDate: TEST_DATE }), '시험 적용일');
    out.testIdx = testIdx;
    await p.screenshot({ path: `${OUT}/E26-created.png` });

    // ── 가중치 검사: 조직원 +1 → 합계 101 → 안내, 둘째 행 -1 → 저장
    const m0 = await numAt(g2(), 0, 'weightMember'), m1 = await numAt(g2(), 1, 'weightMember');
    await type(g2(), 0, 'weightMember', String(m0 + 1));
    out.saveLabelEdited = (await h.btn(scr(), /저\s*장/, 0).innerText()).replace(/\s/g, '');
    await h.btn(scr(), /저\s*장/).click(); await h.wait(800);
    out.msgBadMember = await h.msgs(); await h.wait(2800);
    const l0 = await numAt(g2(), 0, 'weightLeader');
    await type(g2(), 1, 'weightMember', String(m1 - 1));
    await type(g2(), 0, 'weightLeader', String(l0 + 1));
    await h.btn(scr(), /저\s*장/).click(); await h.wait(800);
    out.msgBadLeader = await h.msgs(); await h.wait(2800);
    await type(g2(), 0, 'weightLeader', String(l0));
    await h.btn(scr(), /저\s*장/).click(); await h.wait(1800);
    out.msgSaved = await h.msgs(); await h.wait(2800);
    out.afterSave = { m0: await numAt(g2(), 0, 'weightMember'), m1: await numAt(g2(), 1, 'weightMember'), expect: [m0 + 1, m1 - 1] };

    // ── 행 추가 → 입력 → 저장 → 체크해 행 삭제(저장 전엔 서버에 안 감) → 저장
    const before = await h.rows(g2());
    await h.btn(scr(), /행\s*추가/).click(); await h.wait(600);
    const ni = need(await h.findRowIdx(g2(), { content: '', evalClassName: '' }), '새 행');
    await pick(g2(), ni, 'evalClassName', '업무공헌도');
    await type(g2(), ni, 'content', '시험 행');
    await type(g2(), ni, 'weightMember', '0');
    await type(g2(), ni, 'weightLeader', '0');
    await type(g2(), ni, 'seq', '99');
    await h.btn(scr(), /저\s*장/).click(); await h.wait(1800);
    out.msgAddSaved = await h.msgs(); await h.wait(2800);
    out.rowsAfterAdd = { before, after: await h.rows(g2()) };
    const ti = need(await h.findRowIdx(g2(), { content: '시험 행' }), '시험 행');
    out.testRow = (await h.rowsText(g2())).filter(t => /시험 행/.test(t));
    await uncheckAll(g2());
    await g2().locator(`.ag-row[row-index="${ti}"] .ag-checkbox-input`).first().check();
    const gets = api.writes.length;
    await h.btn(scr(), /행\s*삭제/).click(); await h.wait(800);
    out.rowsAfterRemove = await h.rows(g2());
    out.noServerOnRemove = api.writes.length === gets;
    out.saveLabelPendingDelete = (await h.btn(scr(), /저\s*장/).innerText()).replace(/\s/g, '');
    await h.btn(scr(), /저\s*장/).click(); await h.wait(1800);
    out.msgRemoveSaved = await h.msgs(); await h.wait(2800);
    out.rowsAfterRemoveSave = await h.rows(g2());
    out.testRowGone = (await h.rowsText(g2())).filter(t => /시험 행/.test(t)).length === 0;

    // ── 평가등급 창(시험 적용일, 확정 전): 등록 → 저장 → 삭제 → 저장
    const ti1 = need(await h.findRowIdx(g1(), { startDate: TEST_DATE }), '시험 적용일(등급)');
    await cell(g1(), ti1, 'actionCell').locator('.anticon').first().click(); await h.wait(1500);
    m = h.modal('평가등급');
    await m.waitFor();
    const mg = m.locator('.ag-root-wrapper').first();
    out.gradeButtons = await h.buttons(m);
    out.gradeRows = await h.rows(mg);
    await p.screenshot({ path: `${OUT}/E26-grade.png` });
    await h.btn(m, /^\s*등\s*록\s*$/).click(); await h.wait(800);
    const gi = need(await h.findRowIdx(mg, { grade: '' }), '새 등급 행');
    await type(mg, gi, 'grade', 'ZZ');
    await type(mg, gi, 'gradeWeight', '1.5');
    await type(mg, gi, 'gradeScore', '7');
    await pick(mg, gi, 'compareName', '미만');
    await cell(mg, gi, 'reasonYn').locator('input[type=checkbox]').first().click(); await h.wait(300);
    await h.btn(m, /저\s*장/).click(); await h.wait(1800);
    out.msgGradeSaved = await h.msgs(); await h.wait(2800);
    out.gradeRowsAfterAdd = await h.rows(mg);
    out.gradeZZ = (await h.rowsText(mg)).filter(t => /ZZ/.test(t));
    const zi = need(await h.findRowIdx(mg, { grade: 'ZZ' }), 'ZZ 행');
    await cell(mg, zi, 'grade').click(); await h.wait(300);
    await h.btn(m, /^\s*삭\s*제\s*$/).click(); await h.wait(600);
    out.gradeRowsAfterRemove = await h.rows(mg);
    await h.btn(m, /저\s*장/).click(); await h.wait(1800);
    out.msgGradeRemoveSaved = await h.msgs(); await h.wait(2800);
    out.gradeRowsFinal = await h.rows(mg);
    await h.btn(m, /닫\s*기/).click(); await h.wait(600);

    // ── 확정 → 확정취소 (시험 적용일)
    await clickRow(g1(), need(await h.findRowIdx(g1(), { startDate: TEST_DATE }), '시험 적용일(확정)'));
    await h.btn(scr(), /^\s*확\s*정\s*$/).click(); await h.wait(800);
    out.fixConfirm = await h.confirmText(); await h.confirmYes();
    out.msgFix = await h.msgs(); await h.wait(1500);
    out.testFixedRow = (await h.rowsText(g1())).filter(t => /2099-01-01/.test(t));
    await clickRow(g1(), need(await h.findRowIdx(g1(), { startDate: TEST_DATE }), '시험 적용일(확정됨)'));
    out.disabledAfterFix = { del: await dis(/삭\s*제/), save: await dis(/저\s*장/) };
    await h.btn(scr(), /확정\s*취소/).click(); await h.wait(1200);
    out.cancelConfirm = await h.confirmText(); await h.confirmYes(); await h.wait(1200);
    out.testRowAfterCancel = (await h.rowsText(g1())).filter(t => /2099-01-01/.test(t));

    // ── 삭제 (시험 적용일)
    await clickRow(g1(), need(await h.findRowIdx(g1(), { startDate: TEST_DATE }), '시험 적용일(삭제)'));
    await h.btn(scr(), /^\s*삭\s*제\s*$/).click(); await h.wait(800);
    out.deleteConfirm = await h.confirmText(); await h.confirmYes();
    await h.wait(1500);
    out.rows1AfterDelete = await h.rows(g1());
    out.rows2AfterDelete = await h.rows(g2());
    out.testGone = (await h.rowsText(g1())).filter(t => /2099-01-01/.test(t)).length === 0;
    await p.screenshot({ path: `${OUT}/E26-final.png` });
    out.writes = api.writes;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E26-err.png` }).catch(() => {});
    out.writes = api.writes;
    out.cleanup = "yunhee sql \"select emp40_eval_list_std_id from emp40_eval_list_std where emp40_start_date='2099-12-01'\" → 화면에서 [삭제] 또는 yunhee api DELETE /v1/emp/eval-list-stds/<ID>";
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
