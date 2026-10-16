// A33 AssetERP 매뉴얼(1297, kfstest) 화면 확인. 조회만 한다(데이터를 바꾸지 않음).
// 사용: yunhee run -t 200 "bash -c 'NODE_PATH=/home/kdy987/.npm/_npx/e41f203b7505f1fb/node_modules node tools/screens/A33.js <스크린샷 폴더>'"
const { launch, login, checkGrid, gridOk } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const out = {};
  const { b, p, errs } = await launch();
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  try {
    await login(p, 'kfstest');
    const item = p.getByText('AssetERP 매뉴얼', { exact: true }).first();
    for (const g of ['커뮤니티', '91. AssetERP']) { if (await item.isVisible()) break; await p.getByText(g, { exact: true }).first().click(); await p.waitForTimeout(500); }
    await item.click(); await p.waitForTimeout(3500);
    const scr = tab();
    const rows = scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.rows = await rows.count();
    out.firstSelected = await scr.locator('.ag-row[row-index="0"].ag-row-selected').count();
    out.pdfIframe = await scr.locator('iframe[title="manual-pdf"]').count();
    out.notes = (await scr.getByText('외부유출').allInnerTexts()).length;
    await p.screenshot({ path: `${OUT}/A33-first.png` });
    // 분류 콤보 → 자금관리(050) 선택 시 행 수 줄어듦
    await scr.locator('.ant-select').first().click(); await p.waitForTimeout(400);
    await p.locator('.ant-select-item-option').filter({ hasText: '자금관리' }).first().click(); await p.waitForTimeout(1500);
    out.typeRows = await rows.count();
    // 초기화 → 다시 전체
    await scr.locator('button').filter({ hasText: '초기화' }).first().click(); await p.waitForTimeout(1500);
    out.resetRows = await rows.count();
    // 검색어 + Enter
    await scr.locator('input[placeholder="검색어 입력"]').fill('카드'); await p.keyboard.press('Enter'); await p.waitForTimeout(1500);
    out.searchRows = await rows.count();
    // 마지막 행 클릭 → pdf가 아니면 안내 문구, pdf면 iframe
    await rows.last().locator('.ag-cell').nth(2).click(); await p.waitForTimeout(1500);
    out.afterClickIframe = await scr.locator('iframe[title="manual-pdf"]').count();
    out.grid = await checkGrid(p, scr); out.gridOk = gridOk(out.grid);
    out.errs = errs;
    await p.screenshot({ path: `${OUT}/A33-search.png` });
  } catch (e) { out.err = e.message.split('\n')[0]; await p.screenshot({ path: `${OUT}/A33-err.png` }).catch(() => {}); }
  await b.close();
  console.log(JSON.stringify(out, null, 1));
})();
