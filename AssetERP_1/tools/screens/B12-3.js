// B12-3 UX보강 일괄 적용 확인 (emp). admin 테넌트 admin(1325) + kfstest(1283·1029). 저장은 누르지 않는다.
// 화면마다: 툴바 버튼 문구, 초기화가 있으면 값 입력 → 초기화 → 값, 줄바꿈 여부, 저장(n) 상태. 1029는 하단 탭별 버튼(저장(n) 문구).
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=<playwright-core 상위 node_modules> node tools/screens/B12-3.js <스크린샷 폴더>'"
const { BASE, launch, login, openMenu } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const btn = (scr, re) => scr.locator('button').filter({ hasText: re });
  const labels = async scr => (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
  const open = async (group, menu) => {
    const item = p.getByText(menu, { exact: true }).first();
    if (!(await item.isVisible())) { await p.getByText(group, { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(2500);
  };
  // 줄바꿈: 자식들의 세로 중심이 둘 이상이면 true (높이가 다른 입력·버튼이 섞여도 중심은 같다)
const wrapped = bar => bar.evaluate(el => new Set([...el.children].map(c => Math.round((c.getBoundingClientRect().top + c.getBoundingClientRect().bottom) / 2 / 4))).size > 1);
  const resetCheck = async (scr, o) => {
    const resets = btn(scr, /^\s*초\s*기\s*화\s*$/);
    o.resets = [];
    for (let i = 0; i < await resets.count(); i++) {
      const bar = resets.nth(i).locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " ant-space ")][1]');
      const input = bar.locator('input.ant-input:not([readonly])').first();
      const wrap = await wrapped(bar);
      if (!(await input.count())) { o.resets.push(`입력없음 wrap=${wrap}`); continue; }
      await input.fill('zz'); await wait(200);
      const clear = await bar.locator('.ant-input-clear-icon:not(.ant-input-clear-icon-hidden)').count();
      await resets.nth(i).click(); await wait(400);
      o.resets.push(`x=${clear} after='${await input.inputValue()}' wrap=${wrap}`);
    }
  };
  const check = async ([group, menu, no]) => {
    const o = (out[no] = {});
    try {
      await open(group, menu);
      const scr = tab();
      o.buttons = await labels(scr);
      await resetCheck(scr, o);
      await p.screenshot({ path: `${OUT}/B12-3-${no}.png` });
      return scr;
    } catch (e) {
      o.err = e.message.split('\n')[0];
      await p.screenshot({ path: `${OUT}/B12-3-${no}-err.png` }).catch(() => {});
    }
  };
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await wait(2500);
    await check(['관리자', '사용자정보 조회', '1325']);
    await p.context().clearCookies();
    await login(p, 'kfstest');
    {
      const o = (out['1283'] = {});
      try {
        await openMenu(p, '관리자', '사원별 메뉴권한(View)'); await wait(2500);
        const scr = tab();
        o.buttons = await labels(scr); await resetCheck(scr, o);
        await p.screenshot({ path: `${OUT}/B12-3-1283.png` });
      } catch (e) { o.err = e.message.split('\n')[0]; }
    }

    const scr = await check(['경영관리', '사원정보 관리', '1029']);
    if (scr) {
      const o = out['1029'];
      o.tabs = {};
      await scr.locator('.ag-row[row-index="0"] .ag-cell').first().click(); await wait(1500);
      const names = await scr.locator('.ant-tabs-tab').allInnerTexts();
      for (const n of names) {
        await scr.locator('.ant-tabs-tab').filter({ hasText: n }).first().click(); await wait(1500);
        o.tabs[n] = (await labels(scr)).replace(o.buttons, '').slice(0, 80);
      }
    }
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/B12-3-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
