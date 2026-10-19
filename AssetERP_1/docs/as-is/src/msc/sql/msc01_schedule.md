# msc01_schedule

`server/msc/mapper/msc01_schedule.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 45 | [`msc01_schedule`](../../../db/tables/msc.md) | `f_cdnm`, `f_org_nm`, `f_sysdate` | `msc.Msc01_Schedule.selectById` |
| `selectByCompanyId` | select | 54 | [`msc01_schedule`](../../../db/tables/msc.md) | `f_cdnm`, `f_org_nm`, `f_sysdate` | - |
| `selectByOrgCodeId` | select | 62 | [`msc01_schedule`](../../../db/tables/msc.md), [`org00_org_info`](../../../db/views.md) |  | - |
| `selectByWeekDay` | select | 85 | [`msc01_schedule`](../../../db/tables/msc.md), [`org00_org_info`](../../../db/views.md) | `f_cdnm`, `f_org_nm` | - |
| `selectByMonDay` | select | 111 | [`msc01_schedule`](../../../db/tables/msc.md) | `f_cdnm`, `f_org_nm` | - |
| `selectByTueDay` | select | 121 | [`msc01_schedule`](../../../db/tables/msc.md) | `f_cdnm`, `f_org_nm`, `f_sysdate` | - |
| `selectByWedDay` | select | 130 | [`msc01_schedule`](../../../db/tables/msc.md) | `f_cdnm`, `f_org_nm`, `f_sysdate` | - |
| `selectByThuDay` | select | 139 | [`msc01_schedule`](../../../db/tables/msc.md) | `f_cdnm`, `f_org_nm`, `f_sysdate` | - |
| `selectByFriDay` | select | 148 | [`msc01_schedule`](../../../db/tables/msc.md) | `f_cdnm`, `f_org_nm`, `f_sysdate` | - |
| `selectByWeekCheck` | select | 158 | - | `f_trunc` | - |
| `selectByDate` | select | 181 | [`msc01_schedule`](../../../db/tables/msc.md), [`org00_org_info`](../../../db/views.md) | `f_cdnm`, `f_org_nm`, `f_sysdate` | `msc.Msc01_Schedule.selectByDate` |
| `selectMonitorngMsc` | select | 223 | [`msc01_schedule`](../../../db/tables/msc.md) |  | `msc.Msc01_Schedule.selectMonitorngMsc` |
| `selectCalendar` | select | 230 | [`msc01_schedule`](../../../db/tables/msc.md), [`org00_org_info`](../../../db/views.md), [`sys12_calendar`](../../../db/tables/sys.md) | `f_trunc` | - |
| `selectByOrg` | select | 379 | [`msc01_schedule`](../../../db/tables/msc.md), [`org00_org_info`](../../../db/views.md) | `f_cdnm`, `f_org_nm`, `f_sysdate` | `msc.Msc01_Schedule.selectByOrg` |
| `selectCalendar2` | select | 412 | [`msc01_schedule`](../../../db/tables/msc.md), [`org00_org_info`](../../../db/views.md), [`sys12_calendar`](../../../db/tables/sys.md) | `f_trunc` | - |
