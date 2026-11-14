# SCH-BZ-0001 직원이 업무일정을 등록한다(분류·기한·공유·알람)

> **한 줄 요약** — 직원이 #1042 업무일정 등록에서 **[등록]**을 누르면 빈 일정(`sch01_info`, 담당자 = 나)이 먼저 생기고 등록 창이 열린다. 창에서 분류(`sch08_class` — [분류추가]로 내 분류를 만든다)·제목·내용·데일리 여부·비공개를 정하고, **[일회성조건]**(지정일) 또는 **[반복주기조건]**(매월 N일·매일 …)으로 기한(`sch03_deadline`)을 붙이면 **DB 트리거가 앞으로 1년치 기한일**(`sch09_deadline_day`)을 만든다. 공유자(직원·부서, `sch02_share`)·알람(`sch06_alarm`)·첨부도 붙인다. 저장 없이 닫으면 빈 일정을 지운다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 직원(시험은 kalpa 김사원 401) |
| 언제 | 반복되는 업무·마감이 생길 때 |
| 먼저 있어야 하는 것 | EMP 직원 등록. 주기 코드 `CycleCode`(01 매일·03 월별·99 수시 …) |
| 다음 이벤트 | 0002 담당자 변경, 0003 처리, 0004 데일리 체크 |
| 실제 실행 | 2026-11-14, kalpa API(메뉴 없음). 분류 `ZZ 정기업무` +1 → `POST /sch/infos` 빈 일정 `202611149151502` → `PUT` 제목 `월말 경비 정산 제출` → 반복주기 월별·10일(`cycleCalcType 05`, `num1 10`) `sch03` +1 → **`sch09` +15**(2026-10-10 ~ 2027-12-10 매월 10일) → 일회성 지정일 2026-11-20 `sch03` +1(`sch09`는 안 생김 — 지정일은 조회 SQL이 직접 읽음) → 공유 김과장(직원) `sch02` +1 → 알람 1일 전 오전 9시 `sch06` +1. 목록 `GET /sch/infos` AS-IS 1 = 1 |
| 메뉴 | #1042 스케줄 > 01. 업무일정 > 업무일정 등록 (11곳). 화면 눈 확인 `대기(일괄)` |

## 따라 하기

| 단계 | 누가 | 화면 | 누르는 것 · 입력하는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|:---|
| 1 | 직원 | #1042 | [등록] (`POST /sch/infos` → 빈 행) → 등록 창 | 담당자 = 나 |
| 2 | 〃 | 등록 창 | [분류추가] → 분류 이름 → [저장] (`PUT /sch/classes`) | 분류 콤보에 나옴(내 분류만) |
| 3 | 〃 | 〃 | 분류·제목·내용·데일리·비공개 → [저장] (`PUT /sch/infos/{id}`) | 저장 |
| 4 | 〃 | 〃 | [반복주기조건] → 월별·10일 → [저장] (`PUT /sch/deadlines {scheduleCode:"1", cycleCode:"03", cycleCalcType:"05", dayCode:"AA", num1:10}`) | 기한 그리드 `(월별)10일` |
| 5 | 〃 | 〃 | [일회성조건] → 지정일 → [저장] (`PUT /sch/deadlines {cycleCode:"99", cycleCalcType:"01", fixDate}`) | 기한 그리드 `수시` |
| 6 | 〃 | 〃 | 공유 탭 [행 추가] → 직원·부서 → [저장] (`PUT /sch/infos/{id}/shares`) | 공유자 |
| 7 | 〃 | 〃 | [알람설정] → 1일 전 오전 9:00 (`PUT /sch/alarms {targetCode:"SCH"}`) | 알람 |
| 8 | 〃 | #1042 | [조회] (`GET /sch/infos?useYn=true`) | 일정·분류·기한·공유자·알람 요약 |

## DB에 남는 것

| 테이블 | 무엇 | 실행 |
|:---|:---|:---|
| `sch08_class` | 분류(사람별 — 회사 열 없음) | +1 |
| `sch01_info` | 일정(담당자·데일리·비공개) | +1 |
| `sch03_deadline` | 기한 조건(`schedule_cd` 1 = 업무일정, 2 = 법규) | +2 |
| `sch09_deadline_day` | 기한일(트리거 `sch03_deadline_sch09` → `f_create_schDeadlineDay`, 오늘 기준 1년치) | +15 |
| `sch02_share` · `sch06_alarm` | 공유자 · 알람 | +1 · +1 |

## 업무 규칙 · 주의

- 기한일은 트리거가 만든다. 사용여부를 바꾸면(`sch01_use_yn`) 트리거 `sch01_info_sch09`가 다시 만든다. 지정일(99·01)과 매일(01)은 `sch09`를 안 쓰고 조회 SQL이 계산한다.
- 비공개를 켜면 화면이 공유자를 모두 지운다(E7·E8).
- **같은 회사 직원이면 남의 일정(비공개 포함)을 읽고 고치고 지운다** — 서버가 회사만 본다. 원본도 같다 → [#247](../../보안_및_버그_의심.md).
- **연관법규 API는 로그인 회사 검사가 없어 다른 회사 사원이 붙이고 뗀다**. 기한 한 건 조회도 다른 회사 것이 보인다 → [#248](../../보안_및_버그_의심.md). (일정 본문·공유자는 다른 회사면 404로 막힘)

<details><summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SCH-BZ-0001
company: kalpa
user: 401
steps:
  - {no: 1, api: PUT /api/v1/sch/classes, body: [{className: "ZZ 정기업무", seq: 1, useYn: true}], expect: sch08_class +1}
  - {no: 2, api: POST /api/v1/sch/infos, expect: "sch01_info +1, managerId=401"}
  - {no: 3, api: "PUT /api/v1/sch/infos/{infoId}", body: {classId: "{classId}", title: "월말 경비 정산 제출", dailyYn: false, privateYn: false, useYn: true}}
  - {no: 4, api: PUT /api/v1/sch/deadlines, body: {infoId: "{infoId}", scheduleCode: "1", cycleCode: "03", cycleCalcType: "05", dayCode: AA, dayTypeCode: "1", holidayCode: "0", num1: 10}, expect: "sch09_deadline_day +15"}
  - {no: 5, api: PUT /api/v1/sch/deadlines, body: {infoId: "{infoId}", scheduleCode: "1", cycleCode: "99", cycleCalcType: "01", fixDate: 2026-11-20}}
  - {no: 6, api: "PUT /api/v1/sch/infos/{infoId}/shares", body: [{shareCode: "1", personId: 301, orgId: "{경영지원본부}", startDate: 2026-11-01, closeDate: 9999-12-31}]}
  - {no: 7, api: PUT /api/v1/sch/alarms, body: [{targetCode: SCH, targetId: "{infoId}", alarmType: "1", dayWeekCode: D, num: 1, befAftCode: "1", amPmCode: AM, hourCode: "09", minuteCode: "00", holidayCode: "0", useYn: true}]}
  - {no: 8, api: GET /api/v1/sch/infos?useYn=true, expect: rows 1}
```
</details>

<details><summary>근거 (AS-IS · TOBE)</summary>

- AS-IS: `Sch01_Tab_Info`(E5 조회·E6 등록·E7 삭제), `Sch01_Lookup_Info`(E3 저장·E15 일회성·E16 반복주기·E17 알람·E18 분류추가), `Sch03_Lookup_Short`·`Sch03_Lookup_Cycle` → `Sch03_Deadline.insertModel` L76, SQL `sch01_info.selectByText`, DB 트리거 `sch03_deadline_sch09`·`sch01_info_sch09`.
- TOBE: `SchInfoController`·`SchInfoService` L107-179, `SchDeadlineService.save` L64-83, `SchClassController`, `SchAlarmController`, 화면 `pages/sch/Sch01_Tab_Info.tsx`·`Sch01_Lookup_Info.tsx`.
- 확인: `compare GET /sch/infos --sql sch01_info.selectByText`(kalpa 401) 1 = 1, 그리드 17열.
</details>
