# bbs.Bbs33_Role

`server/bbs/Bbs33_Role.java`

서비스 키 `bbs.Bbs33_Role.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`bbs33_role.selectById`](../../bbs/sql/bbs33_role.md) | - |  |
| `selectByClassTreeId` | 24 | [`bbs33_role.selectByClassTreeId`](../../bbs/sql/bbs33_role.md) | `Bbs33_Lookup_Role` |  |
| `checkRole` | 30 | [`bbs33_role.checkRole`](../../bbs/sql/bbs33_role.md) | `Bbs31_Grid_Content` |  |
| `update` | 42 | `UpdateDataModel(bbs33_role)` 동적 INSERT/UPDATE | `Bbs33_Lookup_Role` | `UpdateDataModel` |
| `delete` | 47 | `UpdateDataModel(bbs33_role)` 동적 DELETE | `Bbs33_Lookup_Role` | `UpdateDataModel` |
