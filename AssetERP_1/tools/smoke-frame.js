// 배포본 화면 확인(06 항목 6·7 일부): 로그인 → MyPage → 1차 메뉴 → 3차 메뉴 탭, STOMP 연결, 콘솔 에러, 스크린샷 4장
// 준비: 저장소 밖 폴더에서 `npm i playwright-core@1.56` (브라우저는 ~/.cache/ms-playwright/chromium-1243 사용)
// 사용: NODE_PATH=<그 폴더>/node_modules node tools/smoke-frame.js <스크린샷 폴더> [base] [1차 메뉴] [3차 메뉴]
//   예) node tools/smoke-frame.js /tmp/shots http://admin.localhost:8082/AssetERP_1/ 관리자 '메뉴 관리'
// 로그인 전 세션 복원 시도에서 나는 401 두 건은 정상이다.
const { chromium } = require('playwright-core');
const [OUT, BASE = 'http://admin.localhost:8082/AssetERP_1/', L1 = '관리자', L3 = '메뉴 관리'] = process.argv.slice(2);

(async () => {
  const b = await chromium.launch({
    executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',
    args: ['--host-resolver-rules=MAP *.localhost 127.0.0.1'],
  });
  const p = await b.newPage({ viewport: { width: 1400, height: 850 } });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 150)); });
  const ws = [];
  p.on('websocket', w => {
    ws.push(w.url());
    w.on('framereceived', f => { if (String(f.payload).startsWith('CONNECTED')) ws.push('STOMP CONNECTED'); });
  });

  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.screenshot({ path: OUT + '/1-login.png' });
  await p.fill('input[placeholder^="사번"]', 'admin');
  await p.fill('input[type=password]', '1111');
  await p.click('button[type=submit]');
  await p.waitForTimeout(3000);
  await p.screenshot({ path: OUT + '/2-mypage.png' });
  await p.getByText(L1, { exact: true }).first().click();
  await p.waitForTimeout(1000);
  await p.screenshot({ path: OUT + '/3-menu.png' });
  await p.getByText(L3, { exact: true }).first().click({ timeout: 5000 }).catch(e => errs.push('menu click: ' + e.message.slice(0, 100)));
  await p.waitForTimeout(1500);
  const pending = await p.locator('text=아직 변환하지 않은 화면입니다.').count();
  await p.screenshot({ path: OUT + '/4-tab.png' });
  console.log(JSON.stringify({ pending, ws, errs }, null, 1));
  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
