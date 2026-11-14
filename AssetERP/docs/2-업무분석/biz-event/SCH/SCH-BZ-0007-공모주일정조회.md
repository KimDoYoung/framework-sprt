# SCH-BZ-0007 직원이 공모주 일정을 보고 관심·알림·공유자를 정한다

> **한 줄 요약** — 직원이 #1223 공모주 일정조회(#1296 고유자산 > 공모주일정도 같은 서버·창)에서 ADMIN이 올린 공모주 일정을 기간·시장·관심종목만으로 본다. 행을 골라 **[관심종목]**(★, 회사 단위 `sch11_ipo_company`), 일정별 **알림**(수요예측 시작·종료·청약 시작·종료·납입·상장일, 같은 행), **공유자**(직원·부서, `sch02_share`)를 정한다. 공유받은 직원의 데일리 체크(0004)에 `[수요예측] 종목명` 행이 생긴다. [출력]은 조회 결과를 출력 자료(`sys99_print`)로 담아 RD를 연다. 수요예측 참여·청약 운용지시 아이콘은 FND-BZ-0008.

| 항목 | 내용 |
|:---|:---|
| 누가 | 운용역·고유자산 담당 |
| 언제 | 공모 일정이 나올 때 |
| 먼저 있어야 하는 것 | 0006 |
| 다음 이벤트 | 0004 데일리 체크, FND-BZ-0008 |
| 실제 실행 | 2026-11-14, kalpa API. `GET /sch/ipos/user` → AS-IS `sch10_ipo.selectBySearchText` 5 = 5. ZZ에너지 [관심종목] → `sch11` +1 → 알림(수요예측 시작·청약 시작)을 ID 없이 저장 → `sch11` +1(**같은 회사 2행 → 목록에 두 줄** — FND-BZ-0008의 칼파바이오도 2행) → 최사원(402) 공유(11-14~12-16) `sch02` +1, 공유자 표시 `최사원` → 402 데일리 체크 12-01에 `[수요예측] ZZ에너지(시험)`. [출력] `sys99_print` +5(그룹 `202611149151579`) |
| 메뉴 | #1223 펀드관리 > 04. 공모주청약 > 공모주 일정조회 (10곳), #1296 고유자산 > 20. 고유자산 거래처리 > 공모주일정 (5곳). 화면 눈 확인 `대기(일괄)`, RD 확인 대기 |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1223 | 조회일자·기간·시장·관심종목만 → [조회] (`GET /sch/ipos/user`) | 공모주·★·공유자 |
| 2 | 〃 | 〃 | 행 체크 → [관심종목] (`PUT /sch/ipos/interests {ipoIds, interestYn:true}`) | ★ |
| 3 | 〃 | 〃 | 알림 칸 → [저장] (`GET·PUT /sch/ipos/{id}/company`) | 알림 체크 |
| 4 | 〃 | 〃 | 공유자 셀 → 공유 창 → 직원·기간 → [저장] (`PUT /sch/ipos/{id}/shares`) | 공유자 이름 |
| 5 | 〃 | 〃 | [출력] (`POST /sch/ipos/rd-print` → 그룹 ID) | RD |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `sch11_ipo_company` | 회사별 관심·알림 6칸 | +2(중복 1 — 정리 SQL 대기) |
| `sch02_share` | 공모주 공유자(`info_id` = 공모주 ID) | +1 |
| `sys99_print` | 출력 자료 | +5 |

## 업무 규칙 · 주의

- 관심·알림은 회사 단위(직원별 아님).
- **같은 회사·공모주에 `sch11` 행이 두 개 생기면 목록에 같은 공모주가 두 줄로 나온다**(서버가 있는지 안 봄). 원본 SQL도 같은 결과 → [#251](../../보안_및_버그_의심.md).
- 공유자의 부서 칸은 요청 값 그대로 저장한다(시험에서 402에 경영지원본부를 넣어도 저장됨).

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SCH-BZ-0007
company: kalpa
user: 401
pre: [SCH-BZ-0006]
steps:
  - {no: 1, api: GET /api/v1/sch/ipos/user?dateType=1&startDate=2026-11-01&closeDate=2026-12-31}
  - {no: 2, api: PUT /api/v1/sch/ipos/interests, body: {ipoIds: ["{ipoId}"], interestYn: true}, expect: sch11_ipo_company +1}
  - {no: 3, api: "PUT /api/v1/sch/ipos/{ipoId}/company", body: {ipoCompanyId: "{2단계 ID}", demandSdateAlarmYn: true, subscriptionSdateAlarmYn: true}}
  - {no: 4, api: "PUT /api/v1/sch/ipos/{ipoId}/shares", body: [{shareCode: "1", personId: 402, orgId: "{운용본부}", startDate: 2026-11-14, closeDate: 2026-12-16}]}
  - {no: 5, user: 402, api: GET /api/v1/sch/lists/daily-check?startDate=2026-12-01, expect: "[수요예측] 행"}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Sch10_Tab_Ipo.retrieve` L403-439(`sch10_ipo.selectBySearchText`, ManagerYn false), `Sch10_Tab_Ipo2`(같은 서버, 수요예측·청약 아이콘 없음), `Sch11_IpoCompany.update`, `Sys99_Print.insertRdIpo` L2631.
- TOBE: `SchIpoService.searchUser` L101·`interest` L109-118·`insertRd` L125·`saveShares` L153·`saveCompany` L193-204, 화면 `pages/sch/Sch10_Tab_Ipo.tsx`·`Sch10_Tab_Ipo2.tsx`.
- 확인: `compare GET /sch/ipos/user --sql sch10_ipo.selectBySearchText` 5 = 5.
</details>
