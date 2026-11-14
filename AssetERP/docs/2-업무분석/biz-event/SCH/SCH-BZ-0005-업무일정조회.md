# SCH-BZ-0005 업무일정·체크내역을 본다

> **한 줄 요약** — 직원이 **#1226 기간별 업무일정 조회**(나의 스케줄·공유 스케줄·전체, 데일리만)와 **#1357 부서별 업무일정 조회**(부서·하위부서 포함)로 기간 안의 기한일을 보고, **#1356 업무일정 체크내역**으로 내가 처리한 데일리 체크를 기간으로 본다. 공모주 일정 행을 누르면 공모주 정보 창, 일정 행을 누르면 일정 보기 창이 열린다. 모두 조회만.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원·팀장 |
| 언제 | 수시 |
| 먼저 있어야 하는 것 | 0001·0003·0004 |
| 다음 이벤트 | — |
| 실제 실행 | 2026-11-14, kalpa API(2026-11-01~11-30). #1226 401 나의 스케줄 23행(매일 21 + 월별 11-10 + 지정일 11-20), 데일리만 21행 — AS-IS `sch01_info.selectByCloseDate` 23 = 23 · 21 = 21. 김과장(공유자) 공유 스케줄 4행(김사원·최사원 복사본의 11-10·11-20). #1357 경영지원본부·하위 포함 AS-IS `sch01_info.selectByOrg` 23 = 23. #1356 401 체크내역 AS-IS `sch04_list.selectCheckListStatus` 2 = 2 |
| 메뉴 | #1226·#1357 스케줄 > 01. 업무일정, #1356 스케줄 > 02. 업무일정 체크 (각 4곳). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1226 | 기간·분류·구분(나의/공유/전체)·주기·데일리 → [조회] (`GET /sch/infos/period`) | 기한일별 일정 |
| 2 | 팀장 | #1357 | 부서·하위부서 포함·기간 → [조회] (`GET /sch/infos/org`) | 부서원 일정 |
| 3 | 직원 | #1356 | 기간·처리여부·분류 → [조회] (`GET /sch/lists/check-status`) | 내가 처리한 데일리 체크 |
| 4 | 〃 | #1226·#1357 | 행 클릭 → 일정 보기(`GET /sch/infos/{id}/view`) 또는 공모주 정보(`GET /sch/ipos/{id}`) | 창 |

## DB에 남는 것

없음(조회만).

## 업무 규칙 · 주의

- '등록자' 열(`managerOrgInfo`)은 원본 SQL에도 없는 열이라 늘 빈칸(원본 그대로).
- 공유 스케줄은 공유 기간(`sch02_start_date`~`close_date`) 안의 기한일만 나온다.

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SCH-BZ-0005
company: kalpa
pre: [SCH-BZ-0001, SCH-BZ-0002, SCH-BZ-0004]
steps:
  - {no: 1, user: 401, api: GET /api/v1/sch/infos/period?startDate=2026-11-01&endDate=2026-11-30&shareType=1&cycleCode=%25&dailyYn=false, expect: rows 23}
  - {no: 2, user: 301, api: GET /api/v1/sch/infos/period?startDate=2026-11-01&endDate=2026-11-30&shareType=2&cycleCode=%25&dailyYn=false, expect: rows 4}
  - {no: 3, user: 401, api: "GET /api/v1/sch/infos/org?orgId={경영지원본부}&subOrgYn=true&startDate=2026-11-01&endDate=2026-11-30", expect: rows 23}
  - {no: 4, user: 401, api: GET /api/v1/sch/lists/check-status?startDate=2026-11-01&endDate=2026-11-30, expect: rows 2}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Sch01_Tab_List.retrieve`(`sch01_info.selectByCloseDate`), `Sch01_Tab_ListOrg.retrieve`(`selectByOrg`), `Sch04_Tab_DailyCheckListStatus.retrieve` L181-205(`sch04_list.selectCheckListStatus`).
- TOBE: `SchInfoService.searchByPeriod` L58·`searchByOrg` L70, `SchListService.searchCheckStatus` L170.
- 확인: `compare` 3건 위 숫자(분류를 넣어 비교 — 원본 SQL `COALESCE(:classId,1)`가 빈 값을 못 받음).
</details>
