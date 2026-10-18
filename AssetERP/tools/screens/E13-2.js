// E13-2 점검항목 등록/수정/상세보기(Tdm43_Edit_Manl)·연관 페이지(Tdm43_Page_Relate)·임원의무(Tdm43_Lookup_ExctDuty)·양식 불러오기(Tdm43_Lookup_RelateFormFileList) 화면 확인.
// 이 메뉴(#1502)는 상신건(=잠금)만 나오므로 등록·수정 화면을 열 길이 없다 → 책무매뉴얼 목록 응답의 첫 행만 시험용 비잠금 부서 책무매뉴얼(202605189724239, 관리의무 2건)로 바꿔 부른다.
// 양식 파일 목록은 admin 회사에 없어 응답만 고객사 조회 결과 1건으로 대신한다. 시험으로 만든 점검항목 1건은 마지막에 [삭제]로 지운다(연결 법규·양식 포함) — 잔여 0은 스크립트 밖에서 DB로 확인.
// 사용: CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E13-2.js <스크린샷 폴더>
const { launch, login, openMenu } = require('./_common');
const [OUT] = process.argv.slice(2);
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, steps: {} };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  const gets = [];
  p.on('response', r => {
    const u = r.url();
    if (!u.includes('/api/v1/tdm/') && !u.includes('/api/v1/ics/')) return;
    const m = r.request().method();
    const pathq = decodeURIComponent(u.split('/api/v1/')[1]).slice(0, 140);
    if (['PUT', 'POST', 'DELETE'].includes(m)) writes.push(m + ' ' + pathq + ' ' + r.status()); else gets.push(pathq);
  });
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const btn = (scope, re, n = 0) => scope.locator('button').filter({ hasText: re }).nth(n);
  const rows = g => g.locator('.ag-row[row-index]:not(.summary-row)').count();
  const modal = title => p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: title }) }).last();
  try {
    // 시험용 응답 대체 (위 설명)
    await p.route(/\/api\/v1\/tdm\/manl-orgs\?/, async route => {
      const r = await route.fetch(); const j = await r.json();
      if (Array.isArray(j.data) && j.data.length) j.data[0] = { ...j.data[0], manlOrgId: 202605189724239, lockYn: false };
      await route.fulfill({ response: r, json: j });
    });
    await p.route(/\/api\/v1\/tdm\/manls\/form-files/, route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, message: null,
      data: [{ fileId: 202603109520340, tdmCheckFormTypeName: '기타', fileName: '[컴퓨존]온라인견적서_20250404_O-7610344.pdf', note: '', regDate: '2026-03-10' }] }) }));

    await login(p, 'admin');
    await openMenu(p, '기초자료', '책무매뉴얼 재생성');
    const scr = p.locator('.flexlayout__tab:visible').last(); await wait(2000);
    const grid = scr.locator('.ag-root-wrapper').first();
    const fields = scr.locator('.ant-input-affix-wrapper input');
    await fields.nth(0).click(); await wait(1500);
    const lk = modal('고객사 찾기');
    await lk.locator('input.ant-input').first().fill('한국펀드'); await lk.locator('input.ant-input').first().press('Enter'); await wait(1500);
    await lk.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click(); await wait(300);
    await lk.locator('button').filter({ hasText: /확\s*인/ }).first().click(); await wait(1500);
    await btn(scr, /^\s*조\s*회\s*$/).click(); await wait(1500);

    // 점검항목 조회창 (비잠금)
    await grid.locator('.ag-row[row-index="0"] [col-id="actionCell"] button').click(); await wait(2500);
    const item = modal('점검항목');
    const ig = item.locator('.ag-root-wrapper').first();
    out.itemBtns = (await item.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.itemRowsBefore = await rows(ig);
    out.itemFirstRow = (await ig.locator('.ag-row[row-index="0"]').allInnerTexts()).map(t => t.replace(/\s+/g, ' ')).slice(0, 1);

    // [등록] 선택 없이 → 안내, 관리의무 선택 → 등록창
    await btn(item, /등\s*록/).click(); out.msgInsertNone = await msgs(); await wait(2800);
    await ig.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click({ force: true }); await wait(300);
    await btn(item, /등\s*록/).click(); await wait(2500);
    const ed = modal('등록');
    out.editTitle = (await ed.locator('.ant-modal-title').innerText()).trim();
    out.editBtns = (await ed.locator('.ant-modal-footer button').allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.editDisabled = await ed.locator('input[disabled], textarea[disabled]').evaluateAll(a => a.map(i => i.value.slice(0, 20)));
    out.monthDisabled = await ed.locator('.ant-checkbox-input').evaluateAll(a => a.length);
    out.getsOpen = gets.filter(g => g.includes('next-id') || g.includes('relates'));
    await p.screenshot({ path: `${OUT}/E13-2-insert.png` });

    // 저장 검사 3종
    await btn(ed, /저\s*장/).click(); out.msgNoItem = await msgs(); await wait(2800);
    await ed.locator('textarea[placeholder="점검항목명을 입력하세요"]').fill('E13-2 시험 점검항목');
    await btn(ed, /저\s*장/).click(); out.msgNoCycle = await msgs(); await wait(2800);
    // 점검주기 선택: 연별(06)이면 점검월이 모두 해제 → "점검시기를 선택하세요"
    const cycleSel = ed.locator('.ant-select').first();
    await cycleSel.click(); await wait(600);
    out.cycleOptions = await p.locator('.ant-select-dropdown:visible .ant-select-item-option').allInnerTexts();
    const pick = async re => { await cycleSel.click(); await wait(500); await p.locator('.ant-select-dropdown:visible .ant-select-item-option').filter({ hasText: re }).first().click(); await wait(500); };
    await p.keyboard.press('Escape'); await wait(300);
    await pick(/연별/);
    out.monthsYear = await ed.locator('.ant-checkbox-input').evaluateAll(a => a.filter(i => i.checked).length);
    await btn(ed, /저\s*장/).click(); out.msgNoMonth = await msgs(); await wait(2800);
    await pick(/분기/); out.monthsQuarter = await ed.locator('.ant-checkbox-input').evaluateAll(a => a.map(i => i.checked ? 1 : 0).join(''));
    await pick(/반기/); out.monthsHalf = await ed.locator('.ant-checkbox-input').evaluateAll(a => a.map(i => i.checked ? 1 : 0).join(''));
    await pick(/수시/); out.monthsAnytime = await ed.locator('.ant-checkbox-input').evaluateAll(a => a.map(i => `${i.checked ? 1 : 0}${i.disabled ? 'd' : ''}`).join('').slice(0, 14));
    await pick(/월별/); out.monthsMonthly = await ed.locator('.ant-checkbox-input').evaluateAll(a => a.filter(i => i.checked).length);

    // 임원의무
    await ed.locator('input[placeholder="선택하세요"][readonly]').click(); await wait(800);
    const ex = modal('임원의 상당한 주의의무');
    out.exctBoxes = await ex.locator('.ant-checkbox-wrapper').count();
    await ex.locator('.ant-checkbox-wrapper').nth(0).click(); await ex.locator('.ant-checkbox-wrapper').nth(2).click();
    await btn(ex, /선택완료/).click(); await wait(500);
    out.exctName = await ed.locator('input[readonly][placeholder="선택하세요"]').inputValue();
    // 점검방법 링크
    await ed.locator('textarea[placeholder="점검방법을 입력하세요"]').fill('시험 점검방법');
    await ed.locator('a', { hasText: '점검방법 :' }).dispatchEvent('mousedown'); await wait(500);
    const how = modal('점검방법'); out.howText = await how.locator('textarea').inputValue();
    await btn(how, /닫\s*기/).click(); await wait(300);

    // 연관 탭: 연관법규 [추가] (연결 안 된 법규만)
    out.tabs = (await ed.locator('.ant-tabs-tab').allInnerTexts()).map(t => t.replace(/\s+/g, ' '));
    out.addDisabledOnRef = await btn(ed, /^\s*추\s*가\s*$/).isDisabled();
    await ed.locator('.ant-tabs-tab', { hasText: '연관법규' }).click(); await wait(500);
    out.addDisabledOnIcs = await btn(ed, /^\s*추\s*가\s*$/).isDisabled();
    await btn(ed, /^\s*추\s*가\s*$/).click(); await wait(2500);
    const sm = modal('법규 분류');
    out.icsLookupGets = gets.filter(g => g.includes('laws/lookup')).slice(-1);
    await btn(sm, /확\s*인/).click(); out.msgIcsNone = await msgs(); await wait(2800);
    await sm.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click({ force: true });
    await btn(sm, /확\s*인/).click(); await wait(800);
    out.tabsAfterIcs = (await ed.locator('.ant-tabs-tab').allInnerTexts()).map(t => t.replace(/\s+/g, ' '));
    // 연관내규·문서분류 [추가] → 안내
    await ed.locator('.ant-tabs-tab', { hasText: '연관내규' }).click(); await wait(300);
    await btn(ed, /^\s*추\s*가\s*$/).click(); out.msgIcr = await msgs(); await wait(2800);
    // 연관양식 [추가]
    await ed.locator('.ant-tabs-tab', { hasText: '연관양식' }).click(); await wait(300);
    await btn(ed, /^\s*추\s*가\s*$/).click(); await wait(2000);
    const ff = modal('불러오기');
    out.formBtns = (await ff.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
    out.formHeaders = (await ff.locator('.ag-header-cell-text').allInnerTexts()).join('|');
    out.formRows = await rows(ff.locator('.ag-root-wrapper').first());
    await btn(ff, /확\s*인/).click(); out.msgFormNone = await msgs(); await wait(2800);
    await ff.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click({ force: true });
    await btn(ff, /확\s*인/).click(); await wait(800);
    out.tabsAfterForm = (await ed.locator('.ant-tabs-tab').allInnerTexts()).map(t => t.replace(/\s+/g, ' '));
    await p.screenshot({ path: `${OUT}/E13-2-relate.png` });

    // 저장 → 새로고침된 연결(id가 붙음) + 목록 갱신
    await btn(ed, /저\s*장/).click(); out.msgSaved = await msgs(); await wait(2500);
    out.writesAfterSave = writes.slice();
    out.getsAfterSave = gets.slice(-3);
    await btn(ed, /닫\s*기/).click(); await wait(1500);
    out.itemRowsAfter = await rows(ig);

    // 새 점검항목 행: 점검항목 열에 "(코드) 시험 점검항목" — 보기 아이콘 → 수정창
    const total = await rows(ig); let newIdx = -1;
    for (let r = 0; r < total; r++) { const t = await ig.locator(`.ag-row[row-index="${r}"] [col-id="checkItemAddCode"]`).first().innerText(); if (t.includes('E13-2 시험')) newIdx = r; }
    out.newIdx = newIdx;
    await ig.locator(`.ag-row[row-index="${newIdx}"] [col-id="viewCell"] button`).first().click(); await wait(2500);
    const ed2 = modal('수정');
    out.editTitle2 = (await ed2.locator('.ant-modal-title').innerText()).trim();
    out.edit2Item = await ed2.locator('textarea[placeholder="점검항목명을 입력하세요"]').inputValue();
    out.edit2Months = await ed2.locator('.ant-checkbox-input').evaluateAll(a => a.map(i => i.checked ? 1 : 0).join(''));
    out.edit2Exct = await ed2.locator('input[readonly][placeholder="선택하세요"]').inputValue();
    out.edit2Tabs = (await ed2.locator('.ant-tabs-tab').allInnerTexts()).map(t => t.replace(/\s+/g, ' '));
    await p.screenshot({ path: `${OUT}/E13-2-edit.png` });
    // 연관법규 삭제 아이콘 → 확인창 → 예 → 서버 삭제
    await ed2.locator('.ant-tabs-tab', { hasText: '연관법규' }).click(); await wait(500);
    await ed2.locator('.ag-row[row-index="0"] [col-id="del"] button').first().click(); await wait(600);
    const cf = p.locator('.ant-modal-confirm:visible').last();
    out.delConfirm = (await cf.innerText()).replace(/\s+/g, ' ');
    await cf.locator('button').filter({ hasText: /^\s*예\s*$/ }).click(); await wait(1200);
    out.tabsAfterDel = (await ed2.locator('.ant-tabs-tab').allInnerTexts()).map(t => t.replace(/\s+/g, ' '));
    // 연관양식 보기 아이콘 → 파일보기 창
    await ed2.locator('.ant-tabs-tab', { hasText: '연관양식' }).click(); await wait(500);
    await ed2.locator('.ag-row[row-index="0"] [col-id="view"] button').first().click(); await wait(1500);
    out.viewerOpen = (await modal('파일보기').count()) > 0;
    await btn(modal('파일보기'), /닫\s*기/).click().catch(() => {}); await wait(500);
    await btn(ed2, /닫\s*기/).click(); await wait(800);

    // 시험 점검항목 삭제 (연결 법규·양식 포함)
    await ig.locator(`.ag-row[row-index="${newIdx}"] input[type=checkbox]`).first().click({ force: true }); await wait(300);
    await btn(item, /삭\s*제/).click(); await wait(800);
    const cf2 = p.locator('.ant-modal-confirm:visible').last();
    await cf2.locator('button').filter({ hasText: /^\s*예\s*$/ }).click(); await wait(1500);
    out.itemRowsFinal = await rows(ig);
    await btn(item, /닫\s*기/).click(); await wait(500);
  } catch (e) { out.error = String(e).slice(0, 600); await p.screenshot({ path: `${OUT}/E13-2-error.png` }).catch(() => {}); }
  out.writes = writes; out.getsCount = gets.length;
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
