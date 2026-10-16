// B13 CompanyPopupField(IM-01) 확인: dropdown이던 7개 화면의 고객사 칸 — 클릭 → 고객찾기 조회창 → 선택 → 값·x(전체)
// 저장하지 않는다. admin 테넌트 admin으로 확인한다.
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 상위 node_modules> node tools/screens/B13.js <스크린샷 폴더>'"
const { BASE, launch } = require('./_common');
const [OUT] = process.argv.slice(2);
const MENUS = ['고객별 특정화면 관리', '로그인내역 조회', '로그인 Mac 주소 관리', '로그아웃 알림 관리', '개선사항 및 오류 통보', '고객별 매뉴사용기록', '고객별 문자발송'];

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('관리자', { exact: true }).first().click(); await p.waitForTimeout(600);
    for (const [i, name] of MENUS.entries()) {
      const o = out[name] = {};
      const item = p.getByText(name, { exact: true });
      if (!(await item.count())) { o.menu = '메뉴 없음'; continue; }
      await item.last().click(); await p.waitForTimeout(2500);
      const scr = p.locator('.flexlayout__tab:visible').last();
      const inputs = scr.locator('.ant-input-affix-wrapper input[class*="ant-input"]');
      let idx = -1;
      for (let k = 0; k < await inputs.count(); k++) if ((await inputs.nth(k).inputValue()) === '전체') { idx = k; break; }
      if (idx < 0 && (await inputs.count())) idx = 0;  // 문자발송은 기본 회사가 들어 있다
      if (idx < 0) { o.field = '고객사 칸 없음'; continue; }
      const f = inputs.nth(idx);
      o.initial = await f.inputValue();
      await f.click(); await p.waitForTimeout(800);
      const modal = p.locator('.ant-modal:visible').last();
      o.modal = (await modal.count()) ? 'open' : 'none';
      if (o.modal === 'open') {
        const row = modal.locator('.ag-row[row-index="0"]').first();
        o.modalRows = await modal.locator('.ag-row[row-index]').count();
        await row.dblclick(); await p.waitForTimeout(800);
        o.picked = await f.inputValue();
        o.modalClosed = (await p.locator('.ant-modal:visible').count()) === 0;
        await p.screenshot({ path: `${OUT}/B13-${i + 1}.png` });
        // x → 전체
        await f.hover(); await p.waitForTimeout(200);
        await scr.locator('.ant-input-clear-icon:visible').first().click(); await p.waitForTimeout(600);
        o.afterClear = await f.inputValue();
      }
    }
  } catch (e) { out.error = String(e); }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
