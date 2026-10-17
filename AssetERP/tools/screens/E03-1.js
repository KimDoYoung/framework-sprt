// E03-1 법규상세 창(Ics01_Lookup_ClassTreeDetail + Ics01_Page_IcsFile + Ics01_Page_RevisionHistory) 화면 확인. 읽기 전용(데이터 변경 없음).
// E03 화면(법규개정내역 등록)에서 연결법규가 있는 개정내역을 골라 연결법규의 상세보기 아이콘으로 연다.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E03-1.js <스크린샷 폴더> [회사]
const path = require('path');
const { launch, login, openMenu } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const gets = [];
  p.on('request', r => { const u = r.url(); if (r.method() === 'GET' && u.includes('/api/v1/')) gets.push(decodeURIComponent(u.split('/api/v1/')[1])); });
  const modal = title => p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: title }) }).last();
  const countRows = g => g.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '법규개정내역 등록');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(2000);
    const grids = scr.locator('.ag-root-wrapper');
    // 연결법규가 있는 행(두 번째 행) 선택
    await grids.first().locator('.ag-row[row-index="1"] .ag-cell[col-id="title"]').click(); await wait(1500);
    out.lawRows = await countRows(grids.nth(1));
    const g0 = gets.length;
    await grids.nth(1).locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCell"] .anticon').first().click(); await wait(2000);
    const m = modal('법규상세');
    out.open = await m.count();
    out.gets = gets.slice(g0);
    out.textareas = await m.locator('textarea').evaluateAll(els => els.map(e => e.value.slice(0, 40)));
    out.labels = (await m.locator('strong, .ant-typography-strong').allInnerTexts()).join('|');
    out.revHeaders = (await m.locator('.ag-root-wrapper').nth(0).locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.revRows = await countRows(m.locator('.ag-root-wrapper').nth(0));
    out.fileHeaders = (await m.locator('.ag-root-wrapper').nth(1).locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.fileRows = await countRows(m.locator('.ag-root-wrapper').nth(1));
    out.btns = (await m.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    await p.screenshot({ path: path.join(OUT, 'E03-1.png') });
    // 개정이력 상세내용 아이콘 → 내용 창(저장 없음)
    if (out.revRows > 0) {
      await m.locator('.ag-root-wrapper').nth(0).locator('.ag-body-horizontal-scroll-viewport').evaluate(el => { el.scrollLeft = 500; }); await wait(300);
      await m.locator('.ag-root-wrapper').nth(0).locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCellContent"] .anticon').first().click(); await wait(800);
      const c = modal('내용');
      out.contentBtns = (await c.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
      out.contentReadonly = await c.locator('textarea').getAttribute('readonly');
      await c.locator('.ant-modal-footer button').last().click(); await wait(500);
      // 첨부 아이콘: 없으면 안내
      await m.locator('.ag-root-wrapper').nth(0).locator('.ag-body-horizontal-scroll-viewport').evaluate(el => { el.scrollLeft = 99999; });
      await m.locator('.ag-root-wrapper').nth(0).locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCellFile"] .anticon').first().click(); await wait(600);
      out.fileMsg = (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' ');
    }
    await m.locator('.ant-modal-footer button').click(); await wait(500);
    out.closed = (await modal('법규상세').count()) === 0;
  } catch (e) {
    out.fail = String(e).slice(0, 500);
    await p.screenshot({ path: path.join(OUT, 'E03-1-fail.png') }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
