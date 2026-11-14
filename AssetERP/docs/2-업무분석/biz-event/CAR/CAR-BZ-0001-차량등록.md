# CAR-BZ-0001 경영관리팀이 차량을 등록하고 전용차량 사용자를 정한다

> **한 줄 요약** — 경영관리팀이 #1188 차량정보관리에서 [등록] → 차량구분(`CarTypeCode`: 1 전용차량 · 2 공용차량)·차량번호·차량명·정보·초기 주행거리를 [저장](`car01_info`). 전용차량이면 아래 사용자 그리드에 직원과 사용기간을 넣는다(`car02_user`).

| 항목 | 내용 |
|:---|:---|
| 누가 | 경영관리팀(시험 301) |
| 언제 | 차량 구입·배정 때 |
| 먼저 있어야 하는 것 | EMP 직원 |
| 다음 이벤트 | 0002·0004 |
| 실제 실행 | 2026-11-14, kalpa API. 공용 `12가3456 공용 쏘나타`(초기 15,000km)·전용 `34나7890 대표이사 전용 그랜저`(3,000km) `car01` +2 → 전용차 사용자 김사장(2026-11-01~) `car02` +1 → 목록 2행(전용차에 사용자 이름). 다른 회사(KFS 104)가 kalpa 차량 사용자 조회 → 404. **사원 401이 차량명 수정 → 200**(⚠#261) → 되돌림 |
| 메뉴 | #1188 경영관리 > 10. 차량관리 > 차량정보관리. 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 경영관리 | #1188 | [등록] → 구분·번호·이름·초기 주행거리 → [저장] (`PUT /car/infos`) | 차량 목록(`GET /car/infos`) |
| 2 | 〃 | 〃 | 전용차 선택 → 사용자 [행 추가] → 직원·기간 → [저장] (`PUT /car/users`) | 사용자 이름 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `car01_info` · `car02_user` | 차량 · 전용차 사용자 | +2 · +1 |

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: CAR-BZ-0001
company: kalpa
user: 301
steps:
  - {no: 1, api: PUT /api/v1/car/infos, body: {carType: "2", carNo: 12가3456, carNm: 공용 쏘나타, initMileage: 15000}, expect: "car01 +1"}
  - {no: 2, api: PUT /api/v1/car/infos, body: {carType: "1", carNo: 34나7890, carNm: 대표이사 전용 그랜저, initMileage: 3000}}
  - {no: 3, api: PUT /api/v1/car/users, body: [{infoId: "{전용}", personId: 100, startDate: 2026-11-01, closeDate: 9999-12-31}], expect: "car02 +1"}
```
</details>

<details><summary>근거</summary>

- AS-IS: `Car01_Tab_Info`·`Car01_Edit_Info`·`Car02_Grid_User`.
- TOBE: `CarInfoController`·`CarUserController`(checkInfo — 다른 회사 차량이면 404).
</details>
