# tdm.Tdm36_RoleReport

`server/tdm/Tdm36_RoleReport.java`

서비스 키 `tdm.Tdm36_RoleReport.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`tdm36_role_report.selectById`](../../tdm/sql/tdm36_role_report.md) | - |  |
| `selectByDate` | 23 | [`tdm36_role_report.selectByDate`](../../tdm/sql/tdm36_role_report.md) | `Tdm36_Tab_RoleReport` |  |
| `getAttachList` | 35 | [`tdm36_role_report.getAttachList`](../../tdm/sql/tdm36_role_report.md) | `Tdm36_TabPage_RoleReport` |  |
| `update` | 43 | `UpdateDataModel(tdm36_role_report)` 동적 INSERT/UPDATE | `Tdm36_Tab_RoleReport` | `UpdateDataModel` |
| `delete` | 48 | `UpdateDataModel(tdm36_role_report)` 동적 DELETE | `Tdm36_Tab_RoleReport` | `UpdateDataModel` |
