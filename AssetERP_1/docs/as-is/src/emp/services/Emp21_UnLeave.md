# emp.Emp21_UnLeave

`server/emp/Emp21_UnLeave.java`

서비스 키 `emp.Emp21_UnLeave.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 41 | [`emp21_un_leave.selectById`](../../emp/sql/emp21_un_leave.md) | - |  |
| `selectByPersonId` | 49 | [`emp21_un_leave.selectByPersonId`](../../emp/sql/emp21_un_leave.md) | `Emp21_Tab_PersonList` |  |
| `selectByCompanyId` | 61 | [`emp21_un_leave.selectByCompanyId`](../../emp/sql/emp21_un_leave.md) | - |  |
| `selectByUnLeaveCode` | 71 | [`emp21_un_leave.selectByUnLeaveCode`](../../emp/sql/emp21_un_leave.md) | `Emp21_TabPage_UnLeaveList1` |  |
| `selectByUnLeaveCode2` | 83 | [`emp21_un_leave.selectByUnLeaveCode2`](../../emp/sql/emp21_un_leave.md) | `Emp21_TabPage_UnLeaveList2` |  |
| `insert` | 95 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp01_person.selectByUnLeaveCode`](../../emp/sql/emp01_person.md), [`emp21_un_leave.insert`](../../emp/sql/emp21_un_leave.md) | `Emp21_Lookup_Insert` |  |
| `insert2` | 128 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp01_person.selectByUnLeaveCode2`](../../emp/sql/emp01_person.md), [`emp21_un_leave.insert`](../../emp/sql/emp21_un_leave.md) | `Emp21_TabPage_UnLeaveList2` |  |
| `insertAppr` | 159 | [`apr01_appr.insertApproval`](../../apr/sql/apr01_appr.md), [`apr04_appr_step.insertApproval`](../../apr/sql/apr04_appr_step.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp21_un_leave.updateApprId`](../../emp/sql/emp21_un_leave.md), [`emp22_etc_leave.getLeaveDate`](../../emp/sql/emp22_etc_leave.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys12_calendar.selectByDate`](../../sys/sql/sys12_calendar.md) | `Emp21_TabPage_UnLeaveList1` | `Calendar`, `DateUtil` |
| `insertAppr2` | 387 | [`apr01_appr.insertApproval`](../../apr/sql/apr01_appr.md), [`apr04_appr_step.insertApproval`](../../apr/sql/apr04_appr_step.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp21_un_leave.updateApprId`](../../emp/sql/emp21_un_leave.md), [`emp22_etc_leave.getLeaveDate`](../../emp/sql/emp22_etc_leave.md), [`sys12_calendar.selectByDate`](../../sys/sql/sys12_calendar.md) | `Emp21_TabPage_UnLeaveList2` | `Calendar`, `DateUtil` |
| `getHtmlContent02_1` | 603 | - | `Apr01_Edit_ApprDoc` |  |
| `getHtmlContent02_2` | 609 | - | `Apr01_Edit_ApprDoc` |  |
| `sendMessage` | 615 | [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) | `Emp21_TabPage_UnLeaveList1`, `Emp21_TabPage_UnLeaveList2` | `Calendar`, `SendSMSAPIFunction` |
| `update` | 674 | `UpdateDataModel(emp21_un_leave)` 동적 INSERT/UPDATE | `Emp21_TabPage_UnLeaveList1`, `Emp21_TabPage_UnLeaveList2`, `Emp21_Tab_PersonList` | `UpdateDataModel` |
| `delete` | 679 | `UpdateDataModel(emp21_un_leave)` 동적 DELETE | `Emp21_TabPage_UnLeaveList1`, `Emp21_TabPage_UnLeaveList2` | `UpdateDataModel` |
