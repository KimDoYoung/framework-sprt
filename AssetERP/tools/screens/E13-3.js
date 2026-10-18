// E13-3 내규 선택 조회창(Icr01_Lookup_SelectMulti·SelectParent·Content)·내규 상세(Icr01_Lookup_ClassTreeDetail)·문서분류 선택 조회창(Dcr01_Lookup_SelectMulti) 화면 확인.
// Tdm43_Page_Relate(E13-2)의 연관내규·연관문서분류 [추가]·내규 보기 아이콘에서 연다. 점검항목 화면은 E13-2.js와 같이 상신건(=잠금)만 나오는 메뉴라 책무매뉴얼 목록 응답의 첫 행을 시험용 비잠금 부서로 바꿔 부른다.
// 내규(icr) 데이터는 고객사(kfstest, 28000)에만 있고 admin 로그인 회사(0)에는 없어, 내규 API 응답만 `yunhee api -c kfstest --raw`로 받아 둔 파일로 대신한다(ICR_DIR). 문서분류는 admin 회사(0)에 실제 데이터가 있어 그대로 쓴다.
// 시험으로 만든 점검항목 1건은 마지막에 [삭제]로 지운다(연결 내규·문서분류 포함) — 잔여 0은 스크립트 밖에서 DB로 확인.
// 사용: ICR_DIR=<icr-*.json 폴더> CHROME_PATH=/usr/bin/google-chrome-stable NODE_PATH=frontend/node_modules node tools/screens/E13-3.js <스크린샷 폴더>
const fs = require('fs');
const { launch, login, openMenu } = require('./_common');
const [OUT] = process.argv.slice(2);
const ICR_DIR = process.env.ICR_DIR;
(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, steps: {} };
  const wait = ms => p.waitForTimeout(ms);
  const writes = [];
  const gets = [];
  const bodies = [];
  p.on('response', r => {
    const u = r.url();
    if (!u.includes('/api/v1/tdm/') && !u.includes('/api/v1/icr/') && !u.includes('/api/v1/dcr/')) return;
    const m = r.request().method();
    const pathq = decodeURIComponent(u.split('/api/v1/')[1]).slice(0, 140);
    if (['PUT', 'POST', 'DELETE'].includes(m)) { writes.push(m + ' ' + pathq + ' ' + r.status()); if (m === 'PUT') bodies.push((r.request().postData() || '').slice(0, 900)); } else gets.push(pathq);
  });
  const msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  const btn = (scope, re, n = 0) => scope.locator('button').filter({ hasText: re }).nth(n);
  const rows = g => g.locator('.ag-row[row-index]:not(.summary-row)').count();
  const modalN = (title, n) => p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: title }) }).nth(n);
  const modal = title => p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: title }) }).last();
  const tabs = m => m.locator('.ant-tabs-tab').allInnerTexts().then(a => a.map(t => t.replace(/\s+/g, ' ')));
  const heads = m => m.locator('.ag-header-cell-text').allInnerTexts().then(a => a.join('|'));
  const btns = m => m.locator('button').filter({ hasText: /\S/ }).allInnerTexts().then(a => a.map(t => t.replace(/\s/g, '')).join(','));
  try {
    await p.route(/\/api\/v1\/tdm\/manl-orgs\?/, async route => {
      const r = await route.fetch(); const j = await r.json();
      if (Array.isArray(j.data) && j.data.length) j.data[0] = { ...j.data[0], manlOrgId: 202605189724239, lockYn: false };
      await route.fulfill({ response: r, json: j });
    });
    const canned = (re, file) => p.route(re, route => route.fulfill({ status: 200, contentType: 'application/json', body: fs.readFileSync(`${ICR_DIR}/${file}`, 'utf8') }));
    await canned(/\/api\/v1\/icr\/class-trees\?/, 'icr-tree.json');
    await canned(/\/api\/v1\/icr\/class-trees\/lookup/, 'icr-lookup.json');
    await canned(/\/api\/v1\/icr\/class-trees\/\d+\/detail/, 'icr-detail.json');

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

    await grid.locator('.ag-row[row-index="0"] [col-id="actionCell"] button').click(); await wait(2500);
    const item = modal('점검항목');
    const ig = item.locator('.ag-root-wrapper').first();
    out.itemRowsBefore = await rows(ig);
    await ig.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click({ force: true }); await wait(300);
    await btn(item, /등\s*록/).click(); await wait(2500);
    const ed = modal('등록');
    await ed.locator('textarea[placeholder="점검항목명을 입력하세요"]').fill('E13-3 시험 점검항목');
    const cycleSel = ed.locator('.ant-select').first();
    await cycleSel.click(); await wait(500); await p.locator('.ant-select-dropdown:visible .ant-select-item-option').filter({ hasText: /월별/ }).first().click(); await wait(500);

    // ── 연관내규 [추가] → Icr01_Lookup_SelectMulti
    await ed.locator('.ant-tabs-tab', { hasText: '연관내규' }).click(); await wait(300);
    await btn(ed, /^\s*추\s*가\s*$/).click(); await wait(2500);
    const sm = modalN('내규 분류', 0);
    out.icrTitle = (await sm.locator('.ant-modal-title').innerText()).trim();
    out.icrBtns = await btns(sm);
    out.icrHeaders = await heads(sm);
    out.icrPlaceholders = await sm.locator('input[placeholder]').evaluateAll(a => a.map(i => i.placeholder));
    out.icrClassName = await sm.locator('input[readonly]').first().inputValue();
    out.icrRows = await rows(sm.locator('.ag-root-wrapper').first());
    out.icrPaging = (await sm.locator('.ant-modal-body').innerText()).replace(/\s+/g, ' ').slice(-60);
    out.icrLookupGets = gets.filter(g => g.includes('icr/class-trees/lookup')).slice(-1);
    await p.screenshot({ path: `${OUT}/E13-3-icr-lookup.png` });
    // 분류 칸 → SelectParent
    await sm.locator('input[readonly]').first().click(); await wait(1500);
    const sp = modalN('내규 분류', 1);
    out.parentBtns = await btns(sp);
    out.parentHeaders = await heads(sp);
    out.parentRows = await rows(sp.locator('.ag-root-wrapper').first());
    await btn(sp, /확\s*인/).click(); out.msgParentNone = await msgs(); await wait(2800);
    await sp.locator('input.ant-input').first().fill('내규A001'); await btn(sp, /찾\s*기/).click(); await wait(800);
    out.parentSelectedAfterSearch = await sp.locator('.ag-row-selected').count();
    await p.screenshot({ path: `${OUT}/E13-3-icr-parent.png` });
    await btn(sp, /확\s*인/).click(); await wait(600);
    out.icrClassNameAfter = await sm.locator('input[readonly]').first().inputValue();
    // 분류 [전체]
    await sm.locator('input[readonly]').first().click(); await wait(1000);
    await btn(modalN('내규 분류', 1), /전\s*체/).click(); await wait(500);
    out.icrClassNameAll = await sm.locator('input[readonly]').first().inputValue();
    // [검색]
    await sm.locator('input[placeholder="내규코드/내규명"]').fill('내규A'); await btn(sm, /^\s*검\s*색\s*$/).click(); await wait(1000);
    out.icrGetsSearch = gets.filter(g => g.includes('icr/class-trees/lookup')).slice(-1);
    // 상세 아이콘 → Icr01_Lookup_Content.view
    await sm.locator('.ag-row[row-index="0"] [col-id="actionCell"] button').first().click(); await wait(800);
    const ct = modal('내규 상세내용');
    out.contentBtns = await btns(ct);
    out.contentReadonly = await ct.locator('textarea').evaluate(t => t.readOnly);
    out.contentText = (await ct.locator('textarea').inputValue()).slice(0, 30);
    await btn(ct, /닫\s*기/).click(); await wait(500);
    // [확인] 선택 없이 → 안내, 선택 후 → 탭 건수
    await btn(sm, /확\s*인/).click(); out.msgIcrNone = await msgs(); await wait(2800);
    await sm.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click({ force: true });
    await sm.locator('.ag-row[row-index="1"] input[type=checkbox]').first().click({ force: true });
    await btn(sm, /확\s*인/).click(); await wait(800);
    out.tabsAfterIcr = await tabs(ed);

    // ── 연관문서분류 [추가] → Dcr01_Lookup_SelectMulti
    await ed.locator('.ant-tabs-tab', { hasText: '연관문서분류' }).click(); await wait(300);
    await btn(ed, /^\s*추\s*가\s*$/).click(); await wait(2500);
    const dm = modal('문서분류');
    out.dcrTitle = (await dm.locator('.ant-modal-title').innerText()).trim();
    out.dcrBtns = await btns(dm);
    out.dcrHeaders = await heads(dm);
    out.dcrPlaceholder = await dm.locator('input[placeholder]').evaluateAll(a => a.map(i => i.placeholder));
    out.dcrRows = await rows(dm.locator('.ag-root-wrapper').first());
    out.dcrGets = gets.filter(g => g.includes('dcr/class-trees/lookup')).slice(-1);
    await p.screenshot({ path: `${OUT}/E13-3-dcr-lookup.png` });
    await btn(dm, /확\s*인/).click(); out.msgDcrNone = await msgs(); await wait(2800);
    await dm.locator('input[placeholder]').fill('계약'); await btn(dm, /^\s*조\s*회\s*$/).click(); await wait(1200);
    out.dcrRowsSearch = await rows(dm.locator('.ag-root-wrapper').first());
    out.dcrGetsSearch = gets.filter(g => g.includes('dcr/class-trees/lookup')).slice(-1);
    await dm.locator('.ag-row[row-index="0"] input[type=checkbox]').first().click({ force: true });
    await btn(dm, /확\s*인/).click(); await wait(800);
    out.tabsAfterDcr = await tabs(ed);
    out.dcrRowText = (await ed.locator('.ant-tabs-tabpane-active .ag-row[row-index="0"]').first().innerText()).replace(/\s+/g, ' ').slice(0, 80);
    await p.screenshot({ path: `${OUT}/E13-3-relate.png` });

    // ── 저장 → 연결 목록 다시 읽기(id가 붙음)
    await btn(ed, /저\s*장/).click(); out.msgSaved = await msgs(); await wait(2500);
    out.writesAfterSave = writes.slice();
    out.putBody = bodies.slice(-1);
    out.relatesGets = gets.filter(g => g.includes('relates')).slice(-2);
    await btn(ed, /닫\s*기/).click(); await wait(1500);

    // ── 새 점검항목 → 수정창 → 연관내규 보기 아이콘 → Icr01_Lookup_ClassTreeDetail
    const total = await rows(ig); let newIdx = -1;
    for (let r = 0; r < total; r++) { const t = await ig.locator(`.ag-row[row-index="${r}"] [col-id="checkItemAddCode"]`).first().innerText(); if (t.includes('E13-3 시험')) newIdx = r; }
    out.newIdx = newIdx;
    await ig.locator(`.ag-row[row-index="${newIdx}"] [col-id="viewCell"] button`).first().click(); await wait(2500);
    const ed2 = modal('수정');
    out.edit2Tabs = await tabs(ed2);
    await ed2.locator('.ant-tabs-tab', { hasText: '연관내규' }).click(); await wait(500);
    out.edit2IcrRows = await rows(ed2.locator('.ant-tabs-tabpane-active .ag-root-wrapper').first());
    await ed2.locator('.ant-tabs-tabpane-active .ag-row[row-index="0"] [col-id="view"] button').first().click(); await wait(1500);
    const dt = modal('내규 상세');
    out.detailTitle = (await dt.locator('.ant-modal-title').innerText()).trim();
    out.detailBtns = await btns(dt);
    out.detailValues = await dt.locator('textarea').evaluateAll(a => a.map(t => t.value.slice(0, 24)));
    out.detailReadonly = await dt.locator('textarea').evaluateAll(a => a.every(t => t.readOnly));
    out.detailFileHeaders = await heads(dt);
    out.detailFileBox = await dt.locator('.ag-root-wrapper').first().boundingBox();
    out.detailFileGets = gets.filter(g => g.startsWith('files') || g.includes('files')).slice(-1);
    await p.screenshot({ path: `${OUT}/E13-3-detail.png` });
    await btn(dt, /닫\s*기/).click(); await wait(500);
    // 삭제 아이콘(연관내규 → 연관문서분류)
    await ed2.locator('.ant-tabs-tabpane-active .ag-row[row-index="0"] [col-id="del"] button').first().click(); await wait(600);
    const cf = p.locator('.ant-modal-confirm:visible').last();
    out.delIcrConfirm = (await cf.innerText()).replace(/\s+/g, ' ');
    await cf.locator('button').filter({ hasText: /^\s*예\s*$/ }).click(); await wait(1200);
    await ed2.locator('.ant-tabs-tab', { hasText: '연관문서분류' }).click(); await wait(500);
    await ed2.locator('.ant-tabs-tabpane-active .ag-row[row-index="0"] [col-id="del"] button').first().click(); await wait(600);
    const cf1 = p.locator('.ant-modal-confirm:visible').last();
    out.delDcrConfirm = (await cf1.innerText()).replace(/\s+/g, ' ');
    await cf1.locator('button').filter({ hasText: /^\s*예\s*$/ }).click(); await wait(1200);
    out.tabsAfterDel = await tabs(ed2);
    await btn(ed2, /닫\s*기/).click(); await wait(800);

    // 시험 점검항목 삭제
    await ig.locator(`.ag-row[row-index="${newIdx}"] input[type=checkbox]`).first().click({ force: true }); await wait(300);
    await btn(item, /삭\s*제/).click(); await wait(800);
    const cf2 = p.locator('.ant-modal-confirm:visible').last();
    await cf2.locator('button').filter({ hasText: /^\s*예\s*$/ }).click(); await wait(1500);
    out.itemRowsFinal = await rows(ig);
    await btn(item, /닫\s*기/).click(); await wait(500);
  } catch (e) { out.error = String(e).slice(0, 600); await p.screenshot({ path: `${OUT}/E13-3-error.png` }).catch(() => {}); }
  out.writes = writes; out.getsCount = gets.length;
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
