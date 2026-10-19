# emp.Emp56_Share

`server/emp/Emp56_Share.java`

서비스 키 `emp.Emp56_Share.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`emp56_share.selectById`](../../emp/sql/emp56_share.md) | - |  |
| `selectByParentId` | 22 | [`emp56_share.selectByParentId`](../../emp/sql/emp56_share.md) | `Emp56_Lookup_Share` |  |
| `selectShareInfo` | 28 | [`emp56_share.selectShareInfo`](../../emp/sql/emp56_share.md) | `Emp56_Lookup_Share` |  |
| `update` | 33 | `UpdateDataModel(emp56_share)` 동적 INSERT/UPDATE | `Emp56_Lookup_Share` | `UpdateDataModel` |
| `delete` | 38 | `UpdateDataModel(emp56_share)` 동적 DELETE | `Emp56_Lookup_Share` | `UpdateDataModel` |
