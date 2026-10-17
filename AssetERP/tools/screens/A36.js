// A36 파일보안정책(1500, admin 회사) 화면 확인: 열기 → 검색(pdf) → 시험 행(확장자 zza36) 등록·저장·삭제.
// 실패하면 `yunhee sql "select sys60_file_policy_id from sys60_file_policy where sys60_ext='zza36'"`로 보고 API DELETE로 지운다.
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=/home/kdy987/.npm/_npx/e41f203b7505f1fb/node_modules node tools/screens/A36.js <스크린샷 폴더>'"
const { BASE, launch } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const out = {};
  const { b, p, errs } = await launch();
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const btn = (scr, re) => scr.locator('button').filter({ hasText: re }).first();
  const msgs = async () => (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' ');
  const writes = [];
  p.on('request', r => { if (['PUT', 'POST', 'DELETE'].includes(r.method()) && r.url().includes('/api/v1/sys/')) writes.push(r.method() + ' ' + r.url().split('/api/v1/sys/')[1].split('?')[0]); });
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await wait(2500);
    const item = p.getByText('파일보안정책', { exact: true }).first();
    for (const g of ['관리자', '09. 기타']) { if (await item.isVisible()) break; await p.getByText(g, { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(3000);
    const scr = tab();
    const rows = () => scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.rows = await rows().count();
    // 검색 (Enter)
    await scr.locator('input[placeholder="확장자/MIME/비고"]').fill('pdf'); await scr.locator('input[placeholder="확장자/MIME/비고"]').press('Enter'); await wait(1200);
    out.searchPdf = await rows().count();
    await scr.locator('input[placeholder="확장자/MIME/비고"]').fill(''); await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1200);
    out.afterClear = await rows().count();
    // 등록 → 입력 → 저장
    await btn(scr, /^\s*등\s*록\s*$/).click(); await wait(500);
    out.afterAdd = await rows().count();
    await p.keyboard.type('zza36'); await p.keyboard.press('Tab'); await p.keyboard.type('test/zza36'); await p.keyboard.press('Enter'); await wait(300);
    out.saveLabel = (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, '');
    await btn(scr, /^\s*저\s*장/).click(); await wait(1500);
    out.saveMsg = await msgs();
    out.afterSave = await rows().count();
    await p.screenshot({ path: `${OUT}/A36-admin.png` });
    // 시험 행 체크 → 삭제 확인창 → 예
    // 가상 스크롤을 피하려고 시험 행만 검색해서 맨 위에 둔다
    await scr.locator('input[placeholder="확장자/MIME/비고"]').fill('zza36'); await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1200);
    out.searchTest = await rows().count();
    const row = rows().first();
    out.selBefore = await scr.locator('.ag-row-selected').count();
    await row.locator('.ag-selection-checkbox').first().click(); await wait(300);
    out.selAfter = await scr.locator('.ag-row-selected').count();
    await btn(scr, /^\s*삭\s*제\s*$/).click(); await wait(600);
    out.deleteConfirm = (await p.locator('.ant-modal-confirm:visible').innerText({ timeout: 3000 })).replace(/\s+/g, ' ');
    await p.locator('.ant-modal-confirm:visible').getByRole('button', { name: /예/ }).click(); await wait(1500);
    out.afterDelete = await rows().count();
    out.errs = errs; out.writes = writes;
  } catch (e) { out.err = e.message.split('\n')[0]; out.writes = writes; await p.screenshot({ path: `${OUT}/A36-err.png` }).catch(() => {}); }
  await b.close();
  console.log(JSON.stringify(out, null, 1));
})();
