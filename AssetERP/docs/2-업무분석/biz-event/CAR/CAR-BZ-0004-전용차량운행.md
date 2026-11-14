# CAR-BZ-0004 전용차량 사용자가 운행을 등록·확정한다

> **한 줄 요약** — 전용차 사용자가 #1189 전용차량 운행등록에서 내 차·기준월을 고르고 날마다 주행거리(출퇴근·업무·비업무)·행선지·목적을 [저장](`car04_journal`, 예약 없음)하거나 [일괄등록]으로 영업일마다 같은 내용을 넣은 뒤 [확정]한다. 경영관리는 #1191에서 고치고 일괄등록·확정한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 전용차 사용자(시험 김사장 100) → 경영관리 |
| 언제 | 매일·월말 |
| 먼저 있어야 하는 것 | 0001 전용차·사용자 |
| 다음 이벤트 | 0005 마감 |
| 실제 실행 | 2026-11-14, kalpa API. 100 11-12·13 각 60km(출퇴근 30·업무 30, `금융위원회`) `car04` +2 → [확정] 2건. **402(사용자 아님)가 확정된 11-12 일지를 999km·운전자 402로 고침 → 200**(⚠#262) → 100이 되돌림 |
| 메뉴 | #1189 (전용차량 운행등록)·#1191 (운행변경, 경영관리팀). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 사용자 | #1189 | 차량(`GET /car/infos/lookup`)·기준월 → [조회] (`GET /car/journals?infoId=&stdMonth=`) | 그 달 일지 |
| 2 | 〃 | 일지 창 | 날짜·주행거리·행선지·목적 → [저장] (`PUT /car/journals`) — 또는 [일괄등록] (`POST /car/journals/batch`) | 일지 |
| 3 | 〃 | #1189 | [확정] (`PUT /car/journals/fix {fixYn:true}`) | 확정 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `car04_journal` | 전용차 운행일지 | +2 |

## 업무 규칙 · 주의

- 확정된 달은 일괄등록 거절, 마감된 행이 있으면 확정취소 거절.
- **고칠 때 서버가 확정·마감·사용자를 안 본다** → [#262](../../보안_및_버그_의심.md).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: CAR-BZ-0004
company: kalpa
user: 100
pre: [CAR-BZ-0001]
steps:
  - {no: 1, api: PUT /api/v1/car/journals, body: {infoId: "{전용}", date: 2026-11-12, mileage: 60, commuteMileage: 30, bizMileage: 30, destination: 금융위원회, reason: 업무 협의}, expect: "car04 +1"}
  - {no: 2, api: PUT /api/v1/car/journals/fix, body: {infoId: "{전용}", stdMonth: "2026.11", fixYn: true}}
```
</details>

<details><summary>근거</summary>

- AS-IS: `Car04_Tab_PrivateJournal`·`Car04_Lookup_PrivateJournal.update` L444-471·`Car04_Lookup_Batch`, 서버 `Car04_Journal.modelUpdate` L148-159.
- TOBE: `CarJournalService.save` L66-84·`fix` L91-102·`batch` L109-124.
</details>
