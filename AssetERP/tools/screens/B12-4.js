// B12-4 UX보강 일괄 적용 확인 (org·sms). admin 테넌트 admin: 1305 고객별 문자사용량(+발신기록 조회창), 1367 고객별 문자발송(오른쪽 고객사 조회줄).
// 화면마다: 툴바 버튼 문구, 초기화가 있으면 값 입력 → 초기화 → 값, 줄바꿈 여부. 저장·발송은 누르지 않는다.
// 사용: yunhee run -t 400 "bash -c 'NODE_PATH=<playwright-core 상위 node_modules> node tools/screens/B12-4.js <스크린샷 폴더>'"
const { BASE, launch } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const labels = async scr => (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
  const open = async (group, menu) => {
    const item = p.getByText(menu, { exact: true }).first();
    if (!(await item.isVisible())) { await p.getByText(group, { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(2500);
  };
  const wrapped = bar => bar.evaluate(el => new Set([...el.children].map(c => Math.round((c.getBoundingClientRect().top + c.getBoundingClientRect().bottom) / 2 / 4))).size > 1);
  // scr 안의 초기화 버튼마다: 같은 줄(ant-space)의 첫 글자 입력에 값 → x 표시 → 초기화 → 값, 줄바꿈 여부
  const resetCheck = async (scr, o) => {
    const resets = scr.locator('button').filter({ hasText: /^\s*초\s*기\s*화\s*$/ });
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
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await wait(2500);

    // 1305 + 발신기록 조회창
    {
      const o = (out['1305'] = {});
      try {
        await open('관리자', '고객별 문자사용량');
        const scr = tab();
        o.buttons = await labels(scr);
        await scr.locator('.ag-row[row-index="0"] [col-id="actionCell"]').first().click(); await wait(1500);
        const dlg = p.locator('.ant-modal:visible').last();
        o.dialogButtons = await labels(dlg);
        await resetCheck(dlg, o);
        await p.screenshot({ path: `${OUT}/B12-4-1305.png` });
        await dlg.locator('button').filter({ hasText: /닫/ }).first().click(); await wait(500);
      } catch (e) { o.err = e.message.split('\n')[0]; await p.screenshot({ path: `${OUT}/B12-4-1305-err.png` }).catch(() => {}); }
    }
    // 1367: 오른쪽 조회줄 (왼쪽 행을 고르면 활성)
    {
      const o = (out['1367'] = {});
      try {
        await open('관리자', '고객별 문자발송');
        const scr = tab();
        o.buttons = await labels(scr);
        await resetCheck(scr, o);
        await p.screenshot({ path: `${OUT}/B12-4-1367.png` });
      } catch (e) { o.err = e.message.split('\n')[0]; await p.screenshot({ path: `${OUT}/B12-4-1367-err.png` }).catch(() => {}); }
    }
  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
