# fbx.Fbx01_Box

`server/fbx/Fbx01_Box.java`

서비스 키 `fbx.Fbx01_Box.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`fbx01_box.selectById`](../../fbx/sql/fbx01_box.md) | - |  |
| `selectByCompanyId` | 30 | [`fbx01_box.selectByCompanyId`](../../fbx/sql/fbx01_box.md) | `Fbx01_Tab_Document`, `Fbx01_Tab_Search` |  |
| `selectByDcrClassId` | 41 | [`fbx01_box.selectByDcrClassId`](../../fbx/sql/fbx01_box.md) | `Fbx01_Tab_BoxDocument` |  |
| `update` | 59 | `UpdateDataModel(fbx01_box)` 동적 INSERT/UPDATE | `Fbx01_Tab_BoxDocument`, `Fbx01_Tab_Document`, `Fbx01_Tab_Search` | `UpdateDataModel` |
| `delete` | 64 | `UpdateDataModel(fbx01_box)` 동적 DELETE | `Fbx01_Tab_BoxDocument`, `Fbx01_Tab_Document`, `Fbx01_Tab_Search` | `UpdateDataModel` |
