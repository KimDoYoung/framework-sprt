# emp.Emp08_License

`server/emp/Emp08_License.java`

서비스 키 `emp.Emp08_License.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByPersonId` | 16 | [`emp08_license.selectByPersonId`](../../emp/sql/emp08_license.md) | `Emp08_TabPage_License` |  |
| `selectByHistory` | 22 | [`emp08_license.selectByHistory`](../../emp/sql/emp08_license.md) | `Emp00_Tab_ChangeHistory` |  |
| `update` | 28 | `UpdateDataModel(emp08_license)` 동적 INSERT/UPDATE | `Emp08_TabPage_License` | `UpdateDataModel` |
| `delete` | 33 | `UpdateDataModel(emp08_license)` 동적 DELETE | `Emp08_TabPage_License` | `UpdateDataModel` |
