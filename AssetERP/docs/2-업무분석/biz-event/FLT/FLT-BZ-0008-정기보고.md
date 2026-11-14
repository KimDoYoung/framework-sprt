# FLT-BZ-0008 직원이 정기보고(실거래 보고, A09)를 올린다

> **한 줄 요약** — 직원은 보고주기(분기·월)마다 #1142 임직원매매 정기보고에서 그 기간의 **실제 체결 내역**(매매구분·계좌·체결일·종목·수량·금액)을 등록하고(`flt10_tr` 실거래, 사전신고 행과 같은 테이블), [보유원장 정리]로 보유원장을 다시 만들고(`insertFloorTrBook`), 필요하면 [상장주식 평가처리]를 한 뒤 [정기보고서 작성]으로 **개인별 매매 및 보유내역 신고서**(링크코드 A09)를 결재받는다(`flt14_relate_appr`). 준법감시인은 #1152 정기보고현황에서 기준일의 직원별 서약·보고주기·보고 상태를 본다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(kalpa 사원 401) → 결재자(301) · 준법감시인(#1152) |
| 언제 | 분기·월 마감 뒤(회사 기준 보고 시작일부터) |
| 먼저 있어야 하는 것 | FLT-BZ-0005 초기보유(실거래는 **최초원장 기준일 다음 날부터**만 등록됨), 0006·0007 사전신고, **A09 문서분류**(0003에서 지정) |
| 다음 이벤트 | FLT-BZ-0011 매매·보유내역, 0012 위반내역, 0013 책임자보고 |
| 실제 실행 | kalpa, 2026-11-14(토), API. ① 11-13 실거래를 넣으려니 "최초원장 기준일 이전의 거래내역은 등록할 수 없습니다"(초기보유 기준일이 11-13) → **초기보유를 지우고 기준일 2026-10-30으로 다시 등록**(보유원장 +22 — 10-30~11-13 영업일마다 2종목). ② 401 `PUT /flt/real-trs` 11-13 매수 SK하이닉스 10주 2,050,000 · 매도 카카오 30주 1,290,000 → `flt10_tr` +2. ③ [보유원장 정리] `POST /flt/real-trs/book?startDate=2026-11-13` → 11-13 보유: SK하이닉스 10 · 삼성전자 100 · 카카오 20(860,000). ④ `GET …/report-check?stdDate=2026-12-31` → ok. ⑤ `biz-appr A09 --seed-arg ids=…,closeDate=2026-12-31,periodString=… --link-path /api/v1/flt/real-trs/appr-id --confirm` → 결재 `202611149150219` 완료, `flt14` stdDate 12-31·분기(제목의 "2026년 2026년 4분기"는 내가 `periodString`을 "2026년 4분기"로 준 탓 — 화면은 "4분기"). ⑥ #1152 `GET /flt/trs/emp-apprs?stdDate=2026-12-31` 7행(401 "서명완료·분기별·완료", 나머지 "대상아님(계좌없음)"), AS-IS 7 = 7. ⑦ **보고 완료된 실거래 수량을 바꿔도 결재가 그대로(⚠#226)** → 되돌림 |
| 메뉴 | #1142 준법감시 > 10. 임직원매매 > 임직원매매 정기보고, #1152 11. 임직원매매(준감인) > 임직원매매 정기보고현황. kalpa 메뉴 없음. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1142 | 연도·분기(월) → [조회] (`GET /flt/real-trs?startDate&closeDate&preTrYn`, 한도 `/emp-limit`) | 기간 매매내역(사전신고 포함 체크 시 신고 행도) |
| 2 | 〃 | 〃 | [등록] → 매매구분·계좌·체결일·종목유형·종목·수량·금액 → [저장] (`PUT /flt/real-trs`) | "계좌개설일보다 빠를 수 없습니다"·"영업일이 아닙니다…"·기간 밖 검사. 저장 뒤 원장 정리 자동 |
| 3 | 〃 | 〃 | [사전신고 미체결 지정] / [엑셀업로드] / [보유원장 정리] (`POST /flt/real-trs/book`) | 원장 다시 만들기 |
| 4 | 〃 | 〃 | [상장주식 평가처리]·[평가금액을 취득금액으로 저장] | 보유 상장주식 평가(이번엔 안 함) |
| 5 | 〃 | 〃 | 매매내역 체크 → [정기보고서 작성] (`GET /flt/real-trs/report-check`) → 결재문서(A09) → 연결 `PUT /flt/real-trs/appr-id {apprId, ids, stdDate=기간 끝, checkCycle}` | "선택된 매매내역이 없습니다. 매매내역 없이 진행하시겠습니까?"(매매 없어도 보고) |
| 6 | 결재자 | 결재문서 창 | [승인] | 보고 완료 |
| 7 | 준감인 | #1152 | 기준일 → [조회] (`GET /flt/trs/emp-apprs`) → 사원 행 → 문서 목록(`…/emp-apprs/docs`) | 직원별 서약·주기·보고 상태 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `flt13_book_init`·`flt11_book` | 401 초기보유를 10-30 기준으로 다시(삭제 −2 → +2), 원장 10-30~11-13 | 남겨 둠 |
| `flt10_tr` | 11-13 실거래 2건(매수 SK하이닉스 10 · 매도 카카오 30, 결재 연결) | +2 |
| `flt14_relate_appr`·`apr01_appr` | A09 정기보고(2026 4분기, 완료) | +1 |

## 업무 규칙 · 주의

- 실거래는 최초원장 기준일 **다음 날부터**만 등록된다. 초기보유를 늦게 잡으면 그 사이 매매를 보고할 수 없다.
- 보유원장은 영업일마다 만들어지고, 실거래 저장 뒤 원장 정리로 반영된다(화면은 저장 뒤 자동, API만 부르면 따로 불러야 함).
- 보고 완료된 매매내역을 고치면 원본 화면은 기존 문서를 폐기하고 재상신하게 한다 — 서버는 막지 않는다 → [의심 #226](../../보안_및_버그_의심.md).
- 이번 실거래 11-13은 사전신고(11-14 신청·승인)보다 **먼저** 체결된 것이라 0012 위반내역에서 "사전승인 전 매매"로 보이는지 확인한다.

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: FLT-BZ-0008
needs: [FLT-BZ-0005, FLT-BZ-0006, FLT-BZ-0007]
steps:
  - no: 1
    actor: { company: kalpa, user: "401", password: "1111" }
    api: PUT /api/v1/flt/real-trs
    body: [ { trId: null, trType: "10I", accountId: "{401 주계좌}", trDate: "{초기보유 기준일 다음 영업일}", trItemType: "10", trItemName: "SK하이닉스", trItemCode: "000660", trQty: 10, trAmt: 2050000 } ]
    expect: { track: { flt10_tr: +1 } }
  - no: 2
    api: POST /api/v1/flt/real-trs/book?startDate={체결일}
  - no: 3
    tool: yunhee biz-appr A09 --ref {trId} -u 401 -c kalpa --approver 301 --seed-arg ids={trId} --seed-arg closeDate=2026-12-31 --seed-arg periodString=4분기 --link-path /api/v1/flt/real-trs/appr-id --link-style body --link-body '{"apprId": {apprId}, "ids": [{trId}], "stdDate": "2026-12-31", "checkCycle": "1"}' --confirm
    expect: { relateAppr: { apprStatusCode: "30" } }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Flt10_Tab_RealTransaction`(#1142 E0~E42: checkTrDate(계좌개설일·영업일·기간), updateCheck10 L131(완료 문서 폐기 확인), update10 L1581-1615(`deleteApprList` → `insertFloorTrBook`), open L1967-2079(A09), updateApprId L2136-2166), `Flt10_Tab_EmpAppr`(#1152 `flt10_tr.selectEmpAppr`), `Flt10_Grid_EmpAppr`.
- TOBE: `FltRealTrController`(`/api/v1/flt/real-trs`·`/book`·`/report-check`·`/appr-id`·`/apprs`·`/relate-apprs`), `FltTrController` `GET /api/v1/flt/trs/emp-apprs`, 프론트 `Flt10_Tab_RealTransaction.tsx` L168(periodString)·L282-308·L570-637.
</details>
