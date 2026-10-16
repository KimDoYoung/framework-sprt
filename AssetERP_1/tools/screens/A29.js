// A29 개선사항 및 오류 통보(1066, 고객사 관리자 kfstest) 화면 확인. 시험 행을 등록→본문 입력→저장→(그림 파일 올리고 지우기)→삭제한다.
// 실패하면 부른 쪽이 `yunhee sql "select sys90_after_service_id, sys90_happen_reason from sys90_after_service where sys90_happen_reason like '%A29 시험%'"`로 보고 API DELETE로 지운다.
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=/home/kdy987/.npm/_npx/e41f203b7505f1fb/node_modules node tools/screens/A29.js <스크린샷 폴더>'"
const { launch, login } = require('./_common');
const fs = require('fs');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const btn = (scr, re) => scr.locator('button').filter({ hasText: re }).first();
  const labels = async scr => (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
  const msgs = async () => (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' ');
  const modal = () => p.locator('.ant-modal:visible').last();
  const closeModal = async () => { await modal().locator('button').filter({ hasText: /닫/ }).first().click(); await wait(600); };
  const mainRows = scr => scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
  const writes = [];
  p.on('request', r => { if (['PUT', 'POST', 'DELETE'].includes(r.method()) && r.url().includes('/api/v1/')) writes.push(r.method() + ' ' + r.url().split('/api/v1/')[1].split('?')[0]); });
  try {
    await login(p, 'kfstest');
    const item = p.getByText('개선사항 및 오류 통보', { exact: true }).first();
    if (!(await item.isVisible())) { await p.getByText('커뮤니티', { exact: true }).first().click(); await wait(500); }
    if (!(await item.isVisible())) { await p.getByText('90. 기타', { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(3000);
    const scr = tab();
    out.buttons = await labels(scr);
    out.defaultRows = await mainRows(scr).count();
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.firstRow = (await mainRows(scr).first().innerText().catch(() => '')).replace(/\s+/g, ' ');
    // 초기화 버튼과 툴바 줄바꿈
    const reset = btn(scr, /^\s*초\s*기\s*화\s*$/);
    if (await reset.count()) {
      const bar = reset.locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " ant-space ")][1]');
      out.toolbarWrap = await bar.evaluate(el => new Set([...el.children].map(c => Math.round((c.getBoundingClientRect().top + c.getBoundingClientRect().bottom) / 2 / 4))).size > 1);
    }
    await p.screenshot({ path: `${OUT}/A29-1.png` });
    // 미확인 체크를 풀고 2022-01-01부터 → 전체 11건
    await scr.getByText('미확인건만 보기').click();
    const start = scr.locator('.ant-picker input').first();
    await start.click(); await start.fill('2022-01-01'); await p.keyboard.press('Enter'); await wait(300);
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(2000);
    out.allRows = await mainRows(scr).count();
    out.form = {
      readonly: await scr.locator('input.ant-input[readonly]').evaluateAll(els => els.map(e => e.value)),
      selectedRow: await scr.locator('.ag-row-selected').count(),
      attachRows: await scr.locator('[col-id="viewCell"]').count(),
    };
    // 팝업: 본문내용(편집: 확인·닫기), 처리방안(보기: 닫기)
    out.popups = {};
    for (const [click, title] of [['본문내용 :', '본문내용'], ['처리방안 :', '처리방안']]) {
      try {
        await scr.getByText(click, { exact: false }).first().click(); await wait(1200);
        out.popups[title] = { title: (await modal().locator('.ant-modal-title').innerText()).trim(), buttons: await labels(modal()), editor: await modal().locator('.ProseMirror').count() };
        await closeModal();
      } catch (e) { out.popups[title] = 'ERR ' + e.message.split('\n')[0]; await p.keyboard.press('Escape'); await wait(300); }
    }
    // 완료여부가 있는 행(접수된 내용)에서 삭제 → 거부 메시지
    const n = await mainRows(scr).count();
    out.deleteRejected = '접수 행 없음';
    for (let i = 0; i < n; i++) {
      const row = scr.locator('.ag-root-wrapper').first().locator(`.ag-row[row-index="${i}"]`);
      const state = (await row.locator('[col-id="afterStateNm"]').innerText().catch(() => '')).trim();
      if (!state) continue;
      await row.locator('[col-id="happenDate"]').first().click(); await wait(1200);
      await btn(scr, /^\s*삭\s*제\s*$/).click(); await wait(600);
      out.deleteRejected = { row: i, state, msg: await msgs(), confirmOpened: await p.locator('.ant-modal-confirm:visible').count() };
      break;
    }
    // 시험 행: 등록 → 구분 → 본문 → 저장
    const before = await mainRows(scr).count();
    await btn(scr, /^\s*등\s*록\s*$/).click(); await wait(1500);
    out.afterRegister = { rows: await mainRows(scr).count(), before, readonly: await scr.locator('input.ant-input[readonly]').evaluateAll(els => els.map(e => e.value)) };
    await scr.locator('.ProseMirror').first().click(); await p.keyboard.type('A29 시험'); await wait(300);
    await btn(scr, /^\s*저\s*장\s*$/).click(); await wait(1500);
    out.saveMsg = await msgs();
    await p.screenshot({ path: `${OUT}/A29-2.png` });
    out.savedRow = (await scr.locator('.ag-root-wrapper').first().locator('.ag-row-selected').first().innerText()).replace(/\s+/g, ' ');
    out.newRowIndex = await scr.locator('.ag-root-wrapper').first().locator('.ag-row-selected').first().getAttribute('row-index');
    // 그림 파일 올리기 → 첨부 목록 → 지우기
    try {
      const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
      fs.writeFileSync('/tmp/A29-test.png', png);
      await scr.locator('input[type=file]').first().setInputFiles('/tmp/A29-test.png'); await wait(2000);
      out.attach = { rows: await scr.locator('[col-id="viewCell"] button').count(), name: (await scr.locator('[col-id="fileNm"]').allInnerTexts()).join('|') };
      await p.screenshot({ path: `${OUT}/A29-3.png` });
      await scr.locator('[col-id="deleteCell"] button').first().click(); await wait(600);
      await p.locator('.ant-modal-confirm:visible').getByRole('button', { name: /예/ }).click(); await wait(1800);
      out.attach.afterDelete = await scr.locator('[col-id="viewCell"] button').count();
    } catch (e) { out.attach = 'ERR ' + e.message.split('\n')[0]; }
    // 삭제(시험 행)
    await btn(scr, /^\s*삭\s*제\s*$/).click(); await wait(600);
    out.deleteConfirm = (await p.locator('.ant-modal-confirm:visible').innerText()).replace(/\s+/g, ' ');
    await p.locator('.ant-modal-confirm:visible').getByRole('button', { name: /예/ }).click(); await wait(1800);
    out.afterDelete = await mainRows(scr).count();
    await p.screenshot({ path: `${OUT}/A29-4.png` });
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/A29-err.png` }).catch(() => {});
  }
  out.writes = writes;
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
