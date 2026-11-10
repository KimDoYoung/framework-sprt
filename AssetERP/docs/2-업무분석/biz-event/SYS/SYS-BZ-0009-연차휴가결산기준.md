# SYS-BZ-0009 연차휴가 결산기준을 정한다

> **한 줄 요약** — 회사마다 **휴가결산월**(연차를 세는 1년의 끝 달), **휴가초과 허용여부**, **근속연수별 연차개수 표**를 둔다. 연차개수 표(23줄)와 결산월은 회사 등록(SYS-BZ-0001) 때 이미 들어간다. 고객사 관리자는 #1036에서 그것을 확인하고 회사 규정에 맞게 고쳐 [저장]한다.

| 항목 | 내용 |
|:---|:---|
| 누가 | 고객사 관리자 `kalpa/admin/1111` (KFS 관리자는 #1075 고객 목록의 "휴가 초과허용" 칸으로도 고칠 수 있음) |
| 언제 | 도입 때(휴가 메뉴를 쓰기 전), 취업규칙이 바뀔 때 |
| 먼저 있어야 하는 것 | SYS-BZ-0001(회사 등록 때 연차개수 표·결산월이 생김), #1036 메뉴가 회사에 열려 있어야 함(SYS-BZ-0003) |
| 다음 이벤트 | 휴가 신청·연차 계산(EMP 휴가, 아직 목록 없음) |
| 실제 실행 | kalpa(회사ID 202611109046432), 2026-11-10 — **API로만**(아래 "메뉴 없음") |

## 따라 하기

| 단계 | 화면 | 누르는 것 | 화면에 보이는 결과 |
|:---:|:---|:---|:---|
| 1 | **#1036** 경영관리 > 02. 휴가/출장 관리 > 연차휴가 결산기준 | (열면 바로 조회) | 왼쪽: 휴가초과 허용여부·휴가결산월 한 줄. 오른쪽: 근속연수 1~23 → 연차개수 |
| 2 | 〃 왼쪽 | 휴가결산월 칸 → `12월`, 휴가초과 허용여부 체크 끔 | 바뀐 칸 표시 |
| 3 | 〃 오른쪽 | (규정이 다르면) 연차개수를 고치거나 [행 추가]·[행 삭제] | |
| 4 | 〃 | [저장] | 왼쪽·오른쪽 함께 저장 |

칼파테크의 결정: **결산월 12월(1월 1일~12월 31일 회계연도 기준), 초과사용 허용 안 함, 연차개수 표는 등록 때 받은 그대로**(근로기준법 기본: 1·2년 15일, 2년마다 1일씩 늘어 21년 이상 25일).

## DB에 남는 것

| 테이블 | 무엇 | 추가·변경 | 행 |
|:---|:---|:---|---:|
| `sys01_company` | `sys01_leave_month_cd` 휴가결산월, `sys01_leave_yn` 휴가초과 허용 | 변경 | 1 (`12` 그대로, `leave_yn` 빈칸 → `false`) |
| `sys30_leave_year` | 근속연수별 연차개수 | (이번엔 그대로) | 23 — 회사 등록 때 회사 0에서 복사됨, 회사 0과 같음 |

## 이 값이 쓰이는 곳

| 값 | 쓰는 곳 | 칼파테크에서 확인한 결과 |
|:---|:---|:---|
| 휴가결산월 | DB 함수 `f_get_close_date(회사, 연도, 1/2)` → 연차 결산 시작일·종료일. 12월이면 그해 1/1~12/31, 다른 달이면 그 달 다음 날부터 1년. 휴가 화면은 결산월 `03`일 때 조회 기간을 따로 잡는다 | 2026년 → **2026-01-01 ~ 2026-12-31** (회사 0은 결산월 08 → 2026-09-01 ~ 2027-08-31) |
| 연차개수 표 | DB 함수 `f_get_leave_year(회사, 근속연수)` → 그 해 연차일수(표에서 근속연수 이하 중 가장 큰 줄). 1년 미만은 비례 계산 | 1년 15 · 3년 16 · 30년 25 |
| 휴가초과 허용 | 휴가 신청(`Emp20_Edit_Leave`·`Emp20_Tab_Leave`·`Emp20_Tab_LeaveManager`): 허용이면 남은 연차를 넘어 신청할 수 있다. 회사의 "초과사용 승인" 설정도 켜져 있으면 초과사용 승인을 받아야 상신된다(특별·포상휴가 제외) | 허용 안 함 → 남은 일수까지만 |

## 업무 규칙 · 주의

- **메뉴 없음:** 칼파테크는 가장 작은 상품(`prod_s1`)에서 메뉴를 받아 **#1036과 휴가 메뉴가 하나도 없다.** 그래서 이번에는 화면 대신 API(`PUT /api/v1/sys/leave-years/setting`)로 저장했다. 화면으로 하려면 KFS 관리자가 #1076 회사별 메뉴맵핑에서 휴가 메뉴를 열어 줘야 한다(SYS-BZ-0003). 칼파테크 직원이 휴가를 쓸 때가 되면 그때 함께 연다.
- 휴가초과 허용이 빈칸이면 화면은 "허용 안 함"으로 본다(`Sys01_CompanyModel.getLeaveYn`이 null → false). 이번 저장으로 빈칸을 `false`로 확정했다.
- 회사에 연차개수 표가 한 줄도 없으면 `f_get_leave_year`는 회사 0의 표를 쓴다. 표를 다 지워도 계산은 되지만, 회사 고유 규정은 사라진다.
- [저장] 한 번이 왼쪽(회사)과 오른쪽(연차개수 표)을 함께 저장한다(AS-IS `update()` L117-121).

<details>
<summary>시나리오 데이터 (자동 시험용)</summary>

```yaml
id: SYS-BZ-0009
needs: [SYS-BZ-0001]
actor: { company: kalpa, user: admin, password: "1111" }
steps:
  - no: 1
    screen: 1036
    action: '열기(조회)'
    api: [GET /api/v1/sys/leave-years/setting, GET /api/v1/sys/leave-years]
  - no: 4
    screen: 1036
    action: '결산월 12월, 초과허용 끔 → [저장]'
    api: PUT /api/v1/sys/leave-years/setting
    body: { leaveYn: false, leaveMonthCode: "12" }
expect:
  - { table: sys01_company, where: "sys01_company_id = :cid and sys01_leave_month_cd = '12' and sys01_leave_yn = 'false'", rows: 1 }
  - { table: sys30_leave_year, where: "sys30_company_id = :cid", rows: 23 }
  - { sql: "select f_get_close_date(:cid,'2026','1')", value: "2026-01-01" }
  - { sql: "select f_get_leave_year(:cid,3)", value: 16 }
```
</details>

<details>
<summary>확인 SQL</summary>

```sql
select sys01_leave_yn, sys01_leave_month_cd from sys01_company where sys01_company_id = :cid;
select sys30_year, sys30_leave_days from sys30_leave_year where sys30_company_id = :cid order by sys30_year::int;
select f_get_close_date(:cid,'2026','1') 시작, f_get_close_date(:cid,'2026','2') 종료,
       f_get_leave_year(:cid,1) y1, f_get_leave_year(:cid,3) y3, f_get_leave_year(:cid,30) y30;
```
</details>

<details>
<summary>근거 (AS-IS · TOBE)</summary>

- AS-IS 화면: `Sys30_Tab_LeaveYear`(#1036. 왼쪽 그리드 `sys.Sys01_Company.selectById`·`update` L109-121, 결산월 콤보 `MonthsCode` L93-103), `Sys30_Grid_LeaveYear`(근속연수·연차개수, `sys.Sys30_LeaveYear.selectByAll`·`update`·`delete`)
- AS-IS 회사 등록: `UpdateDataModel` 6번 `sys30_leave_year.insertFromSys30`(회사 0의 표 복사)
- AS-IS 사용처: DB 함수 `f_get_close_date`, `f_get_leave_year`, `f_get_leave_days`; 휴가 화면 `Emp20_Edit_Leave` L557(초과허용), `Emp20_Tab_Leave` L194·`Emp20_Tab_YearList` L154(결산월 03)
- TOBE: `SysLeaveYearController` `/api/v1/sys/leave-years`(`GET·PUT /setting`, `GET·PUT·DELETE`)
- TOBE 상태(2026-11-10): **실행** — kalpa에서 API로 조회·저장, DB 함수로 결산기간·연차일수 확인. 화면은 칼파테크에 메뉴가 없어 못 봄. 자동 시험은 아직.
</details>
