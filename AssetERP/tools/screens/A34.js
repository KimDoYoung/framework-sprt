// A34 AssetERP 매뉴얼 등록(1298, admin 회사) 화면 확인: 열기 → 시험 파일 업로드(분류 010) → 비고 수정·저장 → 삭제(파일 삭제 확인) → 분류추가 창(시험 코드 zz9 추가·저장·삭제).
// 실패하면 `yunhee sql "select sys95_manual_id from sys95_manual where sys95_manual_type='010'"`·`... sys09_code where sys09_code='zz9'`로 보고 API DELETE로 지운다.
// 사용: yunhee run -t 400 "bash -c 'CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=<playwright-core 폴더> node tools/screens/A34.js <스크린샷 폴더> <시험 파일 경로>'"
const { BASE, launch } = require('./_common');
const [OUT, TESTFILE] = process.argv.slice(2);

(async () => {
  const out = {};
  const { b, p, errs } = await launch();
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const btn = (scr, re) => scr.locator('button').filter({ hasText: re }).first();
  const msgs = async () => (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' ');
  const writes = [];
  p.on('request', r => { if (['PUT', 'POST', 'DELETE'].includes(r.method()) && r.url().includes('/api/v1/sys/')) { writes.push(r.method() + ' ' + r.url().split('/api/v1/sys/')[1].split('?')[0]); if (r.method() === 'PUT' && r.url().endsWith('/manuals')) out.putManuals = r.postData(); } });
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await wait(2500);
    const item = p.getByText('AssetERP 매뉴얼 등록', { exact: true }).first();
    for (const g of ['관리자', '09. 기타']) { if (await item.isVisible()) break; await p.getByText(g, { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(3000);
    const scr = tab();
    const rows = () => scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.rows = await rows().count();
    out.firstRow = (await rows().first().innerText()).replace(/\s+/g, ' ').slice(0, 100);
    await p.screenshot({ path: `${OUT}/A34-open.png` });

    // 분류 '%'면 파일업로드 안내
    await btn(scr, /파일업로드/).click(); await wait(500);
    out.uploadNoType = await msgs();

    // 분류 선택(문서작성 010) → 조회
    await scr.locator('.ant-select').first().click(); await wait(500);
    await p.locator('.ant-select-item-option').filter({ hasText: '문서작성' }).first().click(); await wait(1500);
    out.afterType = await rows().count();

    // 시험 파일 업로드
    await scr.locator('input[type=file]').setInputFiles(TESTFILE); await wait(2500);
    out.afterUpload = await rows().count();
    // 시험 행 = 파일명 A34시험.txt
    const row = scr.locator('.ag-row').filter({ hasText: 'A34시험.txt' }).first();
    out.testRow = (await row.innerText()).replace(/\s+/g, ' ');
    await row.locator('.ag-cell[col-id="fileNm"]').click(); await wait(800);
    out.viewerNonPdf = (await scr.locator('.ant-splitter-panel').last().innerText()).replace(/\s+/g, ' ').slice(0, 80);
    // 분류 셀 편집(콤보): 문서작성 → 내부통제 — 저장 요청 본문의 manualType이 020이어야 한다
    await row.locator('.ag-cell[col-id="manualTypeNm"]').dblclick(); await wait(500);
    await row.locator('.ag-picker-field-wrapper').first().click(); await wait(500);  // 편집기(agSelectCellEditor)를 눌러 목록을 연다
    await p.locator('.ag-popup').getByText('내부통제', { exact: true }).first().click(); await wait(500);
    out.typeCell = (await scr.locator('.ag-row').filter({ hasText: 'A34시험.txt' }).first().innerText()).replace(/\s+/g, ' ');
    // 비고 수정 → 저장
    await row.locator('.ag-cell[col-id="note"]').dblclick(); await wait(300);
    await p.keyboard.type('A34시험비고'); await p.keyboard.press('Enter'); await wait(300);
    out.saveLabel = (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, '');
    await btn(scr, /^\s*저\s*장/).click(); await wait(1500);
    out.saveMsg = await msgs();
    await p.screenshot({ path: `${OUT}/A34-uploaded.png` });
    // 삭제 아이콘 → 확인 → 예
    await row.locator('.ag-cell[col-id="actionCell02"]').locator('*').first().click(); await wait(600);
    out.deleteConfirm = (await p.locator('.ant-modal-confirm:visible').innerText({ timeout: 3000 })).replace(/\s+/g, ' ');
    await p.locator('.ant-modal-confirm:visible').getByRole('button', { name: /예/ }).click(); await wait(2000);
    out.afterDelete = await rows().count();

    // 분류추가 창
    await btn(scr, /분류추가/).click(); await wait(2000);
    const dlg = p.locator('.ant-modal:visible').last();
    const drows = () => dlg.locator('.ag-row[row-index]');
    out.lookup = { title: (await dlg.locator('.ant-modal-title').innerText()).trim(), headers: (await dlg.locator('.ag-header-cell-text').allInnerTexts()).join('|'),
      buttons: (await dlg.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(','), rows: await drows().count() };
    await p.screenshot({ path: `${OUT}/A34-lookup.png` });
    // 저장 내역 없음
    await dlg.locator('.ant-modal-footer button').filter({ hasText: /저\s*장/ }).click(); await wait(500);
    out.lookup.saveEmpty = await msgs();
    // 행 추가 → 코드 zz9 / 코드명 / 순서
    await dlg.locator('button').filter({ hasText: /행\s*추\s*가/ }).click(); await wait(500);
    await p.keyboard.type('zz9', { delay: 60 }); await p.keyboard.press('Tab'); await wait(200); await p.keyboard.type('A34시험', { delay: 60 }); await p.keyboard.press('Tab'); await wait(200); await p.keyboard.type('990', { delay: 60 }); await p.keyboard.press('Enter'); await wait(300);
    out.lookup.afterAdd = await drows().count();
    await dlg.locator('.ant-modal-footer button').filter({ hasText: /저\s*장/ }).click(); await wait(1800);
    out.lookup.saveMsg = await msgs();
    out.lookup.afterSave = await drows().count();
    // 시험 행 삭제(행 삭제 → 저장)
    const trow = dlg.locator('.ag-row').filter({ hasText: 'zz9' }).first();
    await trow.locator('.ag-cell').nth(1).click(); await wait(300);
    await dlg.locator('button').filter({ hasText: /행\s*삭\s*제/ }).click(); await wait(1200);
    out.lookup.afterRemove = await drows().count();
    await dlg.locator('.ant-modal-footer button').filter({ hasText: /저\s*장/ }).click(); await wait(1800);
    out.lookup.deleteMsg = await msgs();
    // 사용중 분류(050) 행 삭제 시도 → 거절
    const used = dlg.locator('.ag-row').filter({ hasText: '자금관리' }).first();
    await used.locator('.ag-cell').nth(1).click(); await wait(300);
    await dlg.locator('button').filter({ hasText: /행\s*삭\s*제/ }).click(); await wait(1200);
    out.lookup.usedDelete = await msgs();
    out.lookup.afterUsedDelete = await drows().count();
    await dlg.locator('.ant-modal-footer button').filter({ hasText: /닫\s*기/ }).click(); await wait(500);
    out.errs = errs; out.writes = writes;
  } catch (e) { out.err = e.message.split('\n')[0]; out.writes = writes; await p.screenshot({ path: `${OUT}/A34-err.png` }).catch(() => {}); }
  await b.close();
  console.log(JSON.stringify(out, null, 1));
})();
