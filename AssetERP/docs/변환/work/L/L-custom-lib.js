// L 도메인 일괄 화면시험 공용 훅 — 데이터가 있는 기간·기준년월로 [조회]하고 행 수를 본다 (gen.js의 custom 훅)
// make({ dates: ['시작일','끝일'(선택)], ym: 'yyyy.MM', rows: true|false })
//   dates: 화면의 날짜 칸(.ant-picker) 앞에서부터 채운다. ym: placeholder가 YYYY.MM인 입력칸. rows=true면 조회 행 수 > 0을 기대한다(데이터가 없는 계정이면 false)
exports.make = opts => async ({ p, h, scr, grid, out, expect }) => {
  const root = scr();
  for (let i = 0; i < (opts.dates || []).length; i++) {
    const inp = root.locator('.ant-picker input').nth(i);
    await inp.click(); await inp.fill(opts.dates[i]); await p.keyboard.press('Enter'); await h.wait(300);
  }
  if (opts.ym) { const inp = root.locator('input[placeholder="YYYY.MM"]').first(); await inp.fill(opts.ym); await inp.press('Tab'); await h.wait(800); }
  await h.retrieve(); await h.wait(1500);
  out.rowsAfterRetrieve = await h.rows(grid);
  expect('조회 행 수' + (opts.rows ? '>0' : '(데이터 없어도 오류 없이 조회)'), out.rowsAfterRetrieve, opts.rows ? (n => n > 0) : (n => n >= 0));
};
