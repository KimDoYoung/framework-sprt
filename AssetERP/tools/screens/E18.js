// E18 Dcr05_Tab_DocType(문서양식등록 #1482) 화면 확인
// 시험 양식 하나를 [등록]으로 만들고 [상세보기]에서 고친 뒤 [삭제]로 지운다(실패해도 끝에서 API로 지운다).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E18.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const h = helpers(p);
  const out = { errs };
  const api = h.trackApi(['dcr/doc-types', 'sys/codes', 'sys/companies', 'sys/code-kinds']);
  const created = [];
  const TITLE = 'E18시험양식';
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '문서양식등록');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await h.wait(2500);

    // ── 열기: 원본은 열 때 조회하지 않는다
    const grid = scr.locator('.ag-root-wrapper').first();
    out.buttons = await h.buttons(scr);
    out.headers = await h.headers(grid);
    out.rowsOpen = await h.rows(grid);
    out.getsOpen = api.gets.slice();
    await p.screenshot({ path: `${OUT}/E18-open.png` });

    // ── 조회
    await h.btn(scr, /^\s*조\s*회\s*$/).click();
    await h.wait(1500);
    out.rowsAfterSearch = await h.rows(grid);
    out.firstRow = (await h.rowsText(grid))[0];
    // ── 선택 없이 삭제·내보내기
    await h.btn(scr, /삭\s*제/).click();
    out.msgDeleteNone = await h.msgs(); await h.wait(2800);
    const push = h.btn(scr, /내보내기/);
    if (await push.count()) { await push.click(); out.msgPushNone = await h.msgs(); await h.wait(2800); }

    // 선택 없는 검사가 끝난 뒤 그리드 기본 점검(행 하나를 선택한 채 끝난다) → 다시 조회해 선택을 푼다
    out.grid = await checkGrid(p, scr);
    out.gridOk = gridOk(out.grid);

    await h.btn(scr, /^\s*조\s*회\s*$/).click();
    await h.wait(1500);

    // ── 등록: 필수 검사 → 저장
    await h.btn(scr, /^\s*등\s*록\s*$/).click();
    const reg = h.modal('문서양식 등록');
    await reg.waitFor();
    out.regButtons = await h.buttons(reg);
    await h.btn(reg, /저\s*장/).click();
    out.msgNoClass = await h.msgs(); await h.wait(2800);
    await reg.locator('.ant-select').first().click();
    await p.locator('.ant-select-dropdown:visible .ant-select-item-option').last().click();
    await h.btn(reg, /저\s*장/).click();
    out.msgNoTitle = await h.msgs(); await h.wait(2800);
    await reg.locator('input').nth(1).fill(TITLE);
    await h.btn(reg, /저\s*장/).click();
    out.msgNoContent = await h.msgs(); await h.wait(2800);
    await reg.locator('[contenteditable="true"]').first().click();
    await p.keyboard.type('E18 시험 내용');
    await reg.locator('textarea').fill('E18 비고');
    await p.screenshot({ path: `${OUT}/E18-reg.png` });
    await h.btn(reg, /저\s*장/).click();
    await h.wait(2000);
    out.regClosed = (await reg.count()) === 0;

    // ── 목록에서 시험 양식 찾기 → 상세보기
    const search = scr.locator('input[placeholder="양식제목/비고"]');
    await search.fill(TITLE);
    await h.btn(scr, /^\s*조\s*회\s*$/).click();
    await h.wait(1500);
    out.rowsFound = await h.rowsText(grid);
    await grid.locator('.ag-row[row-index="0"] [col-id="actionCell"] span, .ag-row[row-index="0"] [col-id="actionCell"] svg, .ag-row[row-index="0"] [col-id="actionCell"]').first().click();
    const det = h.modal('상세 보기');
    await det.waitFor();
    out.detButtons = await h.buttons(det);
    out.detTitle = await det.locator('input').nth(1).inputValue();
    await det.locator('input').nth(1).fill(TITLE + '2');
    await p.screenshot({ path: `${OUT}/E18-detail.png` });
    await h.btn(det, /^\s*수\s*정\s*$/).click();
    await h.wait(2000);
    out.detClosed = (await det.count()) === 0;
    out.rowsAfterUpdate = await h.rowsText(grid);

    // ── 구분추가 / 고객사(admin 회사만)
    await h.btn(scr, /구\s*분\s*추\s*가/).click();
    const code = h.modal('코드추가');
    await code.waitFor();
    out.codeButtons = await h.buttons(code);
    await p.screenshot({ path: `${OUT}/E18-code.png` });
    await h.btn(code, /닫\s*기/).click();
    await h.wait(800);
    const co = scr.locator('input[readonly]').first();
    if (await co.count()) {
      out.companyText = await co.inputValue();
      await co.click();
      out.companyModal = await h.modal('고객').count();
      await h.btn(h.modal('고객'), /취\s*소/).click();
      await h.wait(600);
    }

    // ── 삭제: 확인창 → 아니오 → 예
    await search.fill(TITLE);
    await h.btn(scr, /^\s*조\s*회\s*$/).click();
    await h.wait(1500);
    await grid.locator('.ag-row[row-index="0"] .ag-checkbox-input').first().check();
    await h.btn(scr, /삭\s*제/).click();
    out.confirm = await h.confirmText();
    await h.confirmNo();
    out.rowsAfterNo = await h.rows(grid);
    await h.btn(scr, /삭\s*제/).click();
    await h.confirmYes();
    out.msgDeleted = await h.msgs(); await h.wait(2800);
    out.rowsAfterDelete = await h.rows(grid);
    out.writes = api.writes;
    out.created = created;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/E18-err.png` }).catch(() => {});
    out.writes = api.writes;
    out.created = created;
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
