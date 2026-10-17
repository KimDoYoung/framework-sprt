// D01 I/F 설정(Ifi90_Tab_Config, #1445) 화면 확인: 열기 → 버튼·헤더·행 수·편집 폼 → 검색·초기화 → 등록(검사 3종 → 저장) → 삭제(미선택·사용중·시험 행).
// 시험 행(ZZ_D01_UI)은 끝에 지운다. 실패해도 cleanup 으로 지운다. 메뉴 #1445는 admin 회사에 켜져 있다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/D01.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  p.on('request', r => { if (['PUT', 'POST', 'DELETE'].includes(r.method()) && r.url().includes('/api/v1/ifi/')) writes.push(r.method() + ' ' + r.url().split('/api/v1/ifi/')[1].split('?')[0]); });
  let scr;
  const btn = re => scr.locator('button').filter({ hasText: re }).first();
  const msgs = async () => (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' ');
  const rows = () => scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
  const panel = () => scr.locator('.ant-splitter-panel').nth(1);
  const inputs = () => panel().locator('input.ant-input');
  const confirmYes = async () => { await p.locator('.ant-modal-confirm-btns button').filter({ hasText: /예/ }).first().click(); await wait(1200); };
  const selectRow = async text => { await rows().filter({ hasText: text }).first().locator('.ag-selection-checkbox input').first().click({ force: true }); await wait(400); };
  try {
    await login(p, COMPANY);
    await openMenu(p, 'I/F', 'I/F 설정');
    scr = p.locator('.flexlayout__tab:visible').last();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.groups = (await scr.locator('.ag-header-group-cell-label').allInnerTexts()).join('|');
    out.rowsOpen = await rows().count();                                         // [E0] 5행
    out.selectedOpen = await scr.locator('.ag-row-selected').count();            // 첫 행 선택
    out.formFirst = [await inputs().nth(0).inputValue(), await inputs().nth(1).inputValue()].join('/');   // [E2] 첫 행 → 편집 폼
    out.firstRow = (await rows().first().innerText()).replace(/\s+/g, ' ');
    // 검색 [E1][E3]
    const search = scr.locator('input[placeholder^="IF코드"]');
    await search.fill('SHFP'); await search.press('Enter'); await wait(1200);
    out.rowsSearch = await rows().count();                                       // 1
    await btn(/초기화/).click(); await wait(400);
    out.searchAfterReset = await search.inputValue();
    await btn(/^\s*조\s*회\s*$/).click(); await wait(1200);
    out.rowsRetrieve = await rows().count();                                     // 5
    out.grid = await checkGrid(p, scr); out.gridOk = gridOk(out.grid);
    // 행 선택 → 편집 폼 [E2]
    await selectRow('REST_0010');
    out.formAfterSelect = await inputs().nth(0).inputValue();
    // 삭제: 사용중인 설정 → 서버 오류 [E5][E6]
    await btn(/^\s*삭\s*제\s*$/).click(); await wait(400);
    await confirmYes();
    out.deleteUsedMsg = await msgs();
    out.rowsAfterUsed = await rows().count();
    // 삭제: 선택 없음("삭제대상을 선택하세요")은 단일 선택 그리드라 선택을 풀 수 없어 화면에서는 시험하지 않는다
    // 등록 [E4] → 저장 [E1]: 검사 3종 → 완료
    await btn(/^\s*등\s*록\s*$/).click(); await wait(600);
    out.rowsInsert = await rows().count();                                       // 6
    out.formBlank = [await inputs().nth(0).inputValue(), await inputs().nth(1).inputValue()].join('/');
    const save = () => panel().locator('button').filter({ hasText: /저\s*장/ }).first();
    await save().click(); await wait(500); out.msgNoCode = await msgs();
    await inputs().nth(0).fill('ZZ_D01_UI');
    await save().click(); await wait(500); out.msgNoName = await msgs();
    await inputs().nth(1).fill('D01 화면시험(삭제예정)');
    await save().click(); await wait(500); out.msgNoType = await msgs();
    await panel().locator('.ant-select').first().click(); await wait(400);
    await p.locator('.ant-select-item-option').filter({ hasText: 'FTP' }).first().click(); await wait(300);
    await inputs().nth(2).fill('host-ui');   // Local Host
    await save().click(); await wait(1500); out.msgSaved = await msgs();
    out.rowsSaved = await rows().count();
    out.savedRow = (await rows().filter({ hasText: 'ZZ_D01_UI' }).first().innerText()).replace(/\s+/g, ' ');
    out.formAfterSave = [await inputs().nth(0).inputValue(), await inputs().nth(2).inputValue()].join('/');
    await p.screenshot({ path: `${OUT}/D01-${COMPANY}.png` });
  } catch (e) { out.err = e.message.split('\n')[0]; await p.screenshot({ path: `${OUT}/D01-err.png` }).catch(() => {}); }
  // cleanup: 시험 행 삭제 [E5][E6]
  try {
    if (scr) {
      await btn(/^\s*조\s*회\s*$/).click(); await wait(1000);
      const test = rows().filter({ hasText: 'ZZ_D01_UI' });
      if (await test.count()) {
        await test.first().locator('.ag-selection-checkbox input').first().click({ force: true }); await wait(300);
        await btn(/^\s*삭\s*제\s*$/).click(); await wait(400);
        await p.locator('.ant-modal-confirm-btns button').filter({ hasText: /예/ }).first().click(); await wait(1200);
        out.deleteTestMsg = await msgs();
      }
      out.rowsFinal = await rows().count();                                      // 5
    }
  } catch (e) { out.cleanupErr = e.message.split('\n')[0]; }
  out.writes = writes;
  await b.close();
  console.log(JSON.stringify(out, null, 1));
})();
