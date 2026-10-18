// {ID} {클래스}({메뉴 이름} #{화면번호}) 화면 확인 — 새 스크립트는 이 파일을 복사해서 TODO를 채운다.
// 시험 행을 만들면 끝에서 지우고(실패해도 지우는 cleanup), 남으면 마지막 줄 created/restore를 보고 API로 지운다.
// 부작용이 큰 쓰기(여러 회사에 행을 채우는 호출 등)는 h.mockWrite로 응답을 대체하고 DB 테스트로 확인한다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/{ID}.js <스크린샷 폴더> [회사]
// 헬퍼: _common.js helpers() — 함정 목록은 08-회차인계 E17 줄 / 11-프론트부품.md "antd Tree 함정"
const { launch, login, openMenu, checkGrid, gridOk, helpers } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const h = helpers(p);
  const out = { errs };
  const api = h.trackApi(['TODO-domain/']);      // 이 화면이 부르는 /api/v1/ 아래 경로 머리 (예: 'dcr/', 'com/')
  const created = [];                             // 시험으로 만든 행 — 마지막에 지우거나 출력
  try {
    // const check = await h.mockWrite('**/api/v1/TODO/check');   // 열 때 부르는 쓰기를 대체해야 하면
    await login(p, COMPANY);
    await openMenu(p, 'TODO-1차메뉴', 'TODO-메뉴이름');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await h.wait(2500);

    // ── 열기: 버튼·헤더·행·체크박스 (06 항목 6, 10)
    const grids = scr.locator('.ag-root-wrapper');
    out.buttons = await h.buttons(scr);
    out.headers = await h.headers(grids.nth(0));
    out.rows = await h.rows(grids.nth(0));
    out.getsOpen = api.gets.slice();
    await p.screenshot({ path: `${OUT}/TODO-open.png` });

    // ── 06 항목 7-1: 그리드 기본 점검 (정렬 없음·체크박스 동작) — 그리드마다
    out.grid = await checkGrid(p, scr);
    out.gridOk = gridOk(out.grid);

    // ── 06 항목 7: 동작 (화면에 있는 기능을 하나씩)
    // 변경이 없으면 저장 버튼은 비활성: out.saveDisabled = await h.saveDisabled(scr);
    // 메시지: await h.btn(scr, /삭\s*제/).click(); out.msg = await h.msgs(); await h.wait(2800);
    // 모달: const m = h.modal('TODO-제목'); out.modal = await h.buttons(m);
    // 화면 밖 열의 셀: await h.scrollX(grid, 5000); 뒤에 그 열 셀을 누른다
    // 트리: await h.treeNodes(m).first().click();
    // 확인창: out.confirm = await h.confirmText(); await h.confirmNo();   // 지우기는 h.confirmYes()
    out.writes = api.writes;
    out.created = created;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/TODO-err.png` }).catch(() => {});
    out.writes = api.writes;
    out.created = created;
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
