# crd.Crd03_Trans

`server/crd/Crd03_Trans.java`

서비스 키 `crd.Crd03_Trans.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`crd03_trans.selectById`](../../crd/sql/crd03_trans.md) | - |  |
| `selectByCardId` | 27 | [`crd03_trans.selectByCardId`](../../crd/sql/crd03_trans.md) | `Crd03_Grid_User` |  |
| `deleteByCardId` | 34 | [`crd03_trans.deleteByCardId`](../../crd/sql/crd03_trans.md) | `Crd01_Tab_Card` |  |
| `update` | 43 | `UpdateDataModel(crd03_trans)` 동적 INSERT/UPDATE | `Crd03_Grid_User` | `UpdateDataModel` |
| `delete` | 48 | `UpdateDataModel(crd03_trans)` 동적 DELETE | `Crd03_Grid_User` | `UpdateDataModel` |
