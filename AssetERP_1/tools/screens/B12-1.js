// B12-1 UX보강 일괄 적용 확인 (sys 권한·메뉴 Sys03~Sys07). admin 테넌트 admin으로 확인한다(사용자 계정으로 로그인하지 않음).
// 관리자 > 화면권한관리 메뉴는 kfstest 회사에만 있어 kfstest admin으로 다시 로그인한다(A03과 같음).
// 화면마다: 툴바 버튼 문구, 검색 입력에 값을 넣으면 x(UX-04) → 초기화(UX-02, 조건 2개 이상인 줄만)로 처음 값, 초기화가 있는 줄의 줄바꿈 여부, 저장(n) 비활성(UX-03).
// 셀 편집·트리 권한 클릭으로 저장(n)이 켜지는지 본 뒤 조회로 버린다. 저장은 누르지 않는다(데이터 변경 없음).
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더의 상위 node_modules> node tools/screens/B12-1.js <스크린샷 폴더>'"
const { BASE, launch, login } = require('./_common');
const [OUT] = process.argv.slice(2);

const ADMIN = [
  ['관리자', '회사별 메뉴맵핑', '1076'],
  ['관리자', '메뉴 관리', '1077'],
  ['기초자료', '권한그룹 관리', '1112'],
  ['기초자료', '권한그룹별 메뉴권한 복사', '1247'],
  ['기초자료', '고객사별 메뉴권한 관리', '1286'],
  ['기초자료', '고객사별 사용자권한그룹 관리', '1307'],
];
const KFSTEST = [
  ['관리자', '권한그룹 관리', '1069'],
  ['관리자', '권한그룹별 메뉴 맵핑', '1070'],
  ['관리자', '권한그룹별 사용자 맵핑', '1071'],
  ['관리자', '사용자별 권한그룹 맵핑', '1072'],
  ['관리자', '사원별 메뉴권한(View)', '1283'],
  ['관리자', '메뉴별 그룹권한(View)', '1284'],
];

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const tab = () => p.locator('.flexlayout__tab:visible').last();
  const btn = (scr, re) => scr.locator('button').filter({ hasText: re });
  const saveTexts = async scr => btn(scr, /^\s*저\s*장/).evaluateAll(bs => bs.map(x => `${x.innerText.replace(/\s/g, '')}${x.disabled ? '(off)' : ''}`));
  // 메뉴 열기: 3차 메뉴가 안 보일 때만 1차 아이콘을 누른다(다시 누르면 서브메뉴가 닫힌다)
  const open = async (group, menu) => {
    const item = p.getByText(menu, { exact: true }).first();
    if (!(await item.isVisible())) { await p.getByText(group, { exact: true }).first().click(); await wait(500); }
    await item.click(); await wait(2500);
  };
  const check = async ([group, menu, no]) => {
      const o = (out[no] = {});
      try {
        await open(group, menu);
        const scr = tab();
        o.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
        o.save = (await saveTexts(scr)).join(',');
        // 초기화마다: 같은 검색 줄(.ant-space)의 편집 가능한 첫 글자 입력에 값을 넣고 x 수 → 초기화 → 값
        const resets = btn(scr, /^\s*초\s*기\s*화\s*$/).or(scr.locator('button[aria-label="초기화"]'));
        o.resets = [];
        for (let i = 0; i < await resets.count(); i++) {
          const bar = resets.nth(i).locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " ant-space ")][1]');
          const input = bar.locator('input.ant-input:not([readonly])').first();
          if (!(await input.count())) { o.resets.push('입력없음'); continue; }
          const wrapped = await bar.evaluate(el => new Set([...el.children].map(c => c.offsetTop)).size > 1);
          await input.fill('zz'); await wait(200);
          const clear = await bar.locator('.ant-input-clear-icon:not(.ant-input-clear-icon-hidden)').count();
          await resets.nth(i).click(); await wait(300);
          o.resets.push(`x=${clear} after='${await input.inputValue()}' wrap=${wrapped}`);
        }
        await p.screenshot({ path: `${OUT}/B12-1-${no}.png` });
      } catch (e) {
        o.err = e.message.split('\n')[0];
        await p.screenshot({ path: `${OUT}/B12-1-${no}-err.png` }).catch(() => {});
      }
  };
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await wait(2500);

    for (const sc of ADMIN) if (!process.env.ONLY || process.env.ONLY === sc[2]) await check(sc);
    if (process.env.ONLY) throw new Error('ONLY 끝');

    // 1077 일괄복사 팝업: 검색 줄 2개
    await open('관리자', '메뉴 관리');
    await btn(tab(), /일괄복사/).click(); await wait(2000);
    const modal = p.locator('.ant-modal:visible');
    const copyBar = btn(modal, /^\s*초\s*기\s*화\s*$/).locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " ant-space ")][1]');
    out.copyWrap = await copyBar.evaluateAll(els => els.map(el => new Set([...el.children].map(c => c.offsetTop)).size > 1));
    out.copyMulti = (await modal.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    await p.screenshot({ path: `${OUT}/B12-1-1077-copy.png` });
    await btn(modal, /^\s*닫\s*기\s*$/).click(); await wait(800);

    await p.context().clearCookies();
    await login(p, 'kfstest');
    for (const sc of KFSTEST) await check(sc);

    // UX-03 동작: 1069 셀 편집 → 저장(1) → 조회로 버림
    await open('관리자', '권한그룹 관리');
    let scr = tab();
    const cell = scr.locator('.ag-row[row-index="0"] .ag-cell[col-id="note"]');
    await cell.dblclick(); await wait(300); await p.keyboard.type('X'); await p.keyboard.press('Enter'); await wait(300);
    out.edit1069 = (await saveTexts(scr)).join(',');
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
    out.edit1069After = (await saveTexts(scr)).join(',');

    // 1070 트리 권한 칸 클릭 → 저장(n) → 조회로 버림
    await open('관리자', '권한그룹별 메뉴 맵핑');
    scr = tab();
    await scr.locator('.ant-splitter-panel').first().locator('.ag-row[row-index="0"] .ag-cell').first().click(); await wait(1500);
    const right = scr.locator('.ant-splitter-panel').last();
    await right.locator('.ag-row[row-index="0"] .ag-cell[col-id="useYn"]').click(); await wait(400);
    out.tree1070 = (await saveTexts(right)).join(',');
    await btn(right, /^\s*조\s*회\s*$/).click(); await wait(1500);
    out.tree1070After = (await saveTexts(right)).join(',');

    // 1072 권한 체크 → 저장(1) → 조회로 버림
    await open('관리자', '사용자별 권한그룹 맵핑');
    scr = tab();
    const lower = scr.locator('.ant-splitter-panel').last();
    await lower.locator('.ag-row[row-index="0"] .ag-cell[col-id="userRoleYn"] input').click(); await wait(400);
    out.role1072 = (await saveTexts(lower)).join(',');
    await btn(scr, /^\s*조\s*회\s*$/).first().click(); await wait(2000);
    out.role1072After = (await saveTexts(lower)).join(',');

  } catch (e) {
    console.error(e.message.split('\n')[0]); process.exitCode = 1;
    await p.screenshot({ path: OUT + '/B12-1-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
