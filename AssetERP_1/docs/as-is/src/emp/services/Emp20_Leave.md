# emp.Emp20_Leave

`server/emp/Emp20_Leave.java`

서비스 키 `emp.Emp20_Leave.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 34 | [`emp20_leave.selectById`](../../emp/sql/emp20_leave.md) | `Emp20_Edit_Leave` |  |
| `selectByPersonId` | 42 | [`emp20_leave.selectByPersonId`](../../emp/sql/emp20_leave.md) | `Emp20_Tab_Leave`, `Emp20_Tab_LeaveManager` |  |
| `selectByDate` | 48 | [`emp20_leave.selectByDate`](../../emp/sql/emp20_leave.md) | `Monitoring_Page_Relate` |  |
| `selectByDatePaging` | 58 | [`emp20_leave.selectByDatePaging`](../../emp/sql/emp20_leave.md), [`emp20_leave.selectByDatePagingTotal`](../../emp/sql/emp20_leave.md) | - |  |
| `selectByPersonName` | 64 | [`emp20_leave.selectByPersonName`](../../emp/sql/emp20_leave.md) | `Emp20_Tab_LeaveList` |  |
| `selectByDays` | 77 | [`emp20_leave.selectByDays`](../../emp/sql/emp20_leave.md) | `Emp20_Tab_Leave`, `Emp20_Tab_LeaveManager` |  |
| `count` | 83 | [`emp20_leave.count`](../../emp/sql/emp20_leave.md), [`emp20_leave.countByDate`](../../emp/sql/emp20_leave.md) | `Emp20_Edit_Leave` |  |
| `leaveDateCheck` | 100 | [`emp20_leave.leaveDateCheck`](../../emp/sql/emp20_leave.md) | - |  |
| `checkSpcLeaveCode` | 115 | [`emp20_leave.checkSpcLeaveCode`](../../emp/sql/emp20_leave.md) | `Sys09_Lookup_Code` |  |
| `cancelUpdate` | 124 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr04_appr_step.selectByApprId`](../../apr/sql/apr04_appr_step.md), [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp20_leave.cancelUpdate`](../../emp/sql/emp20_leave.md), [`emp92_sms_notice.sendCheckMail`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckSms`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckTalk`](../../emp/sql/emp92_sms_notice.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | `Emp20_Tab_LeaveManager` | `SendMailMaster`, `SendSMSAPIFunction`, `SendTalkAPI` |
| `updateOverConfirm` | 241 | [`emp20_leave.selectById`](../../emp/sql/emp20_leave.md), [`emp20_leave.updateOverConfirm`](../../emp/sql/emp20_leave.md) | `Emp20_Edit_Leave`, `Emp20_Tab_LeaveManager` |  |
| `modelUpdate` | 248 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp20_leave)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `update` | 261 | `UpdateDataModel(emp20_leave)` 동적 INSERT/UPDATE | `Emp20_Edit_Leave` | `UpdateDataModel` |
| `delete` | 284 | `UpdateDataModel(emp20_leave)` 동적 DELETE | `Emp20_Tab_Leave` | `UpdateDataModel` |
