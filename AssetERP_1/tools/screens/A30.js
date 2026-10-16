// A30 개선사항 및 오류 통보(1121) 화면 확인. admin 테넌트 admin. 저장·삭제·업로드는 하지 않는다(보기·팝업 열고 닫기만).
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=<playwright-core 상위 node_modules> node tools/screens/A30.js <스크린샷 폴더>'"
const { BASE, launch } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const labels = async scr => (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
  const wrapped = bar => bar.evaluate(el => new Set([...el.children].map(c => Math.round((c.getBoundingClientRect().top + c.getBoundingClientRect().bottom) / 2 / 4))).size > 1);
  const modal = () => p.locator('.ant-modal:visible').last();
  const closeModal = async () => { await modal().locator('button').filter({ hasText: /닫/ }).first().click(); await wait(600); };
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await wait(2500);
    const item = p.getByText('개선사항 및 오류 통보', { exact: true }).first();
    if (!(await item.isVisible())) { await p.getByText('관리자', { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(3000);
    const scr = tab();
    out.buttons = await labels(scr);
    out.defaultRows = await scr.locator('.ag-center-cols-container .ag-row').count();
    // 기본값(미완료·미확인, 올해)은 이 DB에서 0건 → 체크를 풀고 2022-01-01부터 조회
    await scr.getByText('미완료건만 보기').click(); await scr.getByText('미확인건만 보기').click();
    const start = scr.locator('input[placeholder][value="2026-01-01"], .ant-picker input').first();
    await start.click(); await start.fill('2022-01-01'); await p.keyboard.press('Enter'); await wait(300);
    await scr.locator('button').filter({ hasText: /^\s*조\s*회\s*$/ }).first().click(); await wait(2000);
    out.rows = await scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]').count();
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    // 툴바 줄바꿈 + 초기화
    const reset = scr.locator('button').filter({ hasText: /^\s*초\s*기\s*화\s*$/ });
    if (await reset.count()) {
      const bar = reset.first().locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " ant-space ")][1]');
      out.toolbarWrap = await wrapped(bar);
    }
    await p.screenshot({ path: `${OUT}/A30-1.png` });
    // 첫 행 선택 상태: 편집 폼 값
    out.form = {
      inputs: await scr.locator('input.ant-input[readonly]').evaluateAll(els => els.map(e => e.value)),
      selectedRow: await scr.locator('.ag-row-selected').count(),
      attachRows: await scr.locator('.ag-center-cols-container .ag-row').count(),
    };
    // 팝업 열고 닫기
    const pops = [['본문내용 :', '본문내용'], ['처리방안 :', '처리방안'], ['비고내용 :', '비고내용'], ['파일관리', '파일보기']];
    out.popups = {};
    for (const [click, title] of pops) {
      try {
        await scr.getByText(click, { exact: false }).first().click(); await wait(1200);
        const m = modal();
        out.popups[title] = { title: (await m.locator('.ant-modal-title').innerText()).trim(), buttons: await labels(m) };
        if (title === '파일보기') await p.screenshot({ path: `${OUT}/A30-files.png` });
        await closeModal();
      } catch (e) { out.popups[title] = 'ERR ' + e.message.split('\n')[0]; await p.keyboard.press('Escape'); await wait(300); }
    }
    // 첨부가 있는 행을 찾아 보기(미리보기)·파일관리 확인
    const rowsLoc = scr.locator('.ag-pinned-left-cols-container .ag-row, .ag-center-cols-container .ag-row');
    out.viewer = '첨부 있는 행 없음';
    const main = scr.locator('.ag-root-wrapper').first();
    const n = await main.locator('.ag-row[row-index]').count();
    out.mainRows = n;
    for (let i = 0; i < Math.min(n, 12); i++) {
      await main.locator(`.ag-row[row-index="${i}"] .ag-cell[col-id="happenDate"]`).first().click(); await wait(1500);
      const files = await scr.locator('[col-id="viewCell"] button').count();
      if (!files) continue;
      out.viewer = { row: i, files, selectedRows: await scr.locator('.ag-row-selected').count() };
      await scr.locator('[col-id="viewCell"] button').first().click(); await wait(2500);
      out.viewer.modal = { title: (await modal().locator('.ant-modal-title').innerText()).trim(), buttons: await labels(modal()), text: (await modal().locator('.ant-modal-body').innerText()).slice(0, 60) };
      await p.screenshot({ path: `${OUT}/A30-viewer.png` });
      await closeModal();
      await scr.getByText('파일관리').first().click(); await wait(1500);
      await modal().locator('.ag-row[row-index="0"] .ag-cell').first().click(); await wait(2500);
      out.viewer.list = { rows: await modal().locator('.ag-row[row-index]').count(), text: (await modal().locator('.ant-modal-body').innerText()).replace(/\s+/g, ' ').slice(0, 160) };
      await p.screenshot({ path: `${OUT}/A30-list.png` });
      await closeModal();
      break;
    }
    // 체크 해제 상태에서 조회(검색어) → 행 수
    await scr.locator('input[placeholder^="요청자"]').fill('zzzz'); await scr.locator('button').filter({ hasText: /^\s*조\s*회\s*$/ }).first().click(); await wait(1500);
    out.afterSearchRows = await scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]').count();
    await p.screenshot({ path: `${OUT}/A30-empty.png` });
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: `${OUT}/A30-err.png` }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
