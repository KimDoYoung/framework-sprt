// A24 로그아웃 알림 관리(1404) 화면 확인. admin 테넌트 admin(회사 0).
// **실제 알림·강제 로그아웃은 보내지 않는다**: /api/v1/sys/websocket/ 의 모든 요청(조회·POST)을 Playwright route로 가로채 가짜 응답을 준다 — 서버에는 가지 않는다.
// (서버 쪽 동작은 WebsocketAdminDbTest와 `yunhee api`의 400·403 확인으로 본다.) 화면 흐름·문구·타이머만 확인한다.
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=<playwright-core 상위 node_modules> node tools/screens/A24.js <스크린샷 폴더>'"
const { BASE, launch } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const rows = scr => scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
  const btn = (scr, re) => scr.locator('button').filter({ hasText: re }).first();
  const msgs = async () => (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' ');
  const calls = [];
  let alarmReply = { processed: 0, offlineNames: ['가나'] };
  const persons = [
    { personId: 101, companyName: '시험사 A', korName: '가나', empNo: '001', posName: '대리', officeTelno: '02-000-0001', mobileTelno: '010-0000-0001' },
    { personId: 102, companyName: '시험사 A', korName: '다라', empNo: '002', posName: '과장', officeTelno: '02-000-0002', mobileTelno: '010-0000-0002' },
    { personId: 103, companyName: '시험사 B', korName: '마바', empNo: '003', posName: '부장', officeTelno: '02-000-0003', mobileTelno: '010-0000-0003' },
  ];
  await p.route(/\/api\/v1\/sys\/websocket\//, async r => {
    const req = r.request();
    const path = req.url().split('/api/v1/sys/websocket/')[1];
    calls.push(`${req.method()} ${path}${req.postData() ? ' ' + req.postData() : ''}`);
    let data;
    if (req.method() === 'GET') data = { total: persons.length, rows: persons };
    else if (path.startsWith('alarms') && !path.startsWith('alarms/all')) data = alarmReply;
    else data = { processed: 3, offlineNames: [] };
    await r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, data }) });
  });
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await wait(2500);
    const item = p.getByText('로그아웃 알림 관리', { exact: true }).first();
    if (!(await item.isVisible())) { await p.getByText('관리자', { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(3000);
    const scr = tab();
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.placeholder = await scr.locator('input.ant-input').first().getAttribute('placeholder');
    out.rows = await rows(scr).count();
    out.selectedOnOpen = await scr.locator('.ag-row-selected').count();
    out.paging = (await scr.locator('text=/전체\\s*\\d+/').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
    out.toolbarWrap = await scr.locator('input.ant-input').first().evaluate(el => { const sp = el.closest('.ant-space'); return new Set([...sp.children].map(c => Math.round((c.getBoundingClientRect().top + c.getBoundingClientRect().bottom) / 2 / 4))).size > 1; });
    await p.screenshot({ path: `${OUT}/A24-1.png` });
    const dlg = () => p.locator('.ant-modal').filter({ has: p.locator('.ant-modal-title', { hasText: '메세지 작성' }) });
    // 개별전송: 선택 해제 → 경고 / 첫 행 선택 → 메세지 작성
    await scr.locator('.ag-header-cell input[type=checkbox]').first().click(); await wait(200);
    await scr.locator('.ag-header-cell input[type=checkbox]').first().click(); await wait(200);
    if (await scr.locator('.ag-row-selected').count()) await scr.locator('.ag-header-cell input[type=checkbox]').first().click();
    await wait(200);
    out.selectedAfterClear = await scr.locator('.ag-row-selected').count();
    await btn(scr, /개별전송/).click(); await wait(400);
    out.warnNoSelect = await msgs();
    await rows(scr).first().locator('input[type=checkbox]').first().click(); await wait(200);
    await btn(scr, /개별전송/).click(); await wait(800);
    out.dialog = { title: await dlg().locator('.ant-modal-title').innerText(), buttons: (await dlg().locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(','), closeX: await dlg().locator('.ant-modal-close').count() };
    await dlg().locator('.ant-modal-footer button').filter({ hasText: /^\s*전\s*송\s*$/ }).click(); await wait(400);
    out.warnEmptyMessage = await msgs();
    await dlg().locator('textarea').fill('시스템 점검 안내'); 
    await dlg().locator('.ant-modal-footer button').filter({ hasText: /^\s*전\s*송\s*$/ }).click(); await wait(700);
    out.offlineReply = { msg: await msgs(), dialogStillOpen: await dlg().isVisible() };
    alarmReply = { processed: 1, offlineNames: [] };
    await p.waitForTimeout(3200);
    await dlg().locator('.ant-modal-footer button').filter({ hasText: /^\s*전\s*송\s*$/ }).click(); await wait(700);
    out.okReply = { msg: await msgs(), dialogClosed: !(await dlg().isVisible()) };
    // 전송 및 로그아웃: 확인 문구 → 예 → 알림 + 5분 표시
    await btn(scr, /개별전송/).click(); await wait(800);
    out.dialogTextAfterPlainSend = await dlg().locator('textarea').inputValue();  // 그냥 전송은 msg를 기억하지 않는다(원본: "전송 및 로그아웃"만 callback으로 msg를 돌려줌)
    await dlg().locator('textarea').fill('5분 뒤 로그아웃 안내');
    await dlg().locator('.ant-modal-footer button').filter({ hasText: /전송 및 로그아웃/ }).click(); await wait(500);
    out.logoutConfirm = (await p.locator('.ant-modal-confirm').last().innerText()).replace(/\s+/g, ' ');
    await p.locator('.ant-modal-confirm-btns button').last().click(); await wait(1500);
    out.timer = (await scr.locator('text=/초 남았습니다/').first().innerText().catch(() => '')).trim();
    out.dialogClosedAfterLogoutSend = !(await dlg().isVisible());
    await p.screenshot({ path: `${OUT}/A24-2.png` });
    // 전체전송
    await btn(scr, /전체전송/).click(); await wait(800);
    out.dialogTextRemembered = await dlg().locator('textarea').inputValue();  // msg = 마지막 "전송 및 로그아웃" 내용
    await dlg().locator('.ant-modal-footer button').filter({ hasText: /^\s*전\s*송\s*$/ }).click(); await wait(600);
    out.sendAll = await msgs();
    await wait(1500);
    // 개별로그아웃: 확인 → 예
    await btn(scr, /개별로그아웃/).click(); await wait(500);
    out.forceConfirm = (await p.locator('.ant-modal-confirm').last().innerText()).replace(/\s+/g, ' ');
    await p.locator('.ant-modal-confirm-btns button').last().click(); await wait(800);
    out.forceDone = await msgs();
    await wait(3200);
    // 전체로그아웃: 확인 문구 → 아니오
    await btn(scr, /전체로그아웃/).click(); await wait(500);
    out.forceAllConfirm = (await p.locator('.ant-modal-confirm').last().innerText()).replace(/\s+/g, ' ');
    await p.locator('.ant-modal-confirm-btns button').first().click(); await wait(500);
    out.callsAfterCancel = calls.filter(c => c.includes('force-logouts/all')).length;
    // 전체로그아웃 예 → 가짜 응답 (서버로 가지 않는다)
    await btn(scr, /전체로그아웃/).click(); await wait(500);
    await p.locator('.ant-modal-confirm-btns button').last().click(); await wait(800);
    out.forceAllDone = await msgs();
    out.calls = calls;
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/A24-err.png` }).catch(() => {});
    out.calls = calls;
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
