# CAR-BZ-0005 경영관리팀이 운행일지를 마감하고 결재(A16)받는다

> **한 줄 요약** — 경영관리팀이 #1193 차량 운행일지에서 차량·기준월을 고르면 그 달 일지와 주행 전·후 계기판(초기 주행거리부터 누적)이 나온다. **[마감]**하면 계기판 값을 저장하고(이전 달이 안 마감됐으면 거절), **[상신]**하면 연결 행(`car05_relate_appr`)과 운행일지 PDF를 만들어 **A16** 결재문서로 올린다. [마감취소]는 다음 달이 마감됐으면 거절. [출력]은 RD.

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(301) → 결재자(201) |
| 언제 | 매월 말 |
| 먼저 있어야 하는 것 | 0003·0004, **A16 문서분류 지정**(kalpa·회사 0 모두 비어 있었음) |
| 다음 이벤트 | — |
| 실제 실행 | 2026-11-14, kalpa API. 2026.11 전용 그랜저 2행(전 3,000→3,060→3,120) — AS-IS `car04_journal.selectByJournal` 2 = 2. kalpa A16 → `총무/업무용차량/차량운행일지`(회사 관리자 `PUT /dcr/links`). [마감] 2건 → `POST /car/journals/relate-appr` `car05` +1 → `yunhee biz-appr A16` 상신 `202611149151649` → 연결 → 201 승인 30 → `GET /car/journals/appr-status` 완료. **사원 401이 결재 완료된 달의 마감취소 → 200**(⚠#263) → 301이 다시 마감 |
| 메뉴 | #1193 경영관리 > 10. 차량관리 > 차량 운행일지. 화면 눈 확인 `대기(일괄)`, PDF·RD 확인 대기 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1193 | 차량·기준월 → [조회] (`GET /car/journals/month`) · 결재 상태 (`GET /appr-status`) | 일지·계기판 |
| 2 | 〃 | 〃 | [마감] (`PUT /car/journals/close {closeYn:true}`) | 마감 |
| 3 | 〃 | 〃 | [상신] (`POST /car/journals/relate-appr` → 결재문서 창 A16 → 상신 → `PUT /relate-appr/{id}/appr-id`) | 결재 상태 |
| 4 | 결재자 | 결재문서 창 | [승인] | 완료 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `car04_journal` | 마감·계기판 | 2행 갱신 |
| `car05_relate_appr` · `apr01_appr` | 결재 연결 · A16 문서 | +1 · +1(완료) |
| `dcr30_link` | kalpa A16 문서분류 | 1행(남김) |

## 업무 규칙 · 주의

- **마감·마감취소 API를 사원도 부르고, 결재 완료 여부를 안 본다** → [#263](../../보안_및_버그_의심.md).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: CAR-BZ-0005
company: kalpa
user: 301
pre: [CAR-BZ-0004, "A16 문서분류 지정"]
steps:
  - {no: 1, api: GET /api/v1/car/journals/month?infoId={전용}&stdMonth=2026.11, expect: rows 2}
  - {no: 2, api: PUT /api/v1/car/journals/close, body: {infoId: "{전용}", stdMonth: "2026.11", closeYn: true}, expect: data 2}
  - {no: 3, api: POST /api/v1/car/journals/relate-appr, body: {infoId: "{전용}", stdMonth: "2026.11"}, expect: "car05 +1"}
  - {no: 4, tool: "yunhee biz-appr A16 --ref {relateApprId} --link-path /api/v1/car/journals/relate-appr/{relateApprId}/appr-id --link-body '{\"apprId\":{apprId}}' -u 301 -c kalpa --approver 201 --confirm", expect: "30"}
```
</details>

<details><summary>근거</summary>

- AS-IS: `Car04_Tab_Journal`(E8 상신 `insertApprCheck` L602-650, `updateCheck` 마감).
- TOBE: `CarJournalService.closeJournal` L192-207·`relateAppr` L182, `CarJournalApprController` L34-37, 화면 `pages/car/Car04_Tab_Journal.tsx`(A16).
</details>
