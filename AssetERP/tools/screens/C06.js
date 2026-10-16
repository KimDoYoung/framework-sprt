// C06 고객별 문자발송(Sms03_Tab_SendAdmin + Sms03_Edit_GroupSend + Sms03_Page_UserListAdmin + Sms04_Lookup_History + Sys85_Lookup_ClientInfoList) 화면 확인.
// **실제 문자는 보내지 않는다**(사용자 지시) — 서버 SmsSender 기본 구현이 거절하는 것까지만 확인하고, 발송 대상은 기존 데이터의 사원 1명만 쓴다.
// 시험 행(단체문자 'C06화면시험')은 등록 → 저장 → 삭제로 지운다(남으면 결과 JSON의 leftTest로 알 수 있다 — yunhee api DELETE로 지운다).
// admin 회사 메뉴라 admin 테넌트 admin으로 확인한다.
// 사용: yunhee run "bash -c 'NODE_PATH=<playwright-core 폴더의 상위 node_modules> node tools/screens/C06.js <스크린샷 폴더>'"
const { BASE, launch, checkGrid } = require('./_common');
const [OUT] = process.argv.slice(2);

(async () => {
  const { b, p, errs } = await launch();
  const out = { errs, msgs: [] };
  const countRows = loc => loc.evaluate(el => new Set([...el.querySelectorAll('.ag-row[row-index]')].map(r => r.getAttribute('row-index'))).size);
  const msg = async () => { await p.waitForTimeout(700); out.msgs.push((await p.locator('.ant-message-notice').allInnerTexts()).join('|')); };
  try {
    await p.goto(BASE, { waitUntil: 'networkidle' });
    await p.fill('input[placeholder^="사번"]', 'admin'); await p.fill('input[type=password]', '1111');
    await p.click('button[type=submit]'); await p.waitForTimeout(2500);
    await p.getByText('관리자', { exact: true }).first().click(); await p.waitForTimeout(600);
    await p.getByText('고객별 문자발송', { exact: true }).first().click(); await p.waitForTimeout(3000);

    const grids = p.locator('.ag-root-wrapper:visible');
    out.gridCount = await grids.count();
    const gG = grids.nth(0), gP = grids.nth(1), gT = grids.nth(2);
    out.groupHeaders = await gG.locator('.ag-header-cell-text').allInnerTexts();
    out.personHeaders = await gP.locator('.ag-header-cell-text').allInnerTexts();
    out.targetHeaders = await gT.locator('.ag-header-cell-text').allInnerTexts();
    out.groupRows = await countRows(gG);
    out.firstGroup = await gG.locator('.ag-row[row-index="0"]').first().innerText();
    out.groupSelected = await gG.locator('.ag-row-selected').count();
    out.personRows = await countRows(gP);
    out.personSelected = await gP.locator('.ag-row-selected').count();
    const titleIn = p.locator('label:has-text("제목")').locator('xpath=following-sibling::input').first();
    const noteIn = p.locator('label:has-text("비고")').locator('xpath=following-sibling::input').first();
    const contentTa = p.locator('textarea:visible').first();
    const form = async () => ({ title: await titleIn.inputValue(), content: await contentTa.inputValue(), note: await noteIn.inputValue() });
    out.formValues = await form();
    out.buttons = await p.locator('button:visible').filter({ hasText: /\S/ }).allInnerTexts();
    const pagingText = async () => p.getByText(/^전체\s*[\d,]+\s*중/).first().innerText().catch(() => null);
    out.paging = await pagingText();
    out.comboValue = await p.locator('.ant-select-selection-item').first().innerText();
    out.leftGrid = await checkGrid(p, p.locator('body'));
    await p.screenshot({ path: `${OUT}/C06-1-main.png` });

    // 고객사 콤보 → 전체 (조회)
    await p.locator('.ant-select:visible').filter({ hasText: '한국펀드서비스' }).first().click(); await p.waitForTimeout(400);
    await p.locator('.ant-select-item-option:visible').filter({ hasText: /^전체$/ }).first().click(); await p.waitForTimeout(1500);
    out.pagingAll = await pagingText();

    // 대상 추가: 사원 그리드 첫 행의 추가 아이콘 → 대상 그리드 1행, 같은 행을 또 추가 → 경고
    await gP.locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCell"] button').first().click(); await p.waitForTimeout(400);
    out.targetRowsAfterAdd = await countRows(gT);
    await gP.locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCell"] button').first().click(); await msg();
    out.targetRowsAfterDup = await countRows(gT);

    // 발송 → 확인창 → 예 → 서버가 보내지 않았다고 알림(실제 발송 없음)
    await p.getByRole('button', { name: '발 송' }).or(p.getByRole('button', { name: '발송' })).first().click(); await p.waitForTimeout(500);
    out.sendConfirm = await p.locator('.ant-modal-confirm-content').innerText();
    await p.locator('.ant-modal-confirm-btns button').filter({ hasText: /예/ }).click(); await msg();

    // 대상 그리드 삭제 아이콘
    await gT.locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCell"] button').first().click(); await p.waitForTimeout(400);
    out.targetRowsAfterDelete = await countRows(gT);

    // 기타고객사 추가 → 조회창 열기 → 선택 없이 확인 → 경고 → 닫기
    await p.getByRole('button', { name: /기타고객사 추가/ }).click(); await p.waitForTimeout(1500);
    const cdlg = p.locator('.ant-modal').filter({ hasText: '고객사 정보' });
    out.clientTitle = await cdlg.locator('.ant-modal-title').innerText();
    out.clientButtons = await cdlg.locator('button').filter({ hasText: /\S/ }).allInnerTexts();
    out.clientHeaders = await cdlg.locator('.ag-header-cell-text').allInnerTexts();
    out.clientRows = await countRows(cdlg);
    await cdlg.getByRole('button', { name: '확 인' }).or(cdlg.getByRole('button', { name: '확인' })).first().click(); await msg();
    await p.screenshot({ path: `${OUT}/C06-2-client.png` });
    await cdlg.getByRole('button', { name: '닫 기' }).or(cdlg.getByRole('button', { name: '닫기' })).first().click(); await p.waitForTimeout(500);

    // 전송기록 아이콘
    await gG.locator('.ag-row[row-index="0"] .ag-cell[col-id="actionCell"] button').first().click(); await p.waitForTimeout(1500);
    const hdlg = p.locator('.ant-modal').filter({ hasText: '전송기록' });
    out.historyHeaders = await hdlg.locator('.ag-header-cell-text').allInnerTexts();
    out.historyRows = await countRows(hdlg);
    await p.screenshot({ path: `${OUT}/C06-3-history.png` });
    await hdlg.getByRole('button', { name: '닫 기' }).or(hdlg.getByRole('button', { name: '닫기' })).first().click(); await p.waitForTimeout(500);

    // 등록 → 빈 폼 → 필수 검사 → 저장 → 삭제
    await p.getByRole('button', { name: '등 록' }).or(p.getByRole('button', { name: '등록' })).first().click(); await p.waitForTimeout(1000);
    out.groupRowsAfterInsert = await countRows(gG);
    out.formAfterInsert = await form();
    await p.getByRole('button', { name: '저 장' }).or(p.getByRole('button', { name: '저장' })).first().click(); await msg();   // 제목 필수
    await titleIn.fill('C06화면시험');
    await p.getByRole('button', { name: '저 장' }).or(p.getByRole('button', { name: '저장' })).first().click(); await msg();   // 내용 필수
    await contentTa.fill('시험 내용 — 발송하지 않음');
    await p.getByRole('button', { name: '저 장' }).or(p.getByRole('button', { name: '저장' })).first().click(); await p.waitForTimeout(1500);
    out.groupRowsAfterSave = await countRows(gG);
    out.savedRow = await gG.locator('.ag-row-selected').first().innerText().catch(() => null);
    await p.screenshot({ path: `${OUT}/C06-4-saved.png` });
    await p.getByRole('button', { name: '삭 제' }).or(p.getByRole('button', { name: '삭제' })).first().click(); await p.waitForTimeout(500);
    out.deleteConfirm = await p.locator('.ant-modal-confirm-content').innerText();
    await p.locator('.ant-modal-confirm-btns button').filter({ hasText: /예/ }).click(); await p.waitForTimeout(1200);
    out.groupRowsAfterDelete = await countRows(gG);
    out.leftTest = await gG.locator('.ag-row').filter({ hasText: 'C06화면시험' }).count();
  } catch (e) {
    out.fail = String(e).slice(0, 500);
    await p.screenshot({ path: `${OUT}/C06-fail.png` }).catch(() => {});
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
