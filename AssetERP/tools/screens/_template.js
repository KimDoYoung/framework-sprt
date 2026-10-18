// {ID} {클래스}({메뉴 이름} #{화면번호}) 화면 확인 — 새 스크립트는 이 파일을 복사해서 TODO를 채운다. (E18·E19 실사용 기반 CRUD 샘플)
// 흐름: 열기 → 조회 → 선택 없는 삭제 안내 → 그리드 기본 점검 → 등록(필수 검사·저장) → 수정 → 삭제(확인 아니오·예)
// 시험 행은 TODO-제목으로 만들고 끝에서 지운다. 중간에 실패하면 catch에서 API로 지운다(남으면 다음 실행이 중복 오류로 연쇄 실패).
// 부작용이 큰 쓰기(여러 회사에 행을 채우는 호출 등)는 h.mockWrite로 응답을 대체하고 DB 테스트로 확인한다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/{ID}.js <스크린샷 폴더> [회사]
// 헬퍼: _common.js helpers(). 함정은 아래 "함정" 절과 08-회차인계 E17~E19 줄.
//
// 함정 (겪은 순서)
//  1. checkGrid()는 행 하나를 선택한 채 끝난다 → "선택 없음" 검사(삭제·내보내기 안내)를 checkGrid 앞에 하거나, 뒤에 다시 조회해 선택을 푼다.
//  2. 아이콘 열(수정·상세보기)이 화면 밖이면 DOM에 없다(열 가상화) → 클릭 전 `h.scrollX(grid, 5000)`, 뒤에 `h.scrollX(grid, 0)`.
//  3. 조회창·모달은 Esc로 안 닫힌다 → `h.btn(h.modal('제목'), /취\s*소|닫\s*기/).click()`.
//  4. 변경 0건이면 `저장(0)`이 비활성이라 클릭하면 30초 대기한다 → `h.saveDisabled(scope)`로 먼저 본다.
//  5. 모달 안 입력은 `.ant-input`(Input)·`textarea`·`[contenteditable="true"]`(HtmlEditor)·`.ant-select`(콤보) 순서 인덱스로 고른다.
//  6. 두 글자 버튼은 공백이 낀다 → `/^\s*조\s*회\s*$/`처럼 쓴다. 같은 이름 버튼이 둘이면 n번째.
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
const TITLE = 'TODO시험행';                         // 시험 행 제목(코드) — 검색해서 찾을 값
(async () => {
  const { b, p, errs } = await launch();
  const h = helpers(p);
  const out = { errs };
  const api = h.trackApi(['TODO-domain/']);      // 이 화면이 부르는 /api/v1/ 아래 경로 머리 (예: 'dcr/', 'rpt/')
  const search = () => h.btn(scr(), /^\s*조\s*회\s*$/).click().then(() => h.wait(1200));
  const scr = () => p.locator('.flexlayout__tab:visible').last();
  try {
    // const check = await h.mockWrite('**/api/v1/TODO/check');   // 열 때 부르는 쓰기를 대체해야 하면
    await login(p, COMPANY);
    await openMenu(p, 'TODO-1차메뉴', 'TODO-메뉴이름');
    await h.wait(2500);
    const grid = scr().locator('.ag-root-wrapper').first();

    // ── 열기: 버튼·헤더·행 (06 항목 6, 10). 원본이 열 때 조회하지 않는 화면이면 rowsOpen이 0이어야 한다
    out.buttons = await h.buttons(scr());
    out.headers = await h.headers(grid);
    out.rowsOpen = await h.rows(grid);
    out.getsOpen = api.gets.slice();
    await p.screenshot({ path: `${OUT}/TODO-open.png` });

    // ── 조회
    await search();
    out.rowsAfterSearch = await h.rows(grid);
    out.firstRow = (await h.rowsText(grid))[0];

    // ── 선택 없는 삭제 안내 (함정 1: checkGrid보다 먼저)
    await h.btn(scr(), /삭\s*제/).click();
    out.msgDeleteNone = await h.msgs(); await h.wait(2800);

    // ── 06 항목 7-1: 그리드 기본 점검 (정렬 없음·체크박스 동작) — 그리드마다. 끝나면 행이 선택돼 있으니 다시 조회
    out.grid = await checkGrid(p, scr());
    out.gridOk = gridOk(out.grid);
    await search();

    // ── 등록: 필수 검사 → 입력 → 저장
    await h.btn(scr(), /^\s*등\s*록\s*$/).click();
    const reg = h.modal('TODO-등록팝업제목');
    await reg.waitFor();
    out.regButtons = await h.buttons(reg);
    await h.btn(reg, /저\s*장/).click();
    out.msgRequired = await h.msgs(); await h.wait(2800);
    // TODO: 필수값 입력 — 예: await reg.locator('input.ant-input').nth(0).fill(TITLE);
    //       콤보: await reg.locator('.ant-select').first().click(); await p.locator('.ant-select-dropdown:visible .ant-select-item-option').first().click();
    //       편집기: await reg.locator('[contenteditable="true"]').first().click(); await p.keyboard.type('내용');
    await p.screenshot({ path: `${OUT}/TODO-reg.png` });
    await h.btn(reg, /저\s*장/).click();
    await h.wait(1800);
    out.regClosed = (await reg.count()) === 0;

    // ── 시험 행 찾기 → 수정 (함정 2: 아이콘 열은 scrollX 뒤에)
    // TODO: await scr().locator('input[placeholder="TODO-검색칸"]').fill(TITLE); await search();
    out.rowsFound = await h.rowsText(grid);
    await h.scrollX(grid, 5000);
    await grid.locator('.ag-row[row-index="0"] [col-id="actionCell"]').first().click();   // col-id는 iconCell 두 번째 인자
    await h.scrollX(grid, 0);
    const ed = h.modal('TODO-수정팝업제목');
    await ed.waitFor();
    // TODO: 값 바꾸기 → await h.btn(ed, /저\s*장|수\s*정/).click(); await h.wait(1800);
    out.rowsAfterUpdate = await h.rowsText(grid);

    // ── 삭제: 확인창 → 아니오 → 예
    await grid.locator('.ag-row[row-index="0"] .ag-checkbox-input').first().check();
    await h.btn(scr(), /삭\s*제/).click();
    out.confirm = await h.confirmText();
    await h.confirmNo();
    out.rowsAfterNo = await h.rows(grid);
    await h.btn(scr(), /삭\s*제/).click();
    await h.confirmYes();
    out.msgDeleted = await h.msgs(); await h.wait(2800);
    out.rowsAfterDelete = await h.rows(grid);
    out.writes = api.writes;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/TODO-err.png` }).catch(() => {});
    out.writes = api.writes;
    // 시험 행이 남았을 수 있다 — 아래 SQL로 확인하고 `yunhee api DELETE <경로> -b '[<ID>]'`로 지운다 (다음 실행 전에 꼭)
    out.cleanup = "yunhee sql \"select * from TODO-테이블 where TODO-제목컬럼 = '" + TITLE + "'\"";
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
