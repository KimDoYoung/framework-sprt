// E13 책무매뉴얼 재생성(Tdm42_Tab_ManlManagerAdmin #1502) + 점검항목 조회창(Tdm43_Lookup_ManlItem)·조직찾기(Org00_Lookup_SelectTdm) 화면 확인.
// 읽기만 한다 — 재생성은 RD 연동이 없어 서버가 거절하므로 DB·파일이 바뀌지 않는다. 점검항목 삭제는 확인창에서 [아니오]로 닫는다(실제 삭제는 하지 않음).
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E13.js <스크린샷 폴더> [회사]
const { launch, login, openMenu, checkGrid, gridOk } = require('./_common');
const [OUT, COMPANY = 'admin'] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, steps: {} };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  const gets = [];
  p.on('response', r => {
    const u = r.url();
    if (!u.includes('/api/v1/tdm/') && !u.includes('/api/v1/org/') && !u.includes('/api/v1/sys/files')) return;
    const m = r.request().method();
    const pathq = decodeURIComponent(u.split('/api/v1/')[1]);
    if (['PUT', 'POST', 'DELETE'].includes(m)) writes.push(m + ' ' + pathq + ' ' + r.status()); else gets.push(pathq);
  });
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const btn = (scope, re, n = 0) => scope.locator('button').filter({ hasText: re }).nth(n);
  const rows = g => g.locator('.ag-row[row-index]:not(.summary-row)').count();   // 합계 행 제외
  const modal = title => p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: title }) }).last();
  try {
    await login(p, COMPANY);
    await openMenu(p, '기초자료', '책무매뉴얼 재생성');
    const scr = p.locator('.flexlayout__tab:visible').last();
    await wait(2000);
    const grid = scr.locator('.ag-root-wrapper').first();
    const fields = scr.locator('.ant-input-affix-wrapper input');     // [0] 고객사, [1] 부서
    out.buttons = (await scr.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.headers = (await grid.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.groupHeaders = (await grid.locator('.ag-header-group-cell-label').allInnerTexts()).join('|');
    out.checkboxes = await scr.locator('.ant-checkbox-wrapper').allInnerTexts();
    out.checked = await scr.locator('.ant-checkbox-wrapper input').evaluateAll(a => a.map(i => i.checked));
    out.dateDisabled = await scr.locator('.ant-picker input').evaluateAll(a => a.map(i => i.disabled));
    out.companyField = await fields.nth(0).inputValue();
    out.orgPlaceholder = await fields.nth(1).getAttribute('placeholder');
    out.searchPlaceholder = await scr.locator('input.ant-input[placeholder="직책/임원"]').count();
    out.rowsOpen = await rows(grid);                         // 열 때 조회하지 않는다
    out.getsOpen = gets.slice();
    await p.screenshot({ path: `${OUT}/E13-open.png` });

    // [E5] 조회 (고객사 기본 ADMIN)
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
    out.rowsAdmin = await rows(grid); out.getsAdmin = gets.slice(-1);

    // [E3] 고객사 조회창 → 한국펀드서비스
    await fields.nth(0).click(); await wait(1500);
    const lk = modal('고객사 찾기');
    await lk.locator('input.ant-input').first().fill('한국펀드'); await lk.locator('input.ant-input').first().press('Enter'); await wait(1500);
    await lk.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click(); await wait(300);
    await lk.locator('button').filter({ hasText: /확\s*인/ }).first().click(); await wait(2000);
    out.companyAfter = await fields.nth(0).inputValue();
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
    out.rowsAll = await rows(grid); out.getsAll = gets.slice(-1);
    out.rowTexts = (await grid.locator('.ag-row[row-index]').allInnerTexts()).slice(0, 2).map(t => t.replace(/\s+/g, ' '));
    out.sumRow = (await grid.locator('.summary-row').allInnerTexts()).map(t => t.replace(/\s+/g, ' '));
    await p.screenshot({ path: `${OUT}/E13-all.png` });

    // [E4] 검색어 Enter → 직책/임원 필터
    const st = scr.locator('input.ant-input[placeholder="직책/임원"]');
    await st.fill('김'); await st.press('Enter'); await wait(300);
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
    out.rowsSearch = await rows(grid); out.getsSearch = gets.slice(-1);
    await st.fill('');

    // [E1] 전체보기 해제 → 기간 칸 사용 + 자동 조회
    await scr.locator('.ant-checkbox-wrapper', { hasText: '전체보기' }).click(); await wait(1500);
    out.dateEnabledAfter = await scr.locator('.ant-picker input').evaluateAll(a => a.map(i => !i.disabled));
    out.rowsPeriod = await rows(grid); out.getsPeriod = gets.slice(-1);
    await scr.locator('.ant-checkbox-wrapper', { hasText: '전체보기' }).click(); await wait(1500);
    out.rowsBackAll = await rows(grid);

    // [E2] 부서 조회창 (Org00_Lookup_SelectTdm.openAll)
    // 이 메뉴는 admin 회사에서만 열리고 admin 회사에는 책무 대상 조직이 없다 → 조직 조회 응답만 고객사(kfstest) 조회 결과 2건(yunhee api -c kfstest, 12건 = SQL 12건)으로 대신한다
    await p.route('**/api/v1/org/org-infos/tdm**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, message: null, data: [
      { orgCodeId: 29021, orgCd: '12000', korNm: '금융서비스팀', korNmWithSubOrg: '금융서비스팀' },
      { orgCodeId: 202511249196633, orgCd: '13100', korNm: '경영기획실', korNmWithSubOrg: '경영기획실' }] }) }));
    await fields.nth(1).click(); await wait(1500);
    const og = modal('조직찾기');
    out.orgBtns = (await og.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.orgHeaders = (await og.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.orgRows = await rows(og.locator('.ag-root-wrapper').first()); out.getsOrg = gets.slice(-1);
    await og.locator('button').filter({ hasText: /확\s*인/ }).first().click(); out.msgOrgNone = await msgs(); await wait(2800);
    const ogRows = og.locator('.ag-row[row-index]');
    if ((await ogRows.count()) >= 2) {
      await og.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click({ force: true });
      await og.locator('.ag-row[row-index="1"] input[type=checkbox]').first().click({ force: true });
      await og.locator('button').filter({ hasText: /확\s*인/ }).first().click(); out.msgOrgTwo = await msgs(); await wait(2800);
      await og.locator('.ag-row[row-index="1"] input[type=checkbox]').first().click({ force: true });
    }
    if ((await ogRows.count()) >= 1) {
      await og.locator('button').filter({ hasText: /확\s*인/ }).first().click(); await wait(500);
      out.orgPicked = await fields.nth(1).inputValue();
      await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);
      out.rowsOrg = await rows(grid); out.getsOrgSearch = gets.slice(-1);
      // [전체] → 부서 비움
      await fields.nth(1).click(); await wait(1500);
      await modal('조직찾기').locator('button').filter({ hasText: /^\s*전\s*체\s*$/ }).first().click(); await wait(500);
      out.orgAfterAll = await fields.nth(1).inputValue();
    } else {
      await og.locator('button').filter({ hasText: /닫\s*기/ }).first().click(); await wait(500);
    }
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);

    // 그리드 기본 점검
    const gc = await checkGrid(p, scr); out.grid = gc; out.gridOk = gridOk(gc);

    // 점검항목 조회창: 앞 행들의 아이콘을 열어 잠금(등록·삭제 없음)/비잠금 둘 다 본다
    out.items = [];
    const n = Math.min(await rows(grid), 12);
    let sawLocked = false, sawOpen = false;
    for (let i = 0; i < Math.min(n, 3) && !(sawLocked && sawOpen); i++) {   // 상신건만 나오는 화면이라 모두 잠금 — 앞 3건만 연다
      await grid.locator(`.ag-row[row-index="${i}"] [col-id="actionCell"] button`).click(); await wait(2000);
      const dlg = modal('점검항목');
      const hasDelete = (await dlg.locator('button').filter({ hasText: /삭\s*제/ }).count()) > 0;
      const info = {
        i, title: (await dlg.locator('.ant-modal-title').innerText()).replace(/\s+/g, ' '),
        btns: (await dlg.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(','),
        rows: await rows(dlg.locator('.ag-root-wrapper').first()),
      };
      if ((hasDelete && !sawOpen) || (!hasDelete && !sawLocked)) {
        info.headers = (await dlg.locator('.ag-header-cell-text').allInnerTexts()).join('|');
        info.combo = await dlg.locator('.ant-select-selection-item').allInnerTexts();
        info.firstRow = (await dlg.locator('.ag-row[row-index="0"]').allInnerTexts()).map(t => t.replace(/\s+/g, ' ')).slice(0, 1);
        await p.screenshot({ path: `${OUT}/E13-item-${hasDelete ? 'open' : 'locked'}.png` });
        if (hasDelete) {
          sawOpen = true;
          const dg = dlg.locator('.ag-root-wrapper').first();
          // 선택 없이 삭제·등록 → 안내
          await btn(dlg, /삭\s*제/).click(); info.msgDeleteNone = await msgs(); await wait(2800);
          await btn(dlg, /등\s*록/).click(); info.msgInsertNone = await msgs(); await wait(2800);
          // 점검항목이 없는 관리의무 행(점검항목 열이 비어 있는 행) 삭제 → 안내
          const total = await rows(dg);
          for (let r = 0; r < total; r++) {
            const cell = (await dg.locator(`.ag-row[row-index="${r}"] [col-id="checkItemAddCode"]`).first().innerText()).trim();
            if (!cell) {
              await dg.locator(`.ag-row[row-index="${r}"] input[type=checkbox]`).first().click({ force: true });
              await btn(dlg, /삭\s*제/).click(); info.msgDeleteNoManl = await msgs(); await wait(2800);
              break;
            }
          }
          // 점검항목이 있는 행 선택 → 삭제 확인창 → [아니오]
          for (let r = 0; r < total; r++) {
            const cell = (await dg.locator(`.ag-row[row-index="${r}"] [col-id="checkItemAddCode"]`).first().innerText()).trim();
            if (cell) {
              await dg.locator(`.ag-row[row-index="${r}"] input[type=checkbox]`).first().click({ force: true });
              await btn(dlg, /삭\s*제/).click(); await wait(800);
              const cf = p.locator('.ant-modal-confirm:visible').last();
              info.confirmText = (await cf.innerText()).replace(/\s+/g, ' ');
              await cf.locator('button').filter({ hasText: /아니오/ }).click(); await wait(500);
              info.rowsAfterCancel = await rows(dg);
              break;
            }
          }
        } else sawLocked = true;
        {
          const dg = dlg.locator('.ag-root-wrapper').first();
          // 점검항목 보기 아이콘 → 다음 단계 안내
          await dlg.locator('[col-id="viewCell"] button').first().click().catch(() => {}); info.msgView = await msgs(); await wait(2800);
          // 검색·사용여부
          await dlg.locator('input.ant-input').first().fill('zzzz존재안함'); await dlg.locator('input.ant-input').first().press('Enter'); await wait(1500);
          info.rowsNoMatch = await rows(dg); info.getsSearch = gets.slice(-1);
          await dlg.locator('input.ant-input').first().fill('');
          await dlg.locator('.ant-select').first().click(); await wait(500);
          info.comboOptions = (await p.locator('.ant-select-dropdown:visible .ant-select-item-option').allInnerTexts());
          await p.locator('.ant-select-dropdown:visible .ant-select-item-option').filter({ hasText: '미사용' }).first().click().catch(() => {}); await wait(1500);
          info.rowsUnuse = await rows(dg); info.getsUnuse = gets.slice(-1);
        }
      }
      out.items.push(info);
      await btn(dlg, /닫\s*기/).click(); await wait(500);
    }

    // 새로 열어(그리드 점검의 선택을 없애고) 고객사를 다시 고른 뒤 [E6] 재생성을 본다
    await p.reload({ waitUntil: 'networkidle' }); await wait(2500);
    await openMenu(p, '기초자료', '책무매뉴얼 재생성');
    const scr2 = p.locator('.flexlayout__tab:visible').last(); await wait(1500);
    const grid2 = scr2.locator('.ag-root-wrapper').first();
    await scr2.locator('.ant-input-affix-wrapper input').first().click(); await wait(1500);
    const lk2 = modal('고객사 찾기');
    await lk2.locator('input.ant-input').first().fill('한국펀드'); await lk2.locator('input.ant-input').first().press('Enter'); await wait(1500);
    await lk2.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click(); await wait(300);
    await lk2.locator('button').filter({ hasText: /확\s*인/ }).first().click(); await wait(1500);
    await btn(scr2, /^\s*조\s*회\s*$/).click(); await wait(1500);
    // [E6] 선택 없이 재생성 → 안내
    await btn(scr2, /재\s*생\s*성/).click(); out.msgNoSelect = await msgs(); await wait(2800);
    // 두 건 선택 → 재생성 → 진행 창 → 서버 거절을 건너뛰며 끝까지 → [닫기]
    await grid2.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').first().click({ force: true });
    await grid2.locator('.ag-row[row-index="1"] .ag-selection-checkbox input').first().click({ force: true }); await wait(300);
    await btn(scr2, /재\s*생\s*성/).click(); await wait(2500);
    const rd = modal('파일 재생성');
    out.dlgText = (await rd.locator('.ant-modal-body').innerText()).replace(/\s+/g, ' ');
    out.dlgCloseEnabled = await rd.locator('button').filter({ hasText: /닫\s*기/ }).first().isEnabled();
    await p.screenshot({ path: `${OUT}/E13-recreate.png` });
    await rd.locator('button').filter({ hasText: /닫\s*기/ }).first().click(); await wait(500);
    out.dlgClosed = (await modal('파일 재생성').count()) === 0;

    // 책무매뉴얼 보기 아이콘
    await grid2.locator('.ag-body-horizontal-scroll-viewport').evaluate(el => { el.scrollLeft = 5000; }); await wait(500);
    out.viewIcons = await grid2.locator('[col-id="startDateYnStr"] button').count();
    await grid2.locator('.ag-row[row-index="0"] [col-id="startDateYnStr"] button').first().click(); out.msgView = await msgs(); await wait(800);
    out.getsView = gets.slice(-2);
    await p.screenshot({ path: `${OUT}/E13-view.png` });
  } catch (e) { out.error = String(e).slice(0, 500); await p.screenshot({ path: `${OUT}/E13-error.png` }).catch(() => {}); }
  out.writes = writes; out.getsAll2 = gets.length;
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
