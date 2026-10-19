# emp22_etc_leave

`server/emp/mapper/emp22_etc_leave.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 25 | [`apr01_appr`](../../../db/tables/apr.md), [`emp22_etc_leave`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp22_EtcLeave.selectById` |
| `selectByCompanyId` | select | 34 | [`apr01_appr`](../../../db/tables/apr.md), [`emp22_etc_leave`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp22_EtcLeave.selectByCompanyId` |
| `selectByEtcLeaveId` | select | 43 | [`emp20_leave`](../../../db/tables/emp.md), [`emp22_etc_leave`](../../../db/tables/emp.md) |  | `emp.Emp22_EtcLeave.selectByEtcLeaveId` |
| `selectByPersonId` | select | 54 | [`apr01_appr`](../../../db/tables/apr.md), [`emp20_leave`](../../../db/tables/emp.md), [`emp22_etc_leave`](../../../db/tables/emp.md), [`emp23_etc_leave_person`](../../../db/tables/emp.md) |  | `emp.Emp22_EtcLeave.selectByPersonId` |
| `selectByDate` | select | 71 | [`apr01_appr`](../../../db/tables/apr.md), [`emp22_etc_leave`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate` | `emp.Emp22_EtcLeave.selectByDate` |
| `selectByDays` | select | 85 | [`emp01_person`](../../../db/tables/emp.md) | `f_get_leave_days2`, `f_today` | `emp.Emp22_EtcLeave.selectByDays` |
| `getLeaveDate` | select | 99 | [`apr01_appr`](../../../db/tables/apr.md), [`emp22_etc_leave`](../../../db/tables/emp.md), [`emp23_etc_leave_person`](../../../db/tables/emp.md) |  | `emp.Emp21_UnLeave.insertAppr`, `emp.Emp21_UnLeave.insertAppr2` |
| `checkRemain` | select | 112 | [`emp20_leave`](../../../db/tables/emp.md), [`emp22_etc_leave`](../../../db/tables/emp.md), [`emp23_etc_leave_person`](../../../db/tables/emp.md), [`sys12_calendar`](../../../db/tables/sys.md) |  | `emp.Emp22_EtcLeave.checkRemain` |
| `updateApprId` | update | 133 | [`emp22_etc_leave`](../../../db/tables/emp.md) |  | `emp.Emp22_EtcLeave.updateApprId` |
