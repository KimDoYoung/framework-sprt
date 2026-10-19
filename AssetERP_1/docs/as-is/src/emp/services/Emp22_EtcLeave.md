# emp.Emp22_EtcLeave

`server/emp/Emp22_EtcLeave.java`

서비스 키 `emp.Emp22_EtcLeave.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`emp22_etc_leave.selectById`](../../emp/sql/emp22_etc_leave.md) | `Emp22_Tab_EtcLeave`, `Emp23_Page_EtcLeavePerson` |  |
| `selectByCompanyId` | 29 | [`emp22_etc_leave.selectByCompanyId`](../../emp/sql/emp22_etc_leave.md) | - |  |
| `selectByEtcLeaveId` | 39 | [`emp22_etc_leave.selectByEtcLeaveId`](../../emp/sql/emp22_etc_leave.md) | `Emp20_Edit_Leave` |  |
| `selectByPersonId` | 45 | [`emp22_etc_leave.selectByPersonId`](../../emp/sql/emp22_etc_leave.md) | `Emp22_Lookup_EtcLeave` |  |
| `selectByDate` | 57 | [`emp22_etc_leave.selectByDate`](../../emp/sql/emp22_etc_leave.md) | `Emp22_Tab_EtcLeave` |  |
| `selectByDays` | 70 | [`emp22_etc_leave.selectByDays`](../../emp/sql/emp22_etc_leave.md) | `Emp20_Tab_Leave`, `Emp20_Tab_LeaveManager` |  |
| `checkRemain` | 76 | [`emp22_etc_leave.checkRemain`](../../emp/sql/emp22_etc_leave.md) | - |  |
| `updateApprId` | 89 | [`emp22_etc_leave.updateApprId`](../../emp/sql/emp22_etc_leave.md) | `Emp22_Tab_EtcLeave` |  |
| `deleteApprId` | 101 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md) | `Emp22_Tab_EtcLeave` |  |
| `update` | 111 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), `UpdateDataModel(emp22_etc_leave)` 동적 INSERT/UPDATE | `Emp22_Tab_EtcLeave` | `UpdateDataModel` |
| `delete` | 133 | `UpdateDataModel(emp22_etc_leave)` 동적 DELETE | `Emp22_Tab_EtcLeave` | `UpdateDataModel` |
