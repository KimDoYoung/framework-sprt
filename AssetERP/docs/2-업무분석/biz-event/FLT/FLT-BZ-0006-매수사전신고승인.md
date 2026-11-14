# FLT-BZ-0006 직원이 매수를 사전신고하고 준법감시인이 승인한다

> **한 줄 요약** — 직원은 사기 전에 #1126 매수 사전신고에 계좌·예정매매일·종목유형·종목·예정수량·예정금액·사유를 등록하고(`flt10_tr`, 매매구분 `10I`) [승인신청](상태 10 미승인)한다. 화면 위쪽에 **투자한도표**(연간추가 투자한도·총누적 투자한도·회전율·일/월 매수 건수 기준과 현재 투자금액)가 나오고, 초과하면 "…투자금액을 초과하였습니다. 계속 진행하시겠습니까?"를 묻는다(막지는 않음 — 회사 기준 `투자금액 초과 매수제한`이 켜져 있을 때만 막힘). 준법감시인은 #1128 사전승인에서 [승인](20)·[반려](30, 사유)하고, 승인하면 회사 기준의 유효기간으로 매매유효일이 정해진다. 결재문서(전자결재)는 쓰지 않는다. 협의자(추가 확인자) 승인(25)은 #1513(TOBE 미변환).

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(kalpa 사원 401) → 준법감시인(kalpa는 과장 301) |
| 언제 | 매수 주문 전마다 |
| 먼저 있어야 하는 것 | FLT-BZ-0003 서약서 완료, FLT-BZ-0004 신고 계좌, FLT-BZ-0002 기준(투자한도·사전승인 유효기간), FLT-BZ-0002 [매수제한종목](있으면 막힘) |
| 다음 이벤트 | 매매 체결 뒤 FLT-BZ-0008 정기보고(실거래), 0007 매도 사전신고 |
| 실제 실행 | kalpa, 2026-11-14(토), API. `GET /flt/trs/check` → 대상자·분기별·서약서 30. `GET …/invest-limit` → 연간추가 3천만·총 1억·회전율 50%·월 30건·일 3건, 현재 투자금액 9,000,000(초기보유). `GET …/expect-date` → 2026-11-16(다음 영업일). ① 401 `PUT /flt/trs` SK하이닉스 `000660` 10주 2,000,000 → `flt10_tr` +1(`202611149150181`). ② 5억 원 신고도 저장됨(원본도 경고뿐) → 지움. ③ [승인신청] `PUT /flt/trs/status {statusCode:"10"}`. ④ #1128 `GET /flt/trs/approvals?trType=10I&apprYn=%&startDate=2026-11-01&closeDate=2026-11-30` 1행(AS-IS 1 = 1, 18열). ⑤ **신청자 401이 자기 신고를 승인**(20, 승인자 401 — ⚠#223) → 301이 다시 승인(승인자 301) |
| 메뉴 | #1126 준법감시 > 10. 임직원매매 > 매수 사전신고, #1128 11. 임직원매매(준감인) > 준법감시인 사전승인, #1513 협의자 사전승인(TOBE 미변환). kalpa 메뉴 없음. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1126 | 화면 열기 (`GET /flt/trs/check`·`/invest-limit`·`/accounts`·`/item-types`) | 서약서 안 됐으면 [보고주기 변경 및 서약서 서명], 위쪽 투자한도표, 계좌 목록 |
| 2 | 〃 | 〃 | 계좌 고르기 → [등록] → 예정매매일(`/expect-date`)·종목유형·종목(`/item-names`, 매수제한 `/buy-lockup`)·수량·금액·사유 → [저장] (`PUT /flt/trs`) | 한도 초과면 "연간 투자금액을 초과하였습니다…"/"총누적 투자금액을 초과하였습니다… 계속 진행하시겠습니까?" |
| 3 | 〃 | 〃 | 행 체크 → [승인신청] (`PUT /flt/trs/status 10`) / [신청취소] / [미체결]·[미체결취소] (`PUT /flt/trs/unfill`) | 상태 10 미승인 |
| 4 | 준감인 | #1128 | 기간·승인여부 → [조회] (`GET /flt/trs/approvals` 매수·매도 두 그리드) | 신청자·종목·수량·금액·한도 |
| 5 | 〃 | 〃 | 행 체크 → [승인] / [반려](사유 창) (`PUT /flt/trs/approvals/status 20·30`), [추가확인자] (`PUT …/add-confirmer`), 알림 (`POST …/send-message`) | 승인 20 · 반려 30 · 매매유효일 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `flt10_tr` | 401 매수 신고 SK하이닉스 10주(승인 20, 승인자 301) | +1 (남겨 둠 — 0008 정기보고용). 5억 시험 행 +1 → −1 |

## 업무 규칙 · 주의

- 투자한도 초과는 **경고 후 저장 허용**이 원본 동작이다(`Flt10_Tab_BuyReport.preUpdate` L86-110). 회사 기준 `투자금액 초과 매수제한 여부`를 켜면 막는다(이번엔 꺼진 상태).
- 사전승인 API에 권한 검사가 없어 신청자 본인이 승인할 수 있다 → [의심 #223](../../보안_및_버그_의심.md).
- 화면이 쓰는 대상자 정보는 보고주기·한도뿐 — [의심 #219](../../보안_및_버그_의심.md)(예외사원 보고 시작일)는 매수·매도와 무관해 "아님"으로 닫았다.
- 신고 계좌 목록(`GET /flt/trs/accounts?setupDate=2026-11-14`)에 **그날 폐쇄한 배우자 계좌도 나온다** — 폐쇄일 당일까지는 열린 것으로 보는 것으로 보인다(원본 SQL 비교는 안 함).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: FLT-BZ-0006
needs: [FLT-BZ-0004, FLT-BZ-0005]
steps:
  - no: 1
    actor: { company: kalpa, user: "401", password: "1111" }
    api: PUT /api/v1/flt/trs
    body: [ { trId: null, trType: "10I", accountId: "{401 주계좌}", regDate: "2026-11-14", expectTrDate: "2026-11-16", itemType: "10", itemName: "SK하이닉스", itemCode: "000660", expectTrQty: 10, expectTrAmt: 2000000, trReason: "장기투자" } ]
    expect: { track: { flt10_tr: +1 } }
  - no: 2
    api: PUT /api/v1/flt/trs/status
    body: { trIds: ["{trId}"], statusCode: "10" }
  - no: 3
    actor: { company: kalpa, user: "301", password: "1111" }
    api: PUT /api/v1/flt/trs/approvals/status
    body: { trIds: ["{trId}"], statusCode: "20", rejectReason: null }
    expect: { flt10_status_cd: "20", flt10_confirmer_id: "{301}" }
```
</details>

<details>
<summary>근거</summary>

- AS-IS: `Flt10_Tab_BuyReport`(#1126 E0~E25: preUpdate L86-110 한도 경고, fix → `updateStatusCode` 10), `Flt10_Tab_PreApprove`(#1128: retrieve → `flt10_tr.selectByCompanyId`, 승인·반려 → `Flt10_Tr.updateStatusCode` L447-468(`personId`는 요청 값, `getExpectTrDate2`로 매매유효일)), `Flt10_Lookup_RejectReasonWrite`.
- TOBE: `FltTrController`(`/api/v1/flt/trs`·`/status`·`/unfill`·`/check`·`/invest-limit`·`/expect-date`·`/accounts`·`/buy-lockup`), `FltPreApproveController`(`/api/v1/flt/trs/approvals`·`/status`·`/add-confirmer`·`/send-message`), 프론트 `Flt10_Tab_BuyReport.tsx` L35(`10I`)·L420, `Flt10_Tab_PreApprove.tsx` L126-140·L193.
</details>
