// 화면 하단 잘림(height:100% + padding, box-sizing 없음) 점검: 메뉴를 열고 탭 안의 `height:100%` 요소가 탭 아래로 몇 px 넘치는지 잰다.
// 내부 탭(.ant-tabs-tab)은 하나씩 눌러 다시 잰다. 저장·삭제는 하지 않는다(데이터 변경 없음).
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더의 상위 node_modules> node tools/screens/border-box.js <스크린샷 폴더> [점검 라벨]'"
const { launch, login } = require('./_common');

// 이미 열린 상위 메뉴를 또 누르면 접히므로, 메뉴명이 안 보일 때만 상위 메뉴를 누른다
const openMenu = async (p, group, menu) => {
  const item = p.getByText(menu, { exact: true }).first();
  if (!(await item.isVisible().catch(() => false))) { await p.getByText(group, { exact: true }).first().click(); await p.waitForTimeout(600); }
  await item.click(); await p.waitForTimeout(2500);
};
const [OUT, LABEL = 'run'] = process.argv.slice(2);

// [로그인 회사, 상위 메뉴, 메뉴명, 화면번호]
const MENUS = [
  ['admin', '관리자', '고객별 문자사용량', 1305],
  ['admin', '관리자', '고객별 서버사용량', 1306],
  ['admin', '관리자', '고객별 특정화면 관리', 1410],
  ['admin', '관리자', '고객별 매뉴사용기록', 1429],
  ['admin', '관리자', '고객별 시스템정보 관리', 1075],
  ['admin', '관리자', '회사별 메뉴맵핑', 1076],
  ['admin', '관리자', '메뉴 관리', 1077],
  ['admin', '기초자료', '권한그룹 관리', 1112],
  ['admin', '기초자료', '고객사별 사용자권한그룹 관리', 1307],
  ['admin', '기초자료', '권한그룹별 메뉴권한 복사', 1247],
  ['admin', '기초자료', '고객사별 메뉴권한 관리', 1286],
  ['kfstest', '관리자', '특정화면 사용요청', 1409],
  ['kfstest', '관리자', '권한그룹 관리', 1069],
  ['kfstest', '관리자', '권한그룹별 사용자 맵핑', 1071],
  ['kfstest', '관리자', '사용자별 권한그룹 맵핑', 1072],
  ['kfstest', '관리자', '권한그룹별 메뉴 맵핑', 1070],
  ['kfstest', '관리자', '사원별 메뉴권한(View)', 1283],
  ['kfstest', '경영관리', '사원정보 관리', 1029],
  ['kfstest', '경영관리', '조직정보 등록', 1028],
];

// 보이는 탭 안에서 inline height:100% 요소가 탭 아래로 넘친 px의 최댓값 (넘침 없으면 0)
const overflow = p => p.evaluate(() => {
  const tabs = [...document.querySelectorAll('.flexlayout__tab')].filter(t => t.offsetParent !== null && t.getBoundingClientRect().height > 0);
  const tab = tabs[tabs.length - 1];
  if (!tab) return null;
  const tb = tab.getBoundingClientRect().bottom;
  let max = 0; let n = 0;
  for (const e of tab.querySelectorAll('[style*="height: 100%"]')) {
    const r = e.getBoundingClientRect();
    if (r.height === 0) continue;
    n++;
    max = Math.max(max, Math.round(r.bottom - tb));
  }
  return { over: max, checked: n };
});

(async () => {
  const out = [];
  let cur = null; let ctx = null;
  for (const [company, group, menu, no] of MENUS) {
    if (cur !== company) {
      if (ctx) await ctx.b.close();
      ctx = await launch(); cur = company;
      try { await login(ctx.p, company); } catch (e) { out.push({ no, menu, fail: 'login ' + e.message.split('\n')[0] }); continue; }
    }
    const { p } = ctx;
    const row = { no, menu, group };
    try {
      await openMenu(p, group, menu);
      const first = await overflow(p);
      row.over = first && first.over; row.checked = first && first.checked;
      // 내부 탭을 눌러 가며 잰다
      const tabs = p.locator('.flexlayout__tab:visible .ant-tabs-tab');
      const n = Math.min(await tabs.count(), 20);
      row.inner = [];
      for (let i = 0; i < n; i++) {
        await tabs.nth(i).click({ timeout: 3000 }).catch(() => {}); await p.waitForTimeout(700);
        const m = await overflow(p);
        row.inner.push(m ? m.over : null);
      }
      row.maxOver = Math.max(row.over ?? 0, ...row.inner.map(v => v ?? 0));
      await p.screenshot({ path: `${OUT}/${LABEL}-${no}.png` });
    } catch (e) {
      row.fail = e.message.split('\n')[0];
      await p.screenshot({ path: `${OUT}/${LABEL}-${no}-fail.png` }).catch(() => {});
    }
    out.push(row);
  }
  if (ctx) await ctx.b.close();
  console.log(JSON.stringify(out));
})();
