// A19 비밀번호 초기화(1182) 화면 확인. kfstest(고객사 관리자). **실제 비밀번호 초기화·잠금해제는 하지 않는다** — 두 아이콘 모두 확인 창에서 '아니오'이고, PUT/POST 요청 수가 0인지 센다.
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=<playwright-core 상위 node_modules> node tools/screens/A19.js <스크린샷 폴더>'"
const { BASE, launch, login } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const rows = scr => scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
  const btn = (scr, re) => scr.locator('button').filter({ hasText: re }).first();
  const writes = [];
  p.on('request', r => { if (['PUT', 'POST', 'DELETE'].includes(r.method()) && r.url().includes('/api/v1/sys/')) writes.push(r.method() + ' ' + r.url().split('/api/v1/sys/')[1]); });
  try {
    // 이 DB에는 잠긴 사원이 없어 잠금 아이콘을 볼 수 없다 → 조회 응답의 첫 행만 lockYn 'true'로 바꿔 렌더링을 본다(DB는 그대로)
    await p.route(/\/api\/v1\/sys\/passwords\/persons(\?.*)?$/, async r => {
      const resp = await r.fetch(); const j = await resp.json();
      if (Array.isArray(j.data) && j.data.length > 1) j.data[0].lockYn = 'true';
      await r.fulfill({ response: resp, json: j });
    });
    await login(p, 'kfstest');
    const item = p.getByText('비밀번호 초기화', { exact: true }).first();
    if (!(await item.isVisible())) { await p.getByText('관리자', { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(3000);
    const scr = tab();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.placeholder = await scr.locator('input.ant-input').first().getAttribute('placeholder');
    out.rowsOnOpen = await rows(scr).count();
    out.firstRow = (await rows(scr).first().innerText()).replace(/\s+/g, ' ');
    out.checkboxes = await scr.locator('.ag-row[row-index="0"] input[type=checkbox]').count();
    out.lockIcons = await scr.locator('.anticon-lock').count();
    await scr.locator('.ag-header-cell').filter({ hasText: '성명' }).first().click(); await wait(300);
    out.sortedIcon = await scr.locator('.ag-sort-ascending-icon:visible, .ag-sort-descending-icon:visible').count();
    await p.screenshot({ path: `${OUT}/A19-1.png` });
    // 성명 돋보기 → 사원찾기 → 첫 행 선택 → 조회: 1행
    await scr.locator('.anticon-search').first().click(); await wait(1500);
    const lm = p.locator('.ant-modal').filter({ has: p.locator('.ant-modal-title') }).last();
    out.lookupTitle = (await lm.locator('.ant-modal-title').innerText()).replace(/\s+/g, ' ');
    await lm.locator('.ag-row[row-index="0"]').first().dblclick(); await wait(1500);
    out.personName = await scr.locator('input.ant-input').first().inputValue();
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
    out.rowsOnePerson = await rows(scr).count();
    // 성명 비우면 전체로
    await scr.locator('input.ant-input').first().fill(''); await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
    out.rowsAfterClear = await rows(scr).count();
    // 잠금해제 → 확인 문구 → 아니오 / 비밀번호 초기화 → 확인 문구 → 아니오
    await rows(scr).first().locator('[col-id="actionCell1"] button').click(); await wait(500);
    out.unlockConfirm = (await p.locator('.ant-modal-confirm').last().innerText()).replace(/\s+/g, ' ');
    await p.locator('.ant-modal-confirm-btns button').first().click(); await wait(500);
    await rows(scr).first().locator('[col-id="actionCell2"] button').click(); await wait(500);
    out.resetConfirm = (await p.locator('.ant-modal-confirm').last().innerText()).replace(/\s+/g, ' ');
    await p.screenshot({ path: `${OUT}/A19-2.png` });
    await p.locator('.ant-modal-confirm-btns button').first().click(); await wait(500);
    out.writes = writes;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/A19-err.png` }).catch(() => {});
    out.writes = writes;
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
