// C03 사용자정보 조회(Emp01_Tab_UserInfo + Emp02_Edit_Note + Sys01_Lookup_Company) 화면 확인.
// admin 회사 메뉴라 admin 회사 admin으로 로그인한다(A05와 같음). 저장은 비고가 비어 있는 첫 행에 같은 값(빈 값)만 — 데이터 그대로.
// 열기(자동 조회·첫 행 선택·페이징 문구) → 다음 페이지 → 검색어 Enter → 고객찾기(더블클릭 선택 → 조회 / 선택안함 → 전체 / 취소 → 그대로)
// → 더블클릭 복사(사원명 = '부서 이름 직위', 입사일 = 복사 안 함) → Edit 아이콘 → 체크내용 팝업 → 저장(같은 값) → 그리드 기본 점검.
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/C03.js <스크린샷 폴더>'"
const { BASE, launch, checkGrid, gridOk } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs };
  const wait = ms => p.waitForTimeout(ms);
  const msgs = async () => (await p.locator('.ant-message-notice').allInnerTexts()).join(' / ');
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await wait(2500);
    await p.getByText('관리자', { exact: true }).first().click(); await wait(600);
    await p.getByText('사용자정보 조회', { exact: true }).first().click(); await wait(2500);
    const tab = p.locator('.flexlayout__tab').filter({ has: p.locator('.ag-root-wrapper') }).last();
    const grid = tab.locator('.ag-root-wrapper').first();
    const paging = () => tab.getByText(/전체 \d+ 중|표시할 데이터가 없습니다/).first().innerText();

    out.buttons = await tab.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.headers = await grid.locator('.ag-header-cell-text').allInnerTexts();
    out.checkboxes = await tab.locator('.ant-checkbox-wrapper').filter({ hasText: /\S/ }).allInnerTexts();
    out.placeholder = await tab.locator('input[placeholder]').first().getAttribute('placeholder');
    // [E0] 열면 조회 → 첫 행 선택
    out.rows = await countRows(grid);
    out.paging = await paging();
    out.firstSelected = (await grid.locator('.ag-row[row-index="0"].ag-row-selected').count()) > 0;
    if (OUT) await p.screenshot({ path: `${OUT}/C03-open.png` });

    // 페이징: 다음 페이지
    await tab.locator('button:has(.anticon-right)').first().click(); await wait(1500);
    out.paging2 = await paging();
    out.rows2 = await countRows(grid);

    // [E1] 검색어 Enter → 1페이지부터
    const search = tab.locator('input[placeholder^="고객사명"]');
    await search.fill('한국펀드'); await search.press('Enter'); await wait(1500);
    out.pagingSearch = await paging();
    // 제안 ① 부서명 검색: '전체 N' = 목록 행 수 / 제안 ② 빈 사무실 칸 더블클릭 → 'null' 글자가 아님
    await search.fill('경영관리'); await search.press('Enter'); await wait(1500);
    out.pagingDept = await paging();
    out.rowsDept = await countRows(grid);
    await grid.locator('.ag-row[row-index="0"] .ag-cell[col-id="officeTelNo"]').dblclick(); await wait(300);
    out.copyEmpty = await msgs();
    await wait(1200);
    await search.fill('');

    // [E2] 고객사 트리거 → 고객찾기 → 더블클릭 선택 → [E3] 조회
    const company = tab.locator('input[readonly]').first();
    await company.click(); await wait(1500);
    const modal = p.locator('.ant-modal').filter({ has: p.locator('.ant-modal-title', { hasText: '고객찾기' }) });
    out.lookupHeaders = await modal.locator('.ag-header-cell-text').allInnerTexts();
    out.lookupButtons = await modal.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    await modal.locator('input:not([type=checkbox])').first().fill('kfstest');
    await modal.locator('input:not([type=checkbox])').first().press('Enter'); await wait(1000);
    out.lookupRows = await countRows(modal);
    await modal.getByRole('button', { name: '확인' }).click(); await wait(500);
    out.lookupNoSelectMsg = await msgs();
    await modal.locator('.ag-row[row-index="0"] .ag-cell[col-id="companyNm"]').dblclick(); await wait(800);
    out.companyField = await company.inputValue();
    await tab.getByRole('button', { name: '조회' }).click(); await wait(1500);
    out.pagingCompany = await paging();
    // 선택안함 → '전체'
    await company.click(); await wait(1200);
    await modal.getByRole('button', { name: '선택안함' }).click(); await wait(500);
    out.companyAfterNone = await company.inputValue();
    // 취소 → 그대로
    await company.click(); await wait(1200);
    await modal.getByRole('button', { name: '취소' }).click(); await wait(500);
    out.companyAfterCancel = await company.inputValue();
    await tab.getByRole('button', { name: '조회' }).click(); await wait(1500);
    out.pagingAll = await paging();

    // [E4] 더블클릭 복사
    await grid.locator('.ag-row[row-index="0"] .ag-cell[col-id="korName"]').dblclick(); await wait(300);
    out.copyKorName = await msgs();
    await wait(1200);
    await grid.locator('.ag-row[row-index="0"] .ag-cell[col-id="hireDate"]').dblclick(); await wait(300);
    out.copyHireDate = await msgs();

    // actionCell Edit → 체크내용 팝업 → 저장(같은 값)
    await wait(1000);
    await grid.locator('.ag-body-horizontal-scroll-viewport').evaluate(el => { el.scrollLeft = el.scrollWidth; }); await wait(500);
    const noteBefore = await grid.locator('.ag-row[row-index="0"] .ag-cell[col-id="noteAdmin"]').innerText();
    out.noteBefore = noteBefore;
    // 맨 오른쪽 칸은 컬럼 가상화로 안 그려져 있다 → 가로 스크롤
    await grid.locator('.ag-body-horizontal-scroll-viewport').evaluate(el => { el.scrollLeft = el.scrollWidth; }); await wait(500);
    await grid.locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCell"] .anticon-edit').click(); await wait(1200);
    const note = p.locator('.ant-modal').filter({ has: p.locator('.ant-modal-title', { hasText: '체크내용' }) });
    out.noteOpen = await note.isVisible();
    out.noteButtons = await note.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.noteValue = await note.locator('textarea').inputValue();
    if (noteBefore === '' && out.noteValue === '') {
      await note.getByRole('button', { name: '저장' }).click(); await wait(1200);
      out.noteSaved = !(await note.isVisible());
    } else {
      await note.getByRole('button', { name: '닫기' }).click(); await wait(500);
      out.noteSaved = 'skip(비고 있음)';
    }
    out.noteAfter = await grid.locator('.ag-row[row-index="0"] .ag-cell[col-id="noteAdmin"]').innerText();

    // 그리드 기본 점검(06 7-1). 체크박스 열은 제안 ③으로 뺐다(SingleGrid) → 두 번째 행 클릭으로 선택이 옮겨지는지 본다
    await grid.locator('.ag-body-horizontal-scroll-viewport').evaluate(el => { el.scrollLeft = 0; }); await wait(300);
    out.checkboxCol = await grid.locator('.ag-selection-checkbox').count();
    await grid.locator('.ag-row[row-index="1"] .ag-cell[col-id="empNo"]').click(); await wait(300);
    out.clickSelects = (await grid.locator('.ag-row[row-index="1"].ag-row-selected').count()) > 0
      && (await grid.locator('.ag-row.ag-row-selected').count()) === 1;
    out.grid = await checkGrid(p, tab);
    out.gridOk = gridOk(out.grid);
    if (OUT) await p.screenshot({ path: `${OUT}/C03-end.png` });
  } catch (e) {
    out.error = e.message.split('\n')[0];
    if (OUT) await p.screenshot({ path: `${OUT}/C03-error.png` }).catch(() => {});
  } finally {
    console.log(JSON.stringify(out, null, 1));
    await b.close();
  }
})();
