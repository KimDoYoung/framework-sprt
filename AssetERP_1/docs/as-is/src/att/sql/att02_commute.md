# att02_commute

`server/att/mapper/att02_commute.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 48 | [`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att02_commute`](../../../db/tables/att.md), [`att03_overtime_req`](../../../db/tables/att.md), [`att04_commute_hist`](../../../db/tables/att.md), [`emp01_person`](../../../db/tables/emp.md), [`sys12_calendar`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `att.Att02_Commute.selectById`, `att.Att04_CommuteHist.insertList` |
| `selectByDate` | select | 175 | [`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att02_commute`](../../../db/tables/att.md), [`att03_overtime_req`](../../../db/tables/att.md), [`att04_commute_hist`](../../../db/tables/att.md), [`emp01_person`](../../../db/tables/emp.md), [`sys12_calendar`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `att.Att02_Commute.insertOffWork`, `att.Att02_Commute.selectByDate` |
| `selectByTextAdmin` | select | 305 | [`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att02_commute`](../../../db/tables/att.md), [`att03_overtime_req`](../../../db/tables/att.md), [`att04_commute_hist`](../../../db/tables/att.md), [`att05_pm_work`](../../../db/tables/att.md), [`emp01_person`](../../../db/tables/emp.md), [`sys12_calendar`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `att.Att02_Commute.selectByTextAdmin` |
| `getCommuteStatus` | select | 576 | [`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att02_commute`](../../../db/tables/att.md), [`att03_overtime_req`](../../../db/tables/att.md), [`att04_commute_hist`](../../../db/tables/att.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp20_leave`](../../../db/tables/emp.md), [`pay34_work_time_config`](../../../db/tables/pay.md), [`sys12_calendar`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `att.Att02_Commute.getCommuteStatus` |
| `getPersonStatus` | select | 825 | [`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att02_commute`](../../../db/tables/att.md), [`att03_overtime_req`](../../../db/tables/att.md), [`att04_commute_hist`](../../../db/tables/att.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp20_leave`](../../../db/tables/emp.md), [`pay34_work_time_config`](../../../db/tables/pay.md), [`sys12_calendar`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `att.Att02_Commute.getPersonStatus` |
| `getLastInfo` | select | 1026 | [`att02_commute`](../../../db/tables/att.md) |  | `att.Att02_Commute.getLastInfo` |
| `checkWorkDate` | select | 1037 | [`att02_commute`](../../../db/tables/att.md) |  | `att.Att02_Commute.insert` |
| `insert` | insert | 1046 | [`att02_commute`](../../../db/tables/att.md) | `f_create_seq` | `att.Att02_Commute.insert` |
| `insertBatch` | insert | 1064 | [`att01_work_policy`](../../../db/tables/att.md), [`att02_commute`](../../../db/tables/att.md), [`emp20_leave`](../../../db/tables/emp.md), [`sys12_calendar`](../../../db/tables/sys.md) | `f_create_seq` | `att.Att02_Commute.insertBatch` |
| `adminCheck` | update | 1120 | [`att02_commute`](../../../db/tables/att.md) |  | `att.Att02_Commute.adminCheck` |
| `updateOff` | update | 1126 | [`att02_commute`](../../../db/tables/att.md) |  | `att.Att02_Commute.insert` |
| `updateOffWork` | update | 1133 | [`att02_commute`](../../../db/tables/att.md) |  | `att.Att02_Commute.insertOffWork` |
| `updateReason` | update | 1153 | [`att02_commute`](../../../db/tables/att.md) |  | `att.Att02_Commute.updateReason` |
| `updateCheckOutTime` | update | 1168 | [`att02_commute`](../../../db/tables/att.md) |  | `att.Att02_Commute.updateCheckOutTime` |
