// E01 법규관리(관리자)(Ics01_Tab_ClassTree #1012 + Ics01_Edit_ClassTree·Ics01_Move_TreeGrid·Ics01_Grid_IcsType·Ics01_Move_Grid·Ics01_Lookup_Content·Ics20_Lookup_RevisionHistory·
//   Ics20_Lookup_File·Ics20_Lookup_Content·Ics01_Lookup_IcsFile·Ics01_Lookup_IcsFileAdmin·Ics01_Lookup_RelateTdm·Ics01_Lookup_SelectTdm) 화면 확인.
// 시험 분류 2개(코드 ZTE01·ZTE02)와 시험 법규 1개를 만들어 쓰고, 마지막에 시험 분류를 [삭제](하위 포함)로 지운다.
// 실패해서 남으면 마지막 줄 leftover의 classTreeId를 `yunhee api DELETE /api/v1/ics/class-trees/<id>`로 지운다(삭제 이력 ics99에 남는다).
// 기존 데이터는 바꾸지 않는다(기존 법규는 열어 보기만 한다).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E01.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, steps: {} };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  const gets = [];
  p.on('request', r => {
    const u = r.url();
    if (!u.includes('/api/v1/ics/') && !u.includes('/api/v1/tdm/')) return;
    const path = decodeURIComponent(u.split('/api/v1/')[1]);
    if (['PUT', 'POST', 'DELETE'].includes(r.method())) writes.push(r.method() + ' ' + path);
    else gets.push(path);
  });
  let scr;
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const modal = title => p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: title }) });
  const treeGrid = () => scr.locator('.ag-root-wrapper').first();
  const lawGrid = () => scr.locator('.ag-root-wrapper').nth(1);
  const rowsOf = g => g.locator('.ag-row[row-index]');
  const countRows = g => g.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const btn = (scope, re) => scope.locator('button').filter({ hasText: re }).first();
  const treeRow = name => treeGrid().locator('.ag-row', { hasText: name }).first();
  const confirmYes = async () => { await p.locator('.ant-modal-confirm .ant-btn-primary').click(); await wait(1200); };
  const created = [];
  // 열이 많아 가로로 밀려 화면 밖 열은 그려지지 않는다 — 열이 나타날 때까지 가로 스크롤. 행은 row-index로(고정 열·가운데 열이 따로 그려진다)
  const rowIndexOf = (gridLoc, text) => gridLoc.evaluate((el, t) => { const r = [...el.querySelectorAll('.ag-row[row-index]')].find(x => x.innerText.includes(t)); return r ? r.getAttribute('row-index') : null; }, text);
  const clickIcon = async (gridLoc, idx, colId) => {
    const vp = gridLoc.locator('.ag-body-horizontal-scroll-viewport');
    await vp.evaluate(el => { el.scrollLeft = 0; });
    await wait(250);
    for (let i = 0; i < 14; i++) {
      const c = gridLoc.locator(`.ag-row[row-index="${idx}"] .ag-cell[col-id="${colId}"] .anticon`);
      if (await c.count()) { await c.first().click(); return; }
      await vp.evaluate(el => { el.scrollLeft += 400; });
      await wait(250);
    }
    throw new Error('icon not found: ' + colId);
  };
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '법규관리(관리자)');
    scr = p.locator('.flexlayout__tab:visible').last();
    await wait(1000);
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.treeHeaders = (await treeGrid().locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.lawHeaders = (await lawGrid().locator('.ag-header-cell-text').allInnerTexts()).join('|').replace(/\n/g, '');
    out.treeRowsOpen = await countRows(treeGrid());                      // 최상위만 보임(접힘)
    out.getsOpen = gets.slice();                                                // class-trees?typeCode=IC 1건, laws 요청 없음(분류를 고르기 전)
    out.lawBtnsDisabledBeforeSelect = [await btn(scr, /^\s*삭\s*제\s*$/).isDisabled(), await btn(scr, /^\s*등\s*록\s*$/).isDisabled(), await btn(scr, /저\s*장/).isDisabled()];

    // [E6] 선택 없이 하위등록 → 경고
    await btn(scr, /하위등록/).click(); out.noSelectChild = await msgs();

    // [E3][E4] 펼치기·감추기
    await btn(scr, /펼치기/).click(); await wait(500); out.rowsExpanded = await countRows(treeGrid());
    await btn(scr, /감추기/).click(); await wait(500); out.rowsCollapsed = await countRows(treeGrid());

    // [E7] 트리에서 분류 선택 → 법규 조회
    const g0 = gets.length;
    await treeGrid().locator('.ag-row[row-index="0"] .ag-cell[col-id="classTreeCode"]').click(); await wait(1500);
    out.getsOnSelect = gets.slice(g0);
    out.lawRowsOnSelect = await countRows(lawGrid());
    out.lawBtnsEnabledAfterSelect = [!(await btn(scr, /^\s*삭\s*제\s*$/).isDisabled()), !(await btn(scr, /^\s*등\s*록\s*$/).isDisabled())];
    out.lawGrid = await checkGrid(p, lawGrid()); out.lawGridOk = gridOk(out.lawGrid);
    const first = lawGrid().locator('.ag-row[row-index="0"]');
    out.firstLawText = ((await first.innerText()).replace(/\s+/g, ' ')).slice(0, 120);
    await btn(scr, /검\s*색/).click(); await wait(800);                          // 변경을 버리려고 다시 조회
    // [E1][E2] 법규 검색 (분류코드/법규명)
    const q = scr.locator('input[placeholder="분류코드/법규명"]');
    await q.fill('자산건전성'); await q.press('Enter'); await wait(1200);
    out.lawRowsSearch = await countRows(lawGrid());
    out.getsSearch = gets.slice(-1);
    await scr.locator('.ant-checkbox-wrapper', { hasText: '일임' }).locator('input').click({ force: true });
    await btn(scr, /검\s*색/).click(); await wait(1000);
    out.getsAdvis = gets.slice(-1);                                              // advisYn=true
    await scr.locator('.ant-checkbox-wrapper', { hasText: '일임' }).locator('input').click({ force: true });
    await q.fill(''); await btn(scr, /검\s*색/).click(); await wait(800);

    // [E5] 상위등록(루트등록) — 저장하면 새 분류가 트리에 선택된다
    await btn(scr, /상위등록/).click(); await wait(800);
    let ed = modal('루트등록');
    out.editRootLabels = (await ed.locator('.ant-modal-body span').allInnerTexts()).join('|');
    out.editRootButtons = (await ed.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    const fillEdit = async (code, name) => {
      const inputs = ed.locator('input');
      await inputs.nth(0).fill(code); await inputs.nth(2).fill(name);
    };
    await ed.getByRole('button', { name: /저\s*장/ }).click(); out.editRootEmpty = await msgs();   // 분류코드 비면 막힌다
    await fillEdit('ZTE01', '시험분류E01');
    await ed.getByRole('button', { name: /저\s*장/ }).click(); await wait(1800);
    out.rootCreated = (await treeRow('시험분류E01').count()) > 0;
    out.rootSelected = (await treeGrid().locator('.ag-row-selected', { hasText: '시험분류E01' }).count()) > 0;

    // [E6] 하위등록 — 선택된 시험분류 밑에
    await btn(scr, /하위등록/).click(); await wait(800);
    ed = modal('하위분류 등록');
    await fillEdit('ZTE02', '시험하위E02');
    await ed.getByRole('button', { name: /저\s*장/ }).click(); await wait(1800);
    out.childCreated = (await treeRow('시험하위E02').count()) > 0;
    out.childSelectedOnInsert = (await treeGrid().locator('.ag-row-selected', { hasText: '시험하위E02' }).count()) > 0;
    out.lawRowsOfNewChild = await countRows(lawGrid());                     // 0

    // 수정 아이콘 → 이름 고침(수정 창: 삭제·저장·닫기)
    await treeRow('시험하위E02').locator('.ag-cell[col-id="actionCellEdit"] .anticon').click(); await wait(800);
    ed = modal('법규분류 수정');
    out.editButtons = (await ed.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.editValues = await ed.locator('input').evaluateAll(els => els.map(e => e.value));
    await ed.locator('input').nth(2).fill('시험하위E02수정');
    await ed.getByRole('button', { name: /저\s*장/ }).click(); await wait(1800);
    out.childRenamed = (await treeRow('시험하위E02수정').count()) > 0;

    // 법규 등록 → 셀 편집 → 저장 (하위분류가 선택된 상태)
    await treeRow('시험하위E02수정').locator('.ag-cell[col-id="classTreeCode"]').click(); await wait(1000);
    await btn(scr, /^\s*등\s*록\s*$/).click(); await wait(800);
    out.lawRowsAfterAdd = await countRows(lawGrid());
    out.saveBtnAfterAdd = (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, '');   // 행 추가만으로는 변경이 아니다 → 저장(0)
    const cell = col => lawGrid().locator(`.ag-row[row-index="0"] .ag-cell[col-id="${col}"]`);
    const cellText = async col => { const vp = lawGrid().locator('.ag-body-horizontal-scroll-viewport'); await vp.evaluate(el => { el.scrollLeft = 0; }); for (let i = 0; i < 12; i++) { if (await cell(col).count()) return (await cell(col).innerText()).trim(); await vp.evaluate(el => { el.scrollLeft += 400; }); await wait(250); } return null; };
    await btn(scr, /저\s*장/).click({ force: true }).catch(() => {});
    await cell('classTreeCode').dblclick(); await p.keyboard.type('ZTE02-01'); await p.keyboard.press('Enter'); await wait(300);
    await cell('classTreeName').dblclick(); await p.keyboard.type('시험법규E01'); await p.keyboard.press('Enter'); await wait(300);
    out.saveBtnAfterEdit = (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, '');
    await btn(scr, /저\s*장/).click(); await wait(1800);
    out.saveMsg = await msgs();
    out.lawRowAfterSave = ((await rowsOf(lawGrid()).first().innerText()).replace(/\s+/g, ' ')).slice(0, 100);
    const newLawId = await rowsOf(lawGrid()).first().getAttribute('row-id');
    created.push(newLawId);

    // 법규 상세내용 (수정 아이콘) → 저장 → 닫기(그 행을 다시 읽음)
    await clickIcon(lawGrid(), 0, 'actionCellContent'); await wait(800);
    let cm = modal('법규 상세내용 수정');
    await cm.locator('textarea').fill('시험 상세내용\n둘째 줄');
    await cm.getByRole('button', { name: /저\s*장/ }).click(); out.contentSaveMsg = await msgs();
    await cm.getByRole('button', { name: /닫\s*기/ }).click(); await wait(1200);
    out.contentCellAfter = ((await cellText('content')) || '').replace(/\s+/g, ' ').slice(0, 40);

    // 서식파일 [추가] → 불러오기 → 확인 → 연결 → 삭제 아이콘
    await clickIcon(lawGrid(), 0, 'actionCellFile'); await wait(1000);
    let fm = modal('서식파일');
    out.fileModalButtons = (await fm.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.fileModalHeaders = (await fm.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    await fm.getByRole('button', { name: /불러오기/ }).click(); await wait(1500);
    const am = modal('불러오기');
    out.adminRows = await countRows(am);
    out.adminHeaders = (await am.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    const aq = am.locator('input[placeholder="법령구분/내용/서식파일"]');
    await aq.fill('없는서식파일ZZZ'); await aq.press('Enter'); await wait(1000);
    out.adminRowsNone = await countRows(am);
    await aq.fill(''); await aq.press('Enter'); await wait(1000);
    await am.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').click({ force: true });
    await am.getByRole('button', { name: /확\s*인/ }).click(); await wait(600);
    out.adminConfirm = (await p.locator('.ant-modal-confirm-content').first().innerText()).trim();
    await confirmYes();
    out.fileRowsAfterAdd = await countRows(fm);
    out.fileCountCellAfter = null;
    await fm.locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCellDelete"] .anticon').click(); await wait(1200);   // 확인 창 없이 연결 제거
    out.fileRowsAfterDelete = await countRows(fm);
    await fm.getByRole('button', { name: /닫\s*기/ }).click(); await wait(1200);
    out.fileCountCellAfter = await cellText('fileCount');

    // 연결책무 [수정] 아이콘 → 점검항목연결 후보 조회 → 연결 → 연결제거
    await clickIcon(lawGrid(), 0, 'actionCellTdm'); await wait(1500);
    let tm = modal('연결 책무이행점검');
    out.tdmTitle = (await tm.locator('.ant-modal-title').innerText()).trim();
    out.tdmRowsEmpty = await countRows(tm);
    await tm.getByRole('button', { name: /점검항목연결/ }).click(); await wait(1500);
    const sm = modal('책무이행점검항목(기준회사:KFS)');
    out.tdmCandidates = await countRows(sm);
    out.tdmHeaders = (await sm.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    await sm.getByRole('button', { name: /확\s*인/ }).click(); out.tdmNoSelect = await msgs();
    await sm.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').click({ force: true });
    await sm.getByRole('button', { name: /확\s*인/ }).click(); await wait(1800);
    out.tdmRowsLinked = await countRows(tm);
    await btn(tm, /연결제거/).click(); out.tdmRemoveNoSelect = await msgs();
    await tm.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').click({ force: true });
    await btn(tm, /연결제거/).click(); await wait(500);
    out.tdmRemoveConfirm = (await p.locator('.ant-modal-confirm-content').first().innerText()).trim();
    await confirmYes();
    out.tdmRowsAfterRemove = await countRows(tm);
    await tm.getByRole('button', { name: /닫\s*기/ }).click(); await wait(1000);

    // 법규 이동 아이콘 → 다른 분류로 → 현재 분류의 법규에서 사라진다
    await clickIcon(lawGrid(), 0, 'actionCellMove'); await wait(1200);
    const mv = modal('이동시킬 상위 법규관리를 선택하세요.');
    out.moveGridButtons = (await mv.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    await mv.getByRole('button', { name: /확\s*인/ }).click(); await wait(400);   // 선택 없이 확인 → 아무 일도 없다
    out.moveGridStillOpen = await mv.isVisible();
    await mv.locator('.ant-tree-node-content-wrapper', { hasText: '시험분류E01' }).first().click(); await wait(400);
    await mv.getByRole('button', { name: /확\s*인/ }).click(); await wait(1800);
    out.lawRowsAfterMove = await countRows(lawGrid());                      // 0 (시험하위E02에서 시험분류E01로)
    await treeRow('시험분류E01').locator('.ag-cell[col-id="classTreeCode"]').click(); await wait(1500);
    out.lawRowsInNewParent = await countRows(lawGrid());                    // 1 (시험분류E01 + 하위의 법규)

    // 법규 삭제: 체크 → 삭제 → 확인
    await btn(scr, /^\s*삭\s*제\s*$/).click(); out.deleteNoSelect = await msgs();
    await lawGrid().locator('.ag-row[row-index="0"] .ag-selection-checkbox input').click({ force: true });
    await btn(scr, /^\s*삭\s*제\s*$/).click(); await wait(500);
    out.deleteConfirm = (await p.locator('.ant-modal-confirm-content').first().innerText()).trim();
    await confirmYes();
    out.lawRowsAfterDelete = await countRows(lawGrid());

    // 트리 이동 아이콘: 시험하위E02를 다른 루트(첫 분류) 밑으로
    await treeRow('시험하위E02수정').locator('.ag-cell[col-id="actionCellMove"] .anticon').click().catch(() => {});
    await wait(300);
    // (시험하위E02수정은 시험분류E01 밑이라 접혀 있을 수 있다 — 펼친 뒤 다시)
    if (!(await modal('이동시킬 상위 법규관리를 선택하세요.').isVisible())) {
      await treeRow('시험분류E01').locator('[data-tree-toggle]').click(); await wait(500);
      await treeRow('시험하위E02수정').locator('.ag-cell[col-id="actionCellMove"] .anticon').click(); await wait(1200);
    }
    const mt = modal('이동시킬 상위 법규관리를 선택하세요.');
    await mt.locator('.ant-tree-node-content-wrapper', { hasText: '경영관리' }).first().click(); await wait(300);
    await mt.getByRole('button', { name: /확\s*인/ }).click(); await wait(1800);
    out.treeMoved = (await treeRow('시험하위E02수정').count()) > 0;

    // 개정이력·연결책무(읽기): 기존 데이터가 있는 법규(경영관리 아래 자산건전성 보고)
    await treeRow('경영관리').locator('.ag-cell[col-id="classTreeCode"]').click(); await wait(1500);
    const existIdx = await rowIndexOf(lawGrid(), '자산건전성 보고');
    if (existIdx != null) {
      await clickIcon(lawGrid(), existIdx, 'actionCellRevision'); await wait(1500);
      const rm = modal('개정이력');
      out.revisionRows = await countRows(rm);
      out.revisionHeaders = (await rm.locator('.ag-header-cell-text').allInnerTexts()).join('|');
      await rm.locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCellContent"] .anticon').click(); await wait(1000);
      const rc = modal('내용');
      out.revisionContentButtons = (await rc.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
      await rc.getByRole('button', { name: /닫\s*기/ }).click(); await wait(500);
      await rm.locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCellFile"] .anticon').click(); await wait(800);
      out.revisionFileMsgOrModal = (await msgs()) || ((await modal('첨부파일').isVisible()) ? 'file-modal' : '');
      if (await modal('첨부파일').isVisible()) {
        out.revisionFileRows = await countRows(modal('첨부파일'));
        await modal('첨부파일').getByRole('button', { name: /닫\s*기/ }).click(); await wait(500);
      }
      await rm.getByRole('button', { name: /닫\s*기/ }).click(); await wait(500);

      await clickIcon(lawGrid(), existIdx, 'actionCellTdm'); await wait(1500);
      const tm2 = modal('연결 책무이행점검');
      out.tdmExistRows = await countRows(tm2);
      const tq = tm2.locator('input[placeholder^="직책/책무"]');
      await tq.fill('없는검색어ZZZ'); await tq.press('Enter'); await wait(1000);
      out.tdmExistRowsSearch = await countRows(tm2);
      await tm2.getByRole('button', { name: /닫\s*기/ }).click(); await wait(500);
    }

    // 트리 찾기: 분류명 검색
    await btn(scr, /펼치기/).click(); await wait(300);
    const tq2 = scr.locator('input').first();
    await tq2.fill('시험하위E02수정'); await tq2.press('Enter'); await wait(1200);
    out.treeSearchSelected = (await treeGrid().locator('.ag-row-selected', { hasText: '시험하위E02수정' }).count()) > 0;
    await tq2.fill('');

    // 정리: 시험분류E01 수정 창의 [삭제](하위 포함) — 시험하위E02수정은 경영관리 밑으로 옮겼으므로 따로 지운다
    for (const name of ['시험하위E02수정', '시험분류E01']) {
      const r = treeRow(name);
      if (!(await r.count())) continue;
      await r.locator('.ag-cell[col-id="actionCellEdit"] .anticon').click(); await wait(800);
      const dm = modal('법규분류 수정');
      await dm.getByRole('button', { name: /삭\s*제/ }).click(); await wait(500);
      out['delConfirm_' + name] = (await p.locator('.ant-modal-confirm-content').first().innerText()).trim();
      await confirmYes();
    }
    out.treeAfterCleanup = (await treeGrid().locator('.ag-row', { hasText: '시험' }).count());
    await p.screenshot({ path: `${OUT}/E01-${COMPANY}.png` });
  } catch (e) { out.err = e.message.split('\n')[0]; await p.screenshot({ path: `${OUT}/E01-err.png` }).catch(() => {}); }
  out.writes = writes;
  out.getsCount = gets.length;
  await b.close();
  console.log(JSON.stringify(out, null, 1));
})();
