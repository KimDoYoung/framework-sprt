# SYS-BZ-0008 영업일·휴일 달력을 정한다

> **한 줄 요약** — 달력(`sys12_calendar`, 하루 한 줄·영업일 여부)은 **그 회사의 휴일표(`sys14_holiday`)를 보고** 1년치를 한 번에 만든다. 새 회사는 휴일표가 비어 있으므로 먼저 KFS 관리자가 [휴일관리 → 기초데이터생성]으로 공휴일을 복사해 주고, 그다음 고객사 관리자가 #1080에서 [생성]을 누른다. 순서를 거꾸로 하면 주말만 쉬는 달력이 된다.

| 항목 | 내용 |
|:---|:---|
| 누가 | ① KFS 관리자 `admin/admin/1111` (공휴일 복사) ② 고객사 관리자 `kalpa/admin/1111` (달력 생성·고치기) |
| 언제 | 해마다(다음 해 달력), 회사 등록 직후, 임시공휴일이 생겼을 때 |
| 먼저 있어야 하는 것 | SYS-BZ-0001(회사), SYS-BZ-0003(#1080 메뉴가 열려 있어야 함) |
| 다음 이벤트 | 영업일을 쓰는 업무(기준일 초기값 = 전 영업일 등) |
| 실제 실행 | kalpa(회사ID 202611109046432), 2026-11-10 — 2026·2027년 |

## 따라 하기

### ① KFS 관리자 — 공휴일을 고객사에 복사

| 단계 | 화면 | 누르는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|
| 1 | **#1113** 기초자료 > 90. 기타 > 일자관리 (KFS 관리자 메뉴. #1080과 같은 화면) | [휴일관리] | "휴일관리" 창: KFS(회사 0)의 휴일 목록 |
| 2 | 휴일관리 창 | 조회연도 `2026` → [조회] | 2026년 공휴일 18건(신정~크리스마스) |
| 3 | 〃 | 그리드 머리의 체크박스로 **전부 선택**, 회사 칸의 돋보기 → `(주)칼파테크` | 회사 칸에 `(주)칼파테크` |
| 4 | 〃 | [기초데이터생성] | "생성이 완료되었습니다." |
| 5 | 〃 | 조회연도 `2027`로 2~4 반복 | 20건 복사 |

※ [기초데이터생성]과 회사 칸은 **KFS 관리자에게만** 보인다. 고른 날짜마다 고객사의 같은 날 휴일을 지우고 KFS 휴일을 복사한다(다시 눌러도 겹치지 않는다).

### ② 고객사 관리자 — 1년치 달력 만들기

| 단계 | 화면 | 누르는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|
| 1 | **#1080** 관리자 > 09. 기타 > 일자관리 | 년도 `2026` → [생성] | "기존 데이터를 삭제 후 생성합니다. 진행하시겠습니까?" |
| 2 | 〃 | [예] | "생성이 완료되었습니다." → 365일 목록. 토·일·휴일은 영업일 체크가 꺼지고 휴일사유가 채워진다 |
| 3 | 〃 | 년도 `2027`로 1~2 반복 | 365일 |
| 4 | (필요하면) | 행의 휴일사유·비고를 고치고 영업일 체크를 바꾼 뒤 [저장] | 회사만 쉬는 날(창립기념일 등)을 반영 |

※ 회사 휴일을 오래 쓸 것이면 4번(달력 직접 고치기) 대신 [휴일관리]에서 휴일을 [등록]·[저장]하고 [생성]을 다시 누른다 — [생성]은 그 해 달력을 **지우고 다시 만들기** 때문에 4번에서 고친 것은 사라진다.

## DB에 남는 것

| 테이블 | 무엇 | 추가·변경 | 행 |
|:---|:---|:---|---:|
| `sys14_holiday` | 칼파테크의 휴일표(KFS 휴일 복사) | 추가 | 2026년 18 + 2027년 20 = 38 |
| `sys12_calendar` | 칼파테크의 달력(하루 한 줄: 요일·영업일·휴일사유) | 그 해 삭제 후 추가 | 2026년 365(영업일 249) + 2027년 365(영업일 248) |

2026년 칼파테크 달력은 KFS(회사 0) 2026년 달력과 **영업일·휴일사유가 하루도 다르지 않다**(대조 SQL 0건).

## 결과를 볼 수 있는 화면

- #1080 일자관리(년도·월로 조회), [휴일관리] 창(칼파테크 관리자로 열면 복사된 휴일).
- 영업일을 계산하는 곳: 기준일 초기값을 "전 영업일"로 잡는 화면들(`GET /api/v1/sys/calendars/biz-date`). 실행 확인: 칼파테크에서 2026-10-06의 전 영업일 = **2026-10-02**(10-03 토 개천절, 10-04 일, 10-05 대체공휴일을 건너뜀).

## 업무 규칙 · 주의

- **순서: 휴일 복사 → 달력 생성.** [생성]은 그 회사의 `sys14_holiday`만 본다. 휴일표가 비어 있으면 토·일만 쉬는 날이 된다.
- 달력 생성은 **연 단위**다. 화면의 "월" 선택은 조회에만 쓰이고 [생성]에는 쓰이지 않는다.
- 주말에 걸린 공휴일(2026-06-06 토 현충일 등)도 휴일사유가 채워진다. 대체공휴일은 자동 계산하지 않는다 — 휴일표에 있어야 한다.
- **TOBE 회사 등록에 원본 기능이 빠져 있다:** 현재 AS-IS는 회사 등록 때 회사 0의 휴일 전부(`sys14_holiday.insertFormSys14`)와 전년~5년 뒤 달력(`sys12_calendar.insertFormSys12`)을 자동으로 만든다(`UpdateDataModel` 20·21번, 원본 2026-04 추가). TOBE `SysCompanyService.initCompany`는 그 전 원본(1~15번)만 옮겨서, 등록 직후 칼파테크는 휴일 0건·달력 0건이었다. 그래서 이번에는 위 ①②를 손으로 했다. (변경반영 대상 — 16~33번 전체)
- [고객사반영](#1080, KFS 관리자에게만 보임)은 KFS 달력의 하루를 골라 여러 고객사의 같은 날 영업일·휴일사유를 한꺼번에 바꾼다(임시공휴일 지정 때). 이번에는 실행하지 않았다.
- **KFS 휴일표 확인 필요(데이터):** KFS 2026년 휴일표·달력에 **2026-05-25(부처님오신날 대체공휴일)**, **2026-06-03(전국동시지방선거일)**이 없어 영업일로 되어 있다. 칼파테크도 그대로 복사됐다. TOBE 문제가 아니라 원본 데이터 문제이며, 고칠지는 KFS 관리자가 정한다(고치면 [휴일관리]에 등록 → 고객사에 기초데이터생성 → 고객사가 [생성] 다시).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0008
needs: [SYS-BZ-0001, SYS-BZ-0003]
steps:
  - no: ①4
    actor: { company: admin, user: admin, password: "1111" }
    screen: 1113
    action: '[휴일관리] → 2026 조회 → 전부 선택 → 회사 칼파테크 → [기초데이터생성]'
    api: POST /api/v1/sys/holidays/init-data
    body: { companyId: "<칼파테크 회사ID>", days: ["<GET /api/v1/sys/holidays?year=2026 의 day 전부>"] }
  - no: ②2
    actor: { company: kalpa, user: admin, password: "1111" }
    screen: 1080
    action: '년도 2026 → [생성] → [예]'
    api: POST /api/v1/sys/calendars/generate?year=2026
expect:
  - { table: sys14_holiday, where: "sys14_company_id = :cid and sys14_day between '2026-01-01' and '2026-12-31'", rows: 18 }
  - { table: sys12_calendar, where: "sys12_company_id = :cid and sys12_day between '2026-01-01' and '2026-12-31'", rows: 365 }
  - { table: sys12_calendar, where: "sys12_company_id = :cid and sys12_day between '2026-01-01' and '2026-12-31' and sys12_working_yn = 'true'", rows: 249 }
```
</details>

<details>
<summary>확인 SQL</summary>

```sql
-- 해마다 일수·영업일·휴일사유 수
select to_char(sys12_day,'YYYY') y, count(*) n,
       sum(case when sys12_working_yn='true' then 1 else 0 end) work, count(sys12_off_reason) reason
  from sys12_calendar where sys12_company_id = :cid group by 1 order by 1;

-- KFS(회사 0) 달력과 다른 날 (0건이어야 함)
select a.sys12_day::date, a.sys12_working_yn, k.sys12_working_yn
  from sys12_calendar a
  join sys12_calendar k on k.sys12_day = a.sys12_day and k.sys12_company_id = :cid
 where a.sys12_company_id = 0
   and (a.sys12_working_yn <> k.sys12_working_yn or coalesce(a.sys12_off_reason,'') <> coalesce(k.sys12_off_reason,''));
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Sys12_Tab_Calendar`(#1080·#1113. [생성] E5 확인창 L119-139 → `insertAuto` L174-197, [고객사반영]은 회사 0만 L69-71), `Sys14_Lookup_Holiday`([기초데이터생성]·회사 칸은 회사 0만 L157-161, `initData` L194-215), `Sys12_Lookup_Customer`(고객사반영 `updateList` L93-135)
- AS-IS 서버: `sys.Sys12_Calendar.insertAuto`(Sys12_Calendar.java:87 — `year+"0101"`~`year+"1231"`, month 안 씀) → `sys12_calendar.deleteByDay` + `insertAuto`(PostgreSQL: `generate_series`로 하루씩, `TO_CHAR(dt,'D')` 1·7 = 주말, 그 회사 `sys14_holiday`와 LEFT JOIN), `sys.Sys14_Holiday.insertInitData`(Sys14_Holiday.java:54 — 고른 날마다 `deleteByDay` + 회사 0 휴일 복사)
- TOBE: `POST /api/v1/sys/holidays/init-data`(`SysHolidayController`/`SysHolidayService.insertInitData` — 관리자 회사만, 고객사 미선택은 "고객사를 선택해주세요"로 막음), `POST /api/v1/sys/calendars/generate?year=`(`SysCalendarService.generate` — 로그인 회사, 4자리 년도 검사), `GET /api/v1/sys/calendars`, `GET /api/v1/sys/calendars/biz-date`
- TOBE 상태(2026-11-10): **실행** — kalpa에서 API로 휴일 38건 복사, 달력 2년치 생성, KFS 2026 달력과 대조 일치, 전 영업일 계산 확인. 자동 시험·화면 눈 확인은 아직.
</details>
