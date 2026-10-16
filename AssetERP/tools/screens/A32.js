// A32 AssetERP 관리팀(1303 kfstest, 읽기 전용) / 관리팀 등록(1304 admin 회사, 편집) 화면 확인.
// admin 쪽은 시험 행(담당 업무 A32시험)을 등록→저장→수정→삭제한다. 실패하면 부른 쪽이 `yunhee sql "select sys92_management_team_id from sys92_management_team where sys92_charge_part='A32시험'"`로 보고 API DELETE로 지운다.
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=/home/kdy987/.npm/_npx/e41f203b7505f1fb/node_modules node tools/screens/A32.js <스크린샷 폴더>'"
const { BASE, launch, login } = require('./_common');
const [OUT] = process.argv.slice(2);

const labels = async scr => (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');

async function open(p, groups, menu) {
  const item = p.getByText(menu, { exact: true }).first();
  for (const g of groups) { if (await item.isVisible()) break; await p.getByText(g, { exact: true }).first().click(); await p.waitForTimeout(500); }
  await item.click(); await p.waitForTimeout(3000);
}

(async () => {
  const out = {};
  // 1) 고객사(kfstest): 읽기 전용
  {
    const { b, p, errs } = await launch();
    const tab = () => p.locator('.flexlayout__tab:visible').last();
    try {
      await login(p, 'kfstest');
      await open(p, ['커뮤니티', '91. AssetERP'], 'AssetERP 관리팀');
      const scr = tab();
      out.user = {
        buttons: await labels(scr),
        headers: (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|'),
        rows: await scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]').count(),
        errs,
      };
      await p.screenshot({ path: `${OUT}/A32-user.png` });
    } catch (e) { out.user = 'ERR ' + e.message.split('\n')[0]; await p.screenshot({ path: `${OUT}/A32-user-err.png` }).catch(() => {}); }
    await b.close();
  }
  // 2) 관리자 회사(admin): 편집
  {
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
      await open(p, ['관리자', '09. 기타'], 'AssetERP 관리팀 등록');
      const scr = tab();
      const rows = () => scr.locator('.ag-root-wrapper').first().locator('.ag-row[row-index]');
      out.admin = { buttons: await labels(scr), headers: (await scr.locator('.ag-header-cell-text').allInnerTexts()).join('|'), rows: await rows().count() };
      await btn(scr, /^\s*등\s*록\s*$/).click(); await wait(500);
      out.admin.afterAdd = await rows().count();
      await p.keyboard.type('A32시험'); await p.keyboard.press('Enter'); await wait(300);
      await scr.locator('.ag-row').filter({ hasText: 'A32시험' }).first().locator('.ag-cell button').first().click(); await wait(1500);
      out.admin.lookup = { title: (await p.locator('.ant-modal:visible .ant-modal-title').last().innerText()).trim(), buttons: await labels(p.locator('.ant-modal:visible').last()) };
      await p.locator('.ant-modal:visible').last().locator('button').filter({ hasText: /취\s*소/ }).first().click(); await wait(800);
      out.admin.saveLabel = (await btn(scr, /저\s*장/).innerText()).replace(/\s/g, '');
      await btn(scr, /^\s*저\s*장/).click(); await wait(1500);
      out.admin.saveMsg = await msgs();
      out.admin.afterSave = await rows().count();
      await p.screenshot({ path: `${OUT}/A32-admin.png` });
      // 시험 행 선택 → 삭제 확인창 → 예
      const row = scr.locator('.ag-row').filter({ hasText: 'A32시험' }).first();
      await row.locator('.ag-cell').first().click(); await wait(300);
      await btn(scr, /^\s*삭\s*제\s*$/).click(); await wait(600);
      out.admin.deleteMsg = await msgs(); out.admin.selected = await scr.locator('.ag-row-selected').count();
      await p.screenshot({ path: `${OUT}/A32-del.png` });
      out.admin.deleteConfirm = (await p.locator('.ant-modal-confirm:visible').innerText({ timeout: 3000 })).replace(/\s+/g, ' ');
      await p.locator('.ant-modal-confirm:visible').getByRole('button', { name: /예/ }).click(); await wait(1500);
      out.admin.afterDelete = await rows().count();
      out.admin.errs = errs; out.admin.writes = writes;
    } catch (e) { out.admin = Object.assign(out.admin || {}, { err: e.message.split('\n')[0], writes }); await p.screenshot({ path: `${OUT}/A32-admin-err.png` }).catch(() => {}); }
    await b.close();
  }
  console.log(JSON.stringify(out, null, 1));
})();
