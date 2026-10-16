// C01 하단 탭 공통 수정(2026-10-12 사용자 지적) 확인: 헤더 정렬 없음, 체크박스(행 선택·addBoolean) 동작, 날짜 칸 폭, 급여공제 2단.
// 그리드 점검은 _common.js checkGrid(06 항목 6). 저장하지 않는다(체크 후 조회로 버림).
// 사용: NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/C01-fix.js <스크린샷 폴더> [회사] [검색어]
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'kfstest', SEARCH = '천영임'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  try {
    await login(p, COMPANY);
    await openMenu(p, '경영관리', '사원정보 관리');
    const top = p.locator('.ant-splitter-panel').first(), bottom = p.locator('.ant-splitter-panel').last();
    out.datePickerWidth = await top.locator('.ant-picker').first().evaluate(el => el.getBoundingClientRect().width);
    await top.locator('input[style*="width: 120px"]').first().fill(SEARCH);
    await top.getByRole('button', { name: '조회' }).click(); await p.waitForTimeout(1500);
    out.목록 = await checkGrid(p, top);
    out.splitterPanels = await p.locator('.ant-splitter-panel').count();
    // 급여공제: 안쪽 분할 없음
    await bottom.locator('.ant-tabs-tab', { hasText: '급여공제' }).click(); await p.waitForTimeout(1500);
    out.splitterPanelsDeduct = await p.locator('.ant-splitter-panel').count();
    await p.screenshot({ path: OUT + '/C01-fix-deduct.png' });
    for (const tab of ['경력사항', '일반발령']) {
      await bottom.locator('.ant-tabs-tab', { hasText: tab }).click(); await p.waitForTimeout(1500);
      const r = await checkGrid(p, bottom);
      await p.screenshot({ path: OUT + `/C01-fix-${tab}.png` });
      await bottom.getByRole('button', { name: '조회' }).first().click(); await p.waitForTimeout(1000);
      out[tab] = r;
    }
    out.gridOk = ['목록', '경력사항', '일반발령'].every(k => gridOk(out[k]));
  } catch (e) {
    errs.push('SCRIPT: ' + e.message.slice(0, 200));
    await p.screenshot({ path: OUT + '/C01-fix-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
