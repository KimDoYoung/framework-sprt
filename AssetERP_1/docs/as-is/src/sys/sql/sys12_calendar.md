# sys12_calendar

`server/sys/mapper/sys12_calendar.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`sys01_company`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md) |  | `sys.Sys12_Calendar.selectById` |
| `selectByCloseCheck` | select | 26 | [`sys12_calendar`](../../../db/tables/sys.md) |  | - |
| `selectByYear` | select | 32 | [`sys12_calendar`](../../../db/tables/sys.md) |  | `sys.Sys12_Calendar.selectByYear` |
| `selectByDate` | select | 45 | [`sys12_calendar`](../../../db/tables/sys.md) |  | `emp.Emp21_UnLeave.insertAppr`, `emp.Emp21_UnLeave.insertAppr2` |
| `selectByTargetDate` | select | 53 | [`sys12_calendar`](../../../db/tables/sys.md) |  | - |
| `workDay` | select | 61 | [`sys12_calendar`](../../../db/tables/sys.md) |  | `pay.Pay02_Month.insert` |
| `selectByDay` | select | 69 | [`sys01_company`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md) |  | `sys.Sys12_Calendar.selectByDay` |
| `workDayPerson` | select | 88 | [`sys12_calendar`](../../../db/tables/sys.md) |  | `pay.Pay10_Month.insert` |
| `bizDate` | select | 102 | - | `f_get_biz_date` | `sys.Sys12_Calendar.selectBizDate` |
| `bizDate2` | select | 106 | - | `f_get_biz_date2` | `sys.Sys12_Calendar.selectBizDate2` |
| `selectPeriod` | select | 110 | [`sys12_calendar`](../../../db/tables/sys.md) |  | `ast.Ast09_Book.selectByHoldDatePeriod`, `icam.Icam10_Fee.createFeeRcvTr` |
| `selectMonthLastDay` | select | 118 | [`sys12_calendar`](../../../db/tables/sys.md) | `f_get_last_day` | `sys.Sys99_Print.insertIcsCheckListStatus` |
| `selectQuarterLastDay` | select | 127 | [`sys12_calendar`](../../../db/tables/sys.md) | `f_get_last_day`, `f_get_quarter_date` | `sys.Sys99_Print.insertIcsCheckListStatus` |
| `getWorkDay` | select | 136 | [`sys12_calendar`](../../../db/tables/sys.md) |  | `car.Car04_Journal.batch` |
| `insertTibero` | sql | 145 | [`sys12_calendar`](../../../db/tables/sys.md) |  |  |
| `insertPostgreSql` | sql | 165 | [`sys12_calendar`](../../../db/tables/sys.md), [`sys14_holiday`](../../../db/tables/sys.md) | `f_create_seq` |  |
| `insertAuto` | insert | 197 | [`sys12_calendar`](../../../db/tables/sys.md), [`sys14_holiday`](../../../db/tables/sys.md) | `f_create_seq` | `sys.Sys12_Calendar.insertAuto` |
| `insertFormSys12` | insert | 211 | [`sys12_calendar`](../../../db/tables/sys.md), [`sys14_holiday`](../../../db/tables/sys.md) | `f_create_seq`, `f_sysdate` | - |
| `deleteByDay` | delete | 245 | [`sys12_calendar`](../../../db/tables/sys.md) |  | `sys.Sys12_Calendar.insertAuto` |
