// A15 Sys01_Tab_Company 화면 확인 (06 항목 6·7) — 1단계: 고객 목록 + 신규고객사 등록 팝업
// 실제 등록은 하지 않는다(회사 등록은 초기화로 15개 테이블에 행을 남긴다 → 사람이 직접 한다).
// 등록 경로는 "이미 있는 사업자번호"로 서버까지 보내 거절되는 것으로 확인한다 → 데이터가 바뀌지 않는다.
// 사용: NODE_PATH=<playwright-core 폴더>/node_modules node tools/screens/A15.js <스크린샷 폴더> [base] [중복 사업자번호]
// 이 메뉴(#1075)는 admin 회사 메뉴 → 회사 선택 없이 admin으로 로그인한다.
const { chromium } = require('playwright-core');
const [OUT, BASE = 'http://admin.localhost:8082/AssetERP_1/', DUP_BIZ_NO = '300-30-31234'] = process.argv.slice(2);

(async () => {
  const b = await chromium.launch({
    executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',
    args: ['--host-resolver-rules=MAP *.localhost 127.0.0.1'],
  });
  const p = await b.newPage({ viewport: { width: 1400, height: 850 } });
  const out = { errs: [], msgs: [] };
  p.on('pageerror', e => out.errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !m.text().includes('401') && !m.text().includes('409')) out.errs.push(m.text().slice(0, 150)); });
  const lastMsg = async () => (await p.locator('.ant-message-notice').allInnerTexts()).pop() ?? '';
  const rowCount = () => p.evaluate(() => new Set([...document.querySelectorAll('.ag-row[row-index]:not(.ag-row-pinned)')].map(r => r.getAttribute('row-index'))).size);
  const modal = () => p.locator('.ant-modal').filter({ hasText: '신규고객사 등록' });
  const field = label => modal().locator('.ant-space-compact', { hasText: label }).locator('input').first();

  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin');
    await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]');
    await p.waitForTimeout(2500);
    await p.getByText('관리자', { exact: true }).first().click();
    await p.waitForTimeout(800);
    await p.getByText('고객별 시스템정보 관리', { exact: true }).first().click();
    await p.waitForTimeout(2000);
    out.headers = (await p.locator('.ag-header-cell-text').allInnerTexts()).slice(0, 8);
    out.rowsUsed = await rowCount();
    await p.getByText('사용고객만 보기').click();
    await p.getByRole('button', { name: '조회' }).click();
    await p.waitForTimeout(1200);
    out.rowsAll = await rowCount();
    // 다시 조회한 뒤에도 행번호가 1부터 차례대로인지 (BaseGrid onRowDataUpdated)
    out.rowNums = await p.evaluate(() => [...document.querySelectorAll('.ag-row[row-index] [col-id="__rownum"]')]
      .map(c => [Number(c.closest('.ag-row').getAttribute('row-index')), c.textContent]).sort((a, b) => a[0] - b[0]).slice(0, 6).map(x => x[1]).join(','));
    await p.screenshot({ path: OUT + '/A15-1-list.png' });

    // [E3] 등록 → 팝업, 빈 값으로 [등록] → 첫 필수 메시지
    await p.getByRole('button', { name: '등록' }).first().click();
    await p.waitForTimeout(800);
    out.taxTypeDefault = await modal().locator('.ant-space-compact', { hasText: '과세구분' }).locator('.ant-select-selection-item').innerText().catch(() => '');
    await modal().getByRole('button', { name: '등록' }).click();
    await p.waitForTimeout(500);
    out.msgs.push('빈 값: ' + await lastMsg());

    // 모두 입력(사업자번호는 이미 있는 값) → 확인 → 예 → 서버 거절
    await field('고객사명').fill('ZZ_A15_화면시험');
    await field('서브도메인').fill('zza15screen');
    await field('회사암호').fill('1111');
    await field('설립일').fill('2025-01-01');
    await field('설립일').press('Enter');
    await field('사업자등록번호').fill(DUP_BIZ_NO);
    await modal().getByRole('button', { name: '등록' }).click();
    await p.waitForTimeout(500);
    out.confirm = await p.locator('.ant-modal-confirm-content').innerText().catch(() => '');
    await p.screenshot({ path: OUT + '/A15-2-confirm.png' });
    await p.getByRole('button', { name: '예' }).click();
    await p.waitForTimeout(1500);
    out.msgs.push('중복 사업자번호: ' + await lastMsg());
    out.popupStillOpen = await modal().isVisible();
    await p.screenshot({ path: OUT + '/A15-3-rejected.png' });
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
    await p.screenshot({ path: OUT + '/A15-9-last.png' }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
