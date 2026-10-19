# emp.Emp03_Trans

`server/emp/Emp03_Trans.java`

서비스 키 `emp.Emp03_Trans.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByPersonId` | 23 | [`emp03_trans.selectByPersonId`](../../emp/sql/emp03_trans.md) | `Emp03_TabPage_Trans` |  |
| `selectByHistory` | 29 | [`emp03_trans.selectByHistory`](../../emp/sql/emp03_trans.md) | `Emp00_Tab_ChangeHistory` |  |
| `selectByText` | 35 | [`emp03_trans.selectByText`](../../emp/sql/emp03_trans.md) | `Emp01_Lookup_PersonModel`, `Emp01_Lookup_TransDate` |  |
| `selectByGrade` | 68 | [`emp03_trans.selectByGrade`](../../emp/sql/emp03_trans.md) | `Emp03_Lookup_Grade`, `Sys25_Tab_ResetPassword` |  |
| `getGrade` | 86 | [`emp03_trans.getGrade`](../../emp/sql/emp03_trans.md) | - |  |
| `selectByPasswordPersonId` | 93 | [`emp03_trans.selectByPasswordPersonId`](../../emp/sql/emp03_trans.md) | `Sys25_Tab_ResetPassword` |  |
| `selectByDate` | 113 | [`emp03_trans.selectByDate`](../../emp/sql/emp03_trans.md) | `Apr01_Edit_ApprDoc` |  |
| `selectByTdmYn` | 140 | [`emp03_trans.selectByTdmYn`](../../emp/sql/emp03_trans.md) | `Emp00_Lookup_SelectSingleTdm` |  |
| `LoginCheck` | 146 | [`emp03_trans.LoginCheck`](../../emp/sql/emp03_trans.md) | `LoginPage` |  |
| `Monitoring` | 156 | [`emp03_trans.Monitoring`](../../emp/sql/emp03_trans.md) | - |  |
| `MonitoringByText` | 167 | [`emp03_trans.MonitoringByText`](../../emp/sql/emp03_trans.md) | `Monitoring_Page_Emp` |  |
| `deleteCheck` | 179 | [`emp03_trans.deleteCheck`](../../emp/sql/emp03_trans.md) | `Emp03_TabPage_Trans` |  |
| `update` | 195 | `UpdateDataModel(emp03_trans)` 동적 INSERT/UPDATE | `Emp03_Edit_Trans`, `Emp03_Lookup_Grade`, `Emp03_TabPage_Trans` | `UpdateDataModel` |
| `delete` | 200 | `UpdateDataModel(emp03_trans)` 동적 DELETE | `Emp03_Edit_Trans`, `Emp03_TabPage_Trans` | `UpdateDataModel` |
