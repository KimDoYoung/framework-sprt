# CAR-BZ-0003 직원이 공용차량 운행을 등록·확정한다

> **한 줄 요약** — 예약한 직원이 #1190 공용차량 운행등록에서 차량·기준월(`YYYY.MM`)을 고르면 내 예약이 운행 행으로 나온다(일지가 없으면 가상 행). 행을 열어 주행거리(출퇴근·업무·비업무)·행선지·목적을 [저장]하면 예약 ID로 일지가 생기고(`car04_journal`), [확정]하면 그 달 내 행이 확정된다. 경영관리는 #1192에서 회사 전체 공용차 일지를 보고 고치고 확정한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 예약한 직원 → 경영관리 |
| 언제 | 운행 뒤 |
| 먼저 있어야 하는 것 | 0002 예약 |
| 다음 이벤트 | 0005 마감 |
| 실제 실행 | 2026-11-14, kalpa API. 401 2026.11 공용 쏘나타 → 11-13 예약 행(가상 `journalId` 1) → 42km(업무 42) 저장 `car04` +1 → [확정] 1건. AS-IS `car04_journal.selectByPublicJournal` 1 = 1, 경영관리 `selectByPublicJournalAdmin` 1 = 1 |
| 메뉴 | #1190 (공용차량 운행등록)·#1192 (운행변경, 경영관리팀). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1190 | 차량·기준월 → [조회] (`GET /car/journals/public?infoId=&stdMonth=2026.11`) | 내 예약별 행 |
| 2 | 〃 | 일지 창 | 주행거리·행선지·목적 → [저장] (`PUT /car/journals {…, bookingId}`) | 일지 |
| 3 | 〃 | #1190 | [확정] (`PUT /car/journals/public-fix {fixYn:true}`) | 확정 |
| 4 | 경영관리 | #1192 | [조회] (`GET /car/journals/public-admin`) · 고침 · [확정] (`PUT /public-admin-fix`) | 회사 전체 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `car04_journal` | 공용차 운행일지(예약 ID·확정) | +1 |

## 업무 규칙 · 주의

- 업무 주행이 있으면 행선지·목적 필수, 주행거리 0은 거절.
- 마감된 행이 있으면 확정·확정취소를 거절.

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: CAR-BZ-0003
company: kalpa
user: 401
pre: [CAR-BZ-0002]
steps:
  - {no: 1, api: GET /api/v1/car/journals/public?infoId={공용}&stdMonth=2026.11, expect: "rows 1, journalId 1"}
  - {no: 2, api: PUT /api/v1/car/journals, body: {infoId: "{공용}", date: 2026-11-13, personId: 401, mileage: 42, bizMileage: 42, destination: "(주)A사 본사", reason: 계약 미팅, bookingId: "{예약}"}, expect: "car04 +1"}
  - {no: 3, api: PUT /api/v1/car/journals/public-fix, body: {infoId: "{공용}", stdMonth: "2026.11", fixYn: true}, expect: data 1}
```
</details>

<details><summary>근거</summary>

- AS-IS: `Car04_Tab_PublicJournal`·`Car04_Lookup_PublicJournal`·`Car04_Tab_PublicJournalAdmin`.
- TOBE: `CarJournalService.searchPublic` L127·`fixPublic` L141·`applyPublicFix` L162-174.
</details>
