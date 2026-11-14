# CAR-BZ-0002 직원이 공용차량을 예약한다

> **한 줄 요약** — 직원이 #1187 공용차량 예약관리에서 날짜를 고르고 [예약] → 차량·사용자(기본 = 나)·시작·종료 일시·행선지·목적·동승자를 [저장]한다(`car03_booking`). 여러 날이면 날마다 행이 생기고 첫 행이 부모다. 같은 차의 시간이 겹치면 "이미 등록된 예약 (09:00 ~ 12:00) 이 있습니다." 타임라인·월 달력으로 본다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원 |
| 언제 | 차가 필요할 때 |
| 먼저 있어야 하는 것 | 0001 공용차량 |
| 다음 이벤트 | 0003 |
| 실제 실행 | 2026-11-14, kalpa API. 401 11-18 09:00~12:00 `(주)A사 본사` `car03` +1 → 402 같은 차 10:00~11:00 → 겹침 거절 → 타임라인 2행. **402가 401 예약 삭제 → 200**(⚠#261). 401이 11-13 09:00~12:00로 다시 예약(`…640`) |
| 메뉴 | #1187 경영관리 > 10. 차량관리 > 공용차량 예약관리. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1187 | 날짜 → 타임라인(`GET /car/bookings/timeline?date=`) | 차량별 예약 |
| 2 | 〃 | 예약 창 | 차량·시간·행선지·목적 → [저장] (`PUT /car/bookings`) | 예약 막대 |
| 3 | 〃 | 〃 | [삭제] (`DELETE /car/bookings?withChildren=`) | |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `car03_booking` | 예약(부모 ID·등록자) | +1(남김) |

## 업무 규칙 · 주의

- 수정은 예약자만(`ownsBooking`), **삭제는 같은 회사 누구나** → [#261](../../보안_및_버그_의심.md).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: CAR-BZ-0002
company: kalpa
steps:
  - {no: 1, user: 401, api: PUT /api/v1/car/bookings, body: {infoId: "{공용}", personId: 401, startDate: 2026-11-18, startHour: "09", startMin: "00", closeDate: 2026-11-18, closeHour: "12", closeMin: "00", destination: "(주)A사 본사", reason: 계약 미팅, changeUpdate: false}, expect: "car03 +1"}
  - {no: 2, user: 402, api: PUT /api/v1/car/bookings, body: {같은 차, 10:00~11:00}, expect: "400 이미 등록된 예약"}
```
</details>

<details><summary>근거</summary>

- AS-IS: `Car03_Tab_List`·`Car03_Popup_BookingReg`, `Car03_Booking.update`·`updateList`·`delete` L367-370.
- TOBE: `CarBookingService.save` L56-82·`delete` L86-90.
</details>
