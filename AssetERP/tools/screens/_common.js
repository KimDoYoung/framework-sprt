// 화면 확인 스크립트 공통 부분: 브라우저·로그인·메뉴 열기, 그리드 기본 점검(06 항목 6).
// 그리드 기본 점검은 모든 화면 스크립트가 그리드마다 부른다 — 결과확인을 통과한 뒤 사용자가 찾은 공통 결함(C01-6 후속)을 막기 위해.
//   ① 헤더 클릭 → 정렬 표시 없음(03 원칙 13) ② `gb-check` 체크박스 클릭 → 값이 바뀜(addBoolean 편집) ③ 행 선택 체크박스 클릭 → 선택됨
// 계정은 kfstest admin만 쓴다(사용자가 쓰는 계정으로 돌리면 중복 로그인 차단으로 사용자 세션이 끊긴다).
const { chromium } = require('playwright-core');

const BASE = 'http://admin.localhost:8082/AssetERP/';

async function launch() {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome', args: ['--host-resolver-rules=MAP *.localhost 127.0.0.1'] });
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

// 화면 스크립트마다 복붙하던 헬퍼 (E17 정리). `const h = helpers(p);` 뒤 `h.msgs()`·`h.btn(scope, /조회/)` …
// 기존 스크립트(A01~E16)는 바꾸지 않는다 — 이 함수는 추가일 뿐이다.
function helpers(p) {
  const wait = ms => p.waitForTimeout(ms);
  const h = { wait };

  /** 화면에 뜬 메시지 토스트 글자(0.5초 기다린 뒤). 다음 단계 전에 토스트가 사라지도록 부른 쪽이 `await wait(2800)` */
  h.msgs = async () => { await wait(500); return (await p.locator('.ant-message-notice').allInnerTexts()).join('|').replace(/\s+/g, ' '); };
  /** scope 안에서 글자가 맞는 n번째 버튼. 두 글자 버튼은 공백이 끼므로 /^\s*조\s*회\s*$/처럼 쓴다 */
  h.btn = (scope, re, n = 0) => scope.locator('button').filter({ hasText: re }).nth(n);
  /** AG Grid가 그린 행 수·행 글자 (가상화라 화면 밖 행은 빠진다 — 전체 행 수는 API compare로) */
  h.rows = g => g.locator('.ag-row[row-index]').count();
  h.rowsText = async g => (await g.locator('.ag-row[row-index]').allInnerTexts()).map(t => t.replace(/\s+/g, ' '));
  /**
   * 셀 글자가 모두 맞는 행의 DOM `row-index`(없으면 -1). 예: `h.findRowIdx(grid, { dayWorkHours: '77', startDate: '2099-01-01' })`, 빈 새 행은 `''`.
   * 시험 행을 `rowsText` 배열 순서로 찾지 않는다 — 새 행이 정렬로 위에 오면 인덱스가 어긋나 [삭제]가 기존 행을 지운다(E21·E23 사고).
   * 수정·삭제 직전에 이것으로 다시 찾고, -1이면 throw한다. 가상화라 화면 밖 행은 찾지 못한다.
   */
  h.findRowIdx = (g, cells) => g.evaluate((root, want) => {
    for (const r of root.querySelectorAll('.ag-row[row-index]')) {
      const ok = Object.entries(want).every(([col, text]) => (r.querySelector(`[col-id="${col}"]`)?.textContent ?? '').trim() === text);
      if (ok) return Number(r.getAttribute('row-index'));
    }
    return -1;
  }, cells);
  h.headers = async g => (await g.locator('.ag-header-cell-text').allInnerTexts()).join('|');
  /** scope 안의 글자 있는 버튼들 (공백 제거) */
  h.buttons = async scope => (await scope.locator('button').filter({ hasText: /\S/ }).allInnerTexts()).map(t => t.replace(/\s/g, '')).join(',');
  /** Modal.confirm 창의 제목·내용 / 예 / 아니오 */
  h.confirmText = () => p.locator('.ant-modal-confirm:visible .ant-modal-confirm-title, .ant-modal-confirm:visible .ant-modal-confirm-content').allInnerTexts().then(a => a.join(' / ').replace(/\s+/g, ' '));
  h.confirmYes = async () => { await p.locator('.ant-modal-confirm .ant-btn-primary').click(); await wait(2000); };
  h.confirmNo = async () => { await p.locator('.ant-modal-confirm .ant-btn-default').click(); await wait(600); };
  /** 제목에 글자가 든 열려 있는 모달 (여러 개면 마지막) */
  h.modal = title => p.locator('.ant-modal:visible', { has: p.locator('.ant-modal-title', { hasText: title }) }).last();

  /** AG Grid 가로 스크롤 — 화면 밖 열은 DOM에 없으므로(열 가상화) 그 열의 셀을 누르기 전에 민다. x가 크면 끝까지 */
  h.scrollX = (g, x) => g.locator('.ag-body-horizontal-scroll-viewport').evaluate((el, v) => { el.scrollLeft = v; }, x).then(() => wait(400));
  /** antd/rc-tree 노드 — 가상 목록은 숨은 측정용 `.ant-tree-treenode`가 앞에 있어 그것으로 세거나 first()를 누르면 안 된다 */
  h.treeNodes = scope => scope.locator('.ant-tree-node-content-wrapper');
  /** UX-03: 변경이 없으면 `저장(0)`이 비활성이라 클릭하면 30초 대기한다 — 눌러 보기 전에 이것으로 */
  h.saveDisabled = (scope, n = 0) => h.btn(scope, /저\s*장/, n).isDisabled();

  /**
   * 부작용이 큰 쓰기 호출(예: 모든 회사에 행을 채우는 linkCheck)의 응답을 대체한다 — 지울 API가 없어 실제로 부르면 데이터가 남을 때.
   * 반환 `{ calls }`는 대체된 호출 수. 대체한 사실과 실제 동작을 확인한 방법(DB 테스트 등)은 결과확인에 적는다.
   */
  h.mockWrite = async (urlGlob, data = 0) => {
    const state = { calls: 0 };
    await p.route(urlGlob, route => {
      state.calls++;
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, message: 'ok', data }) });
    });
    return state;
  };

  /**
   * 도메인 API 호출 기록. prefixes에 든 경로(`/api/v1/` 뒤)만 모은다.
   * `api.writes`: 'PUT dcr/links 200' 꼴, `api.gets`: 조회 경로(쿼리 포함, 디코딩)
   */
  h.trackApi = prefixes => {
    const api = { writes: [], gets: [] };
    p.on('response', r => {
      const u = r.url();
      if (!prefixes.some(x => u.includes('/api/v1/' + x))) return;
      const m = r.request().method();
      const pathq = decodeURIComponent(u.split('/api/v1/')[1]);
      if (['PUT', 'POST', 'DELETE'].includes(m)) api.writes.push(m + ' ' + pathq + ' ' + r.status()); else api.gets.push(pathq);
    });
    return api;
  };
  return h;
}

module.exports = { BASE, launch, login, openMenu, checkGrid, gridOk, helpers };
