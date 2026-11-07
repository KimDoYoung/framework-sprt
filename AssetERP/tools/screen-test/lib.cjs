// tools/screen-test 공용: 브라우저(Playwright + 시스템 Chrome) 띄우기, 로그인, 화면 열기.
// frontend/package.json 은 건드리지 않는다 — frontend/node_modules 의 playwright-core 를 빌려 쓴다.
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");               // AssetERP
const FRONT = path.join(ROOT, "frontend");

exports.ROOT = ROOT;

exports.playwright = () => {
  const p = path.join(FRONT, "node_modules/playwright-core");
  if (!fs.existsSync(p)) throw new Error("frontend/node_modules/playwright-core 가 없습니다 — frontend 에서 npm install");
  return require(p);
};

const CHROMES = [process.env.CHROME_PATH, "/usr/bin/google-chrome-stable", "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"].filter(Boolean);
exports.launch = () => {
  const exe = CHROMES.find((c) => fs.existsSync(c));
  if (!exe) throw new Error("Chrome 을 찾지 못했습니다. CHROME_PATH 환경변수로 경로를 주세요.");
  return exports.playwright().chromium.launch({ executablePath: exe, headless: true });
};

/** 회사코드가 서브도메인이다(백엔드가 X-Forwarded-Host 로 테넌트를 판별). 5173 = Vite 개발 서버 */
exports.baseUrl = (company, override) => (override || `http://${company}.localhost:5173`).replace(/\/$/, "");

const SEARCH = 'input[placeholder*="화면번호"]';

/** 새 탭을 열 때마다 겸직 선택 창("로그인 선택")이 뜰 수 있다 — 본업무 행을 고르고 확인하면 화면번호 검색칸이 나타난다 */
exports.pass = async (page, timeout = 20000) => {
  await page.locator(SEARCH).or(page.getByText("로그인 선택")).first().waitFor({ timeout });
  if (await page.getByText("로그인 선택").count()) {
    await page.waitForTimeout(800);
    const sel = page.locator(".ag-row .ag-selection-checkbox").first();
    const bb = await sel.boundingBox().catch(() => null);
    if (bb) await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
    else await page.mouse.click(547, 205);                      // 창 모양이 바뀌었을 때를 위한 마지막 수단
    await page.getByRole("button", { name: /확\s*인/ }).first().click();
  }
  await page.locator(SEARCH).waitFor({ timeout });
};

/** 로그인해 쿠키를 가진 컨텍스트를 돌려준다. 실패하면 사유와 함께 던진다 */
exports.login = async (browser, base, user, password) => {
  const ctx = await browser.newContext({ viewport: { width: 1700, height: 950 } });
  const p = await ctx.newPage();
  await p.goto(base + "/", { waitUntil: "domcontentloaded" });
  await p.fill('input[placeholder="로그인 ID"]', user);
  await p.fill('input[placeholder="비밀번호"]', password);
  await p.click("button[type=submit]");
  try {
    await exports.pass(p, 20000);
  } catch {
    const msg = (await p.locator(".ant-form-item-explain-error, .ant-message-notice").allInnerTexts().catch(() => [])).join(" ").trim();
    throw new Error("로그인 실패" + (msg ? `: ${msg}` : " (회사·ID·비밀번호, 또는 서버가 떠 있는지 확인)"));
  }
  return { ctx, page: p };
};

/** 로그인 사용자가 볼 수 있는 메뉴(화면번호·클래스·이름) 목록 */
exports.menus = async (page) => {
  const json = await page.evaluate(() => fetch("api/v1/sys/menus", { credentials: "include" }).then((r) => r.json()));
  const out = []; const seen = new Set();
  const walk = (n) => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (n && typeof n === "object") {
      if (n.menuNo && n.classNm && !seen.has(String(n.menuNo))) { seen.add(String(n.menuNo)); out.push({ no: String(n.menuNo), cls: n.classNm, title: n.title || "" }); }
      Object.values(n).forEach((v) => typeof v === "object" && walk(v));
    }
  };
  walk(json);
  return out;
};

/** 화면번호 검색칸에 번호를 넣고 Enter — 그 화면이 탭으로 열린다 */
exports.openMenu = async (page, no) => {
  const box = page.locator(SEARCH);
  await box.fill(String(no));
  await box.press("Enter");
};
