// 화면 확인 스크립트 공통 부분: 브라우저·로그인·메뉴 열기, 그리드 기본 점검(06 항목 6).
// 그리드 기본 점검은 모든 화면 스크립트가 그리드마다 부른다 — 결과확인을 통과한 뒤 사용자가 찾은 공통 결함(C01-6 후속)을 막기 위해.
//   ① 헤더 클릭 → 정렬 표시 없음(03 원칙 13) ② `gb-check` 체크박스 클릭 → 값이 바뀜(addBoolean 편집) ③ 행 선택 체크박스 클릭 → 선택됨
// 계정은 kfstest admin만 쓴다(사용자가 쓰는 계정으로 돌리면 중복 로그인 차단으로 사용자 세션이 끊긴다).
const { chromium } = require('playwright-core');

const BASE = 'http://admin.localhost:8082/AssetERP_1/';

async function launch() {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--host-resolver-rules=MAP *.localhost 127.0.0.1'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('401')) errs.push(m.text().slice(0, 150)); });
  return { b, p, errs };
}

async function login(p, company = 'kfstest') {
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.locator('.ant-select').first().click(); await p.keyboard.type(company); await p.waitForTimeout(500); await p.keyboard.press('Enter');
  await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
  await p.click('button[type=submit]'); await p.waitForTimeout(2500);
}

async function openMenu(p, group, menu) {
  await p.getByText(group, { exact: true }).first().click(); await p.waitForTimeout(600);
  await p.getByText(menu, { exact: true }).first().click(); await p.waitForTimeout(2500);
}

// scope 안의 첫 그리드를 점검한다. 저장하지 않는다 — 부른 쪽이 끝나고 조회로 버린다.
// 결과: { headerSorted, boolToggled, rowSelected } — 해당 요소가 없거나 보기 전용이면 null
async function checkGrid(p, scope) {
  const grid = scope.locator('.ag-root-wrapper').first();
  const r = { headerSorted: null, boolToggled: null, rowSelected: null };
  if (!(await grid.count())) return r;
  const header = grid.locator('.ag-header-cell').filter({ has: p.locator('.ag-header-cell-text:not(:empty)') }).first();
  if (await header.count()) {
    await header.click(); await p.waitForTimeout(300);
    r.headerSorted = (await grid.locator('.ag-header-cell-sorted-asc, .ag-header-cell-sorted-desc').count()) > 0;
  }
  const sel = grid.locator('.ag-row[row-index="0"] .ag-selection-checkbox input').first();
  if (await sel.count()) {
    await sel.click({ force: true }); await p.waitForTimeout(300);
    r.rowSelected = (await grid.locator('.ag-row[row-index="0"].ag-row-selected').count()) > 0;
  }
  const chk = grid.locator('.ag-row[row-index="0"] .gb-check input[type=checkbox]').first();
  // 보기 전용(CheckCell editable=false → pointer-events: none)은 건너뛴다 — 편집 그리드의 addBoolean만 클릭해 본다
  const editable = await chk.count() && await chk.evaluate(el => getComputedStyle(el.closest('.ant-checkbox-wrapper') || el).pointerEvents !== 'none');
  if (editable) {
    const before = await chk.isChecked();
    await chk.click(); await p.waitForTimeout(300);
    r.boolToggled = (await chk.isChecked()) !== before;
  }
  return r;
}

// checkGrid 결과 판정: 정렬 없음·체크박스 동작. 없는 요소(null)는 통과로 본다.
const gridOk = r => r.headerSorted !== true && r.boolToggled !== false && r.rowSelected !== false;

module.exports = { BASE, launch, login, openMenu, checkGrid, gridOk };
